#!/bin/bash

# Deploy sử dụng GitHub Actions
# Script này tạo tag và push lên GitHub, trigger CI/CD

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

VERSION_TYPE=${1:-patch}

echo -e "${BLUE}🚀 Deploy qua GitHub Actions...${NC}\n"

# Check git is clean
if [[ -n $(git status -s) ]]; then
    echo -e "${RED}❌ Git working directory không sạch. Commit changes trước.${NC}"
    git status -s
    exit 1
fi

# Check on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    echo -e "${YELLOW}⚠️  Bạn đang ở branch: $CURRENT_BRANCH${NC}"
    read -p "Tiếp tục? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check remote
if ! git remote get-url origin &> /dev/null; then
    echo -e "${RED}❌ Không tìm thấy remote origin${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Git working directory sạch${NC}"

# Pull latest
echo -e "\n${YELLOW}📥 Pull latest changes...${NC}"
git pull origin $CURRENT_BRANCH

# Run validation
echo -e "\n${YELLOW}🔍 Running validation checks...${NC}"
if ! npm run validate; then
    echo -e "${RED}❌ Validation failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ All validations passed${NC}"

# Bump version
echo -e "\n${YELLOW}📦 Bump version ($VERSION_TYPE)...${NC}"
npm version $VERSION_TYPE --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}✓ Version mới: $NEW_VERSION${NC}"

# Commit
git add package.json
git commit -m "chore: bump version to $NEW_VERSION"

# Create tag
TAG="v$NEW_VERSION"
git tag $TAG

echo -e "${GREEN}✓ Đã tạo tag: $TAG${NC}"

# Push
echo -e "\n${YELLOW}⬆️  Push lên GitHub...${NC}"
git push origin $CURRENT_BRANCH
git push origin $TAG

echo -e "\n${GREEN}🎉 Hoàn tất!${NC}"
echo -e "${BLUE}📍 Tag $TAG đã được push${NC}"
echo -e "${BLUE}🤖 GitHub Actions sẽ tự động:${NC}"
echo -e "   1. Chạy lint & build"
echo -e "   2. Publish lên npm"
echo -e "   3. Tạo GitHub Release"
echo -e "\n${YELLOW}👀 Xem progress tại:${NC}"
echo -e "${BLUE}https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions${NC}"
