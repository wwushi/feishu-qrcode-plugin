# 飞书多维表格二维码生成插件

这是一个飞书多维表格的字段捷径插件，可以将表格中任意字段的内容生成高质量二维码，并支持丰富的个性化配置。

## 安装方法

1. 克隆或下载本项目到本地
2. 进入项目目录，安装依赖：
   ```bash
   npm install
   ```
3. 启动本地调试：
   ```bash
   npm run start
   ```
4. 生成插件包：
   ```bash
   npm run pack
   ```
   执行后将在 `output` 目录生成插件包文件

### 项目结构

```
├── src/            # 源代码目录
│   └── index.ts    # 主插件实现
├── test/           # 测试目录
│   └── index.ts    # 测试代码
├── output/         # 打包输出目录
├── package.json    # 项目配置
├── tsconfig.json   # TypeScript配置
└── .gitignore      # Git忽略文件
```
