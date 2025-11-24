# 🚀 Deploy Guide

## Quick Start - Deploy qua GitHub Actions (Khuyến nghị)

```bash
npm run deploy:github:patch   # 1.0.1 -> 1.0.2
npm run deploy:github:minor   # 1.0.1 -> 1.1.0
npm run deploy:github:major   # 1.0.1 -> 2.0.0
```

## ⚙️ Setup lần đầu (Quan trọng!)

### 1. Tạo NPM Access Token

1. Đăng nhập [npmjs.com](https://www.npmjs.com)
2. Click avatar → **Access Tokens** → **Generate New Token**
3. Chọn type: **Automation**
4. Copy token (CHỈ HIỆN 1 LẦN!)

### 2. Thêm NPM_TOKEN vào GitHub Secrets

1. Vào: `https://github.com/anhdev99/ad99-ag-grid-table/settings/secrets/actions`
2. Click **New repository secret**
3. Name: `NPM_TOKEN`
4. Value: paste token vừa copy
5. Click **Add secret**

### 3. Enable GitHub Actions

1. Vào tab **Actions** trên repo
2. Nếu workflows bị disabled, click **I understand my workflows, go ahead and enable them**

✅ Done! Giờ có thể deploy qua GitHub Actions

## 📋 Workflow Deploy

### Deploy version mới:

```bash
# 1. Code & test
npm run dev
npm run build
npm run precheck

# 2. Commit
git add .
git commit -m "feat: add new feature"
git push origin main

# 3. Deploy (bump version + push tag)
npm run deploy:github:patch

# 4. Xem GitHub Actions
# https://github.com/anhdev99/ad99-ag-grid-table/actions
```

GitHub Actions sẽ tự động:
- ✅ Lint & Build trên Node 18 & 20
- ✅ Publish lên npm
- ✅ Tạo GitHub Release

## 🔧 Commands

### GitHub Actions Deploy
```bash
npm run deploy:github:patch   # Bug fixes
npm run deploy:github:minor   # New features  
npm run deploy:github:major   # Breaking changes
```

### Manual Deploy (trực tiếp từ máy)
```bash
npm run deploy:patch          # Deploy trực tiếp lên npm
npm run deploy:minor
npm run deploy:major
```

### Local Testing
```bash
npm run deploy:local          # Tạo .tgz file để test
npm run precheck              # Kiểm tra trước khi deploy
```

## 🔄 GitHub Actions Workflows

### CI Workflow (`.github/workflows/ci.yml`)
- Trigger: Push/PR to `main` or `develop`
- Actions: Lint → Build → Verify artifacts
- Test on: Node.js 18 & 20

### Publish Workflow (`.github/workflows/publish.yml`)
- Trigger: Push tag `v*.*.*`
- Actions: Lint → Build → Publish npm → Create Release

## 🛠️ Troubleshooting

### "Error: Unable to find NPM_TOKEN"
→ Chưa setup NPM_TOKEN trong GitHub Secrets (xem Setup phía trên)

### "You must be logged in to publish" (khi dùng deploy manual)
```bash
npm login
```

### "You do not have permission to publish"
→ Package name đã tồn tại. Đổi name trong `package.json`

### Test trước khi publish thật
```bash
npm publish --dry-run
```

## 📦 Sau khi deploy

Package có thể cài đặt:
```bash
npm install ad99-ag-grid-table
```

Xem trên npm:
```
https://www.npmjs.com/package/ad99-ag-grid-table
```

Xem GitHub Releases:
```
https://github.com/anhdev99/ad99-ag-grid-table/releases
```

## 📝 Semantic Versioning

- **patch** (1.0.1 → 1.0.2): Bug fixes, không breaking
- **minor** (1.0.1 → 1.1.0): New features, backward compatible
- **major** (1.0.1 → 2.0.0): Breaking changes

## 🚨 Lưu ý quan trọng

- ⚠️ Không thể xóa version đã publish (chỉ có thể deprecate)
- ⚠️ NPM_TOKEN cần quyền Automation, không dùng Classic token
- ⚠️ Mỗi version tự động tạo git tag `v1.0.1`
- ✅ GitHub Actions tự động rollback nếu có lỗi
