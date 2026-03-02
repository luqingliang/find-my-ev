# find-my-ev

`find-my-ev` 是一个基于 Next.js 的纯前端电动车查询与对比项目。

## 功能说明

- 车型卡片列表浏览
- 支持模糊搜索（`Fuse.js`）
- 支持品牌、最高价格、最低续航筛选
- 支持按价格、续航、快充时间排序
- 最多可同时对比 4 台车型
- 对比列表持久化到 `localStorage`

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

浏览器访问：`http://localhost:3000`

## 目录结构

```text
src/
  app/            # 路由与页面
  components/     # 组件
  data/           # 本地静态车型数据
  lib/            # i18n 与状态管理
  types/          # 类型定义
```

## 说明

- 车型数据目前来自本地静态文件：`src/data/cars.ts`
- 当前项目为前端项目，未接入后端服务
