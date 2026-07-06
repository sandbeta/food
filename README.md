# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


## 部署到 Vercel（推荐，更简单）

GitHub Pages 已经可以访问，但 Vercel 速度更快、无需处理路径问题。

### 只需 2 步：

1. **获取 Vercel Token**
   - 打开 https://vercel.com/account/tokens
   - 点击 "Create Token"，名称填 `food-app`，Scope 选 `Full Account`
   - 复制生成的 token

2. **添加到 GitHub Secrets**
   - 打开你的 GitHub 仓库：`https://github.com/sandbeta/food/settings/secrets/actions`
   - 点击 "New repository secret"
   - Name 填 `VERCEL_TOKEN`，Value 粘贴刚才复制的 token
   - 再创建两个 secret：
     - `VERCEL_ORG_ID`：你的 Vercel 团队 ID（个人账号就是用户名）
     - `VERCEL_PROJECT_ID`：在 Vercel 创建项目后获取

3. **Push 代码**，GitHub Actions 会自动部署到 Vercel

> 更简单的方式：直接登录 https://vercel.com/new ，Import `sandbeta/food`，30 秒完成。
