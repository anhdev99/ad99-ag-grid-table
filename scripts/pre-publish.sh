#!/bin/bash

# Pre-publish checks
# Kiểm tra trước khi publish

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔍 Kiểm tra trước khi publish...${NC}\n"

# Check if logged in to npm
if ! npm whoami &> /dev/null; then
    echo -e "${RED}❌ Bạn chưa đăng nhập npm${NC}"
    echo -e "${YELLOW}Chạy: npm login${NC}"
    exit 1
fi
NPM_USER=$(npm whoami)
echo -e "${GREEN}✓ Đã đăng nhập npm: $NPM_USER${NC}"

# Check package name availability
PACKAGE_NAME=$(node -p "require('./package.json').name")
echo -e "\n${YELLOW}Kiểm tra package name: $PACKAGE_NAME${NC}"

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Thư mục dist không tồn tại${NC}"
    echo -e "${YELLOW}Chạy: npm run build${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Thư mục dist tồn tại${NC}"

# Check required files in dist
REQUIRED_FILES=("index.cjs" "index.mjs" "style.css" "types")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -e "dist/$file" ]; then
        echo -e "${RED}❌ Thiếu file: dist/$file${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✓ Các file cần thiết đều có${NC}"

# Check package.json fields
echo -e "\n${YELLOW}Kiểm tra package.json...${NC}"
REQUIRED_FIELDS=("name" "version" "main" "module" "types" "exports")
for field in "${REQUIRED_FIELDS[@]}"; do
    if ! node -p "require('./package.json').$field" &> /dev/null; then
        echo -e "${RED}❌ Thiếu field: $field${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✓ Package.json hợp lệ${NC}"

# Show what will be published
echo -e "\n${YELLOW}📋 Files sẽ được publish:${NC}"
npm pack --dry-run 2>&1 | grep -A 100 "package:" || true

echo -e "\n${GREEN}✅ Tất cả kiểm tra đều pass!${NC}"
echo -e "${YELLOW}Sẵn sàng để publish.${NC}"
