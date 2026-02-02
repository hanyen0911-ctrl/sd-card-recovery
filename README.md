# SD卡救援網站

專業的 SD 卡資料救援指南網站，提供免費教學和工具推薦。

## 🚀 快速開始

### 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 訪問 http://localhost:4321
```

### 建置

```bash
npm run build
```

### 預覽建置結果

```bash
npm run preview
```

## 📦 部署

此專案已配置好 Vercel 部署設定。

### 方法 1：Vercel CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 部署
vercel

# 部署到正式環境
vercel --prod
```

### 方法 2：Vercel Dashboard

1. 將程式碼推送到 GitHub
2. 在 Vercel Dashboard 匯入 repository
3. Vercel 會自動偵測 Astro 並部署

## 🛠️ 技術棧

- **框架**: Astro 4.0
- **UI**: Tailwind CSS
- **互動**: React 18
- **部署**: Vercel
- **分析**: GA4 + GTM

## 📁 專案結構

```
├── src/
│   ├── pages/          # 頁面
│   ├── layouts/        # 版面配置
│   └── components/     # 元件
├── content/
│   └── guides/         # 教學內容
├── admin/              # CMS 後台
└── public/             # 靜態資源
```

## 📄 授權

© 2025 SD卡救援專家
