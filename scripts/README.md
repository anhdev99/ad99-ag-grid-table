# Deploy Scripts

Các script để deploy npm package - hỗ trợ cả manual và GitHub Actions.

## 📦 Scripts có sẵn

### 🚀 Deploy qua GitHub Actions (Khuyến nghị)

```bash
# Bump patch version & trigger GitHub Actions
npm run deploy:github:patch   # 1.0.1 -> 1.0.2

# Bump minor version
npm run deploy:github:minor   # 1.0.1 -> 1.1.0

# Bump major version
npm run deploy:github:major   # 1.0.1 -> 2.0.0
```

**GitHub Actions sẽ tự động:**
- ✅ Chạy CI (lint, build, test trên Node 18 & 20)
- ✅ Publish lên npm registry
- ✅ Tạo GitHub Release với changelog
- ✅ Tạo tag & release notes

**Yêu cầu:** Cần setup `NPM_TOKEN` trong GitHub Secrets (xem bên dưới)

### 📤 Deploy trực tiếp lên npm (Manual)

```bash
# Tự động bump patch version (1.0.1 -> 1.0.2)
npm run deploy:patch

# Bump minor version (1.0.1 -> 1.1.0)
npm run deploy:minor

# Bump major version (1.0.1 -> 2.0.0)
npm run deploy:major

# Hoặc dùng trực tiếp
./scripts/deploy.sh [patch|minor|major]
```

**Script này sẽ:**
- ✅ Kiểm tra git working directory sạch
- ✅ Chạy lint
- ✅ Build package
- ✅ Bump version
- ✅ Commit & tag version mới
- ✅ Publish lên npm
- ✅ Push code & tag lên git

### 2. Deploy local (Test nội bộ)

```bash
npm run deploy:local
```

Tạo file `.tgz` để test trong dự án khác mà không cần publish lên npm.

**Cài đặt local package:**
```bash
npm install /path/to/ad99-ag-grid-table-1.0.1.tgz
```

### 3. Pre-publish checks

```bash
npm run precheck
```

Kiểm tra tất cả điều kiện trước khi publish:
- ✅ Đã login npm
- ✅ Thư mục dist tồn tại
- ✅ Các file cần thiết đều có
- ✅ package.json hợp lệ

## 🔧 Lần đầu sử dụng

### 1. Login npm

```bash
npm login
```

### 2. Kiểm tra package name có available không

```bash
npm view ad99-ag-grid-table
```

Nếu chưa tồn tại, bạn có thể dùng tên này. Nếu đã tồn tại, đổi tên trong `package.json`.

### 3. Test build trước

```bash
npm run build
npm run precheck
```

### 4. Deploy lần đầu

```bash
npm run deploy:github:patch
```

## ⚙️ Setup GitHub Actions

### 1. Tạo NPM Access Token

1. Đăng nhập [npmjs.com](https://www.npmjs.com)
2. Click avatar → **Access Tokens**
3. **Generate New Token** → chọn **Automation**
4. Copy token (chỉ hiện 1 lần!)

### 2. Thêm vào GitHub Secrets

1. Vào repo GitHub: `https://github.com/anhdev99/ad99-ag-grid-table`
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**
   - Name: `NPM_TOKEN`
   - Value: paste token vừa tạo
4. **Add secret**

### 3. Kiểm tra Workflow có enabled

1. **Actions** tab → check workflows có enabled
2. Nếu chưa, click **Enable workflows**

### 4. Test Deploy

```bash
npm run deploy:github:patch
```

Xem progress tại: `https://github.com/anhdev99/ad99-ag-grid-table/actions`

## 🔄 GitHub Actions Workflows

### 1. **CI Workflow** (`.github/workflows/ci.yml`)
- Chạy tự động khi push/PR đến `main` hoặc `develop`
- Test trên Node.js 18 & 20
- Lint + Build + Verify artifacts

### 2. **Publish Workflow** (`.github/workflows/publish.yml`)
- Trigger khi push tag `v*.*.*`
- Lint → Build → Publish npm → Create GitHub Release

## 📋 Workflow khuyến nghị

### Deploy version mới qua GitHub:

1. **Hoàn thành code & test local**
   ```bash
   npm run dev          # Test trong dev mode
   npm run build        # Build thử
   npm run precheck     # Kiểm tra
   ```

2. **Commit code**
   ```bash
   git add .
   git commit -m "feat: thêm tính năng XYZ"
   git push origin main
   ```

3. **Deploy & tạo tag**
   ```bash
   npm run deploy:github:patch
   ```

4. **Theo dõi GitHub Actions**
   - Vào tab Actions trên GitHub
   - Xem workflow "Publish to NPM" đang chạy
   - Đợi ✅ thành công

5. **Verify**
   ```bash
   npm view ad99-ag-grid-table
   ```

### Deploy manual (không qua GitHub):

```bash
npm run deploy:patch
```

1. **Hoàn thành code & commit**
   ```bash
   git add .
   git commit -m "feat: thêm tính năng XYZ"
   ```

2. **Kiểm tra trước khi deploy**
   ```bash
   npm run precheck
   ```

3. **Deploy**
   ```bash
   npm run deploy:patch   # Bug fixes
   npm run deploy:minor   # New features
   npm run deploy:major   # Breaking changes
   ```

### Test local trước khi deploy:

1. **Build & pack local**
   ```bash
   npm run deploy:local
   ```

2. **Test trong dự án khác**
   ```bash
   cd ../my-other-project
   npm install ../ag-grid/ad99-ag-grid-table-1.0.1.tgz
   ```

3. **Nếu OK, deploy qua GitHub**
   ```bash
   cd ../ag-grid
   npm run deploy:github:patch
   ```

## ⚙️ Setup GitHub Actions

### 1. Tạo NPM Access Token

1. Đăng nhập [npmjs.com](https://www.npmjs.com)
2. Click avatar → **Access Tokens**
3. **Generate New Token** → chọn **Automation**
4. Copy token (chỉ hiện 1 lần!)

### 2. Thêm vào GitHub Secrets

1. Vào repo GitHub: `https://github.com/anhdev99/ad99-ag-grid-table`
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**
   - Name: `NPM_TOKEN`
   - Value: paste token vừa tạo
4. **Add secret**

### 3. Kiểm tra Workflow có enabled

1. **Actions** tab → check workflows có enabled
2. Nếu chưa, click **Enable workflows**

### 4. Test Deploy

```bash
npm run deploy:github:patch
```

Xem progress tại: `https://github.com/anhdev99/ad99-ag-grid-table/actions`

## 🔄 GitHub Actions Workflows

### 1. **CI Workflow** (`.github/workflows/ci.yml`)
- Chạy tự động khi push/PR đến `main` hoặc `develop`
- Test trên Node.js 18 & 20
- Lint + Build + Verify artifacts

### 2. **Publish Workflow** (`.github/workflows/publish.yml`)
- Trigger khi push tag `v*.*.*`
- Lint → Build → Publish npm → Create GitHub Release

## 📋 Workflow khuyến nghị

### Deploy version mới qua GitHub:

- **Không thể unpublish**: Sau khi publish, chỉ có thể deprecate, không thể xóa version
- **Semver**: Tuân thủ semantic versioning
  - `patch`: Bug fixes (1.0.1 -> 1.0.2)
  - `minor`: New features, backward compatible (1.0.1 -> 1.1.0)
  - `major`: Breaking changes (1.0.1 -> 2.0.0)
- **Git tags**: Mỗi version tự động tạo git tag `v1.0.1`
- **Rollback**: Nếu publish fail, script tự động rollback git changes

## 🔗 Sau khi deploy

Package có thể cài đặt từ npm:

```bash
npm install ad99-ag-grid-table
```

Xem trên npm:
```
https://www.npmjs.com/package/ad99-ag-grid-table
```

## 🛠️ Troubleshooting

### "You must be logged in to publish packages"
```bash
npm login
```

### "You do not have permission to publish"
Package name đã tồn tại và không thuộc về bạn. Đổi tên trong `package.json`.

### "Git working directory is not clean"
Commit hoặc stash changes trước:
```bash
git add .
git commit -m "your message"
# hoặc
git stash
```

### Test dry-run trước khi publish
```bash
npm publish --dry-run
```
