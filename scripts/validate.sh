#!/bin/bash

# Pre-deploy validation script
# Kiểm tra tất cả lỗi trước khi deploy

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Pre-deploy validation...${NC}\n"

# 1. Check git status
echo -e "${YELLOW}1. Checking git status...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${RED}❌ Git working directory không sạch${NC}"
    git status -s
    exit 1
fi
echo -e "${GREEN}✓ Git working directory sạch${NC}\n"

# 2. Run lint
echo -e "${YELLOW}2. Running lint...${NC}"
if ! npm run lint; then
    echo -e "${RED}❌ Lint failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Lint passed${NC}\n"

# 3. Run build
echo -e "${YELLOW}3. Building package...${NC}"
if ! npm run build; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build successful${NC}\n"

# 4. Check dist files
echo -e "${YELLOW}4. Checking dist files...${NC}"
REQUIRED_FILES=("dist/index.cjs" "dist/index.mjs" "dist/style.css" "dist/types")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -e "$file" ]; then
        echo -e "${RED}❌ Missing: $file${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✓ All required files present${NC}\n"

# 5. Check package.json
echo -e "${YELLOW}5. Validating package.json...${NC}"
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
echo -e "  Package: ${BLUE}${PACKAGE_NAME}${NC}"
echo -e "  Version: ${BLUE}${PACKAGE_VERSION}${NC}"
echo -e "${GREEN}✓ Package.json valid${NC}\n"

# 6. Dry run publish
echo -e "${YELLOW}6. Testing publish (dry-run)...${NC}"
if ! npm publish --dry-run; then
    echo -e "${RED}❌ Publish dry-run failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Publish dry-run successful${NC}\n"

echo -e "${GREEN}✅ All checks passed!${NC}"
echo -e "${BLUE}Ready to deploy: ${PACKAGE_NAME}@${PACKAGE_VERSION}${NC}"
