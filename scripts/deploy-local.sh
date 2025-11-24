#!/bin/bash

# Script deploy local (npm pack) để test nội bộ
# Usage: ./scripts/deploy-local.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📦 Bắt đầu build local package...${NC}\n"

# 1. Run lint
echo -e "${YELLOW}📝 Chạy lint...${NC}"
npm run lint || {
    echo -e "${RED}❌ Lint failed${NC}"
    exit 1
}
echo -e "${GREEN}✓ Lint passed${NC}"

# 2. Build
echo -e "\n${YELLOW}🔨 Building...${NC}"
npm run build
echo -e "${GREEN}✓ Build thành công${NC}"

# 3. Pack
echo -e "\n${YELLOW}📦 Creating .tgz package...${NC}"
PACKAGE_FILE=$(npm pack)
PACKAGE_VERSION=$(node -p "require('./package.json').version")

echo -e "\n${GREEN}✓ Package đã tạo: $PACKAGE_FILE${NC}"
echo -e "${GREEN}✓ Version: $PACKAGE_VERSION${NC}"

# 4. Show installation command
echo -e "\n${YELLOW}📥 Để cài đặt trong dự án khác:${NC}"
echo -e "${GREEN}npm install $(pwd)/$PACKAGE_FILE${NC}"

echo -e "\n${GREEN}🎉 Hoàn tất!${NC}"
