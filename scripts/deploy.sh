#!/bin/bash

# Script deploy npm package
# Usage: ./scripts/deploy.sh [patch|minor|major]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get version bump type (default: patch)
VERSION_TYPE=${1:-patch}

echo -e "${YELLOW}🚀 Bắt đầu deploy npm package...${NC}\n"

# 1. Check if git working directory is clean
if [[ -n $(git status -s) ]]; then
    echo -e "${RED}❌ Git working directory không sạch. Vui lòng commit hoặc stash changes trước.${NC}"
    git status -s
    exit 1
fi

echo -e "${GREEN}✓ Git working directory sạch${NC}"

# 2. Run tests/lint (optional)
echo -e "\n${YELLOW}📝 Chạy lint...${NC}"
npm run lint || {
    echo -e "${RED}❌ Lint failed${NC}"
    exit 1
}
echo -e "${GREEN}✓ Lint passed${NC}"

# 3. Build package
echo -e "\n${YELLOW}🔨 Building package...${NC}"
npm run build || {
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
}
echo -e "${GREEN}✓ Build thành công${NC}"

# 4. Bump version
echo -e "\n${YELLOW}📦 Bump version ($VERSION_TYPE)...${NC}"
npm version $VERSION_TYPE --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}✓ Version mới: $NEW_VERSION${NC}"

# 5. Commit version bump
git add package.json
git commit -m "chore: bump version to $NEW_VERSION"
git tag "v$NEW_VERSION"

echo -e "${GREEN}✓ Đã commit và tag version $NEW_VERSION${NC}"

# 6. Publish to npm
echo -e "\n${YELLOW}📤 Publishing to npm...${NC}"
npm publish --access public || {
    echo -e "${RED}❌ Publish failed${NC}"
    echo -e "${YELLOW}Rollback git changes...${NC}"
    git tag -d "v$NEW_VERSION"
    git reset --hard HEAD~1
    exit 1
}

echo -e "${GREEN}✓ Published thành công!${NC}"

# 7. Push to git
echo -e "\n${YELLOW}⬆️  Pushing to git...${NC}"
git push origin main
git push origin "v$NEW_VERSION"

echo -e "\n${GREEN}🎉 Deploy hoàn tất!${NC}"
echo -e "${GREEN}Package: ad99-ag-grid-table@$NEW_VERSION${NC}"
echo -e "${GREEN}NPM: https://www.npmjs.com/package/ad99-ag-grid-table${NC}"
