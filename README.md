# find-my-ev

`find-my-ev` 是一个基于 Next.js 的 AI Coding 练手项目，用于练习前端工程化、状态管理、搜索筛选和页面交互实现。

## 项目目标

- 用较小规模的业务场景练习 AI 辅助编码工作流
- 练习 App Router 下的页面组织与组件拆分
- 练习筛选、排序、对比、持久化等常见交互逻辑

## 功能说明

- 车型卡片列表浏览
- 模糊搜索（`Fuse.js`）
- 品牌、最高价格、最低续航筛选
- 按价格、续航、快充时间排序
- 最多同时对比 4 台车型
- 对比列表持久化到 `localStorage`
- 中英文切换

## 技术栈

- Next.js（App Router）
- React + TypeScript
- Tailwind CSS
- Zustand
- Fuse.js

## 本地运行

```bash
npm install
npm run dev
```

默认访问：`http://127.0.0.1:3000`  
如果 3000 端口被占用，Next.js 会自动切换到其他端口（例如 `3001`）。

## 目录结构

```text
src/
  app/            # 路由与页面
  components/     # 组件
  data/           # 项目内置数据
  lib/            # i18n 与状态管理
  types/          # 类型定义
```

## 项目说明

- 当前为前端项目，未接入后端服务
- 适合作为 AI Coding 练手与重构实验项目
