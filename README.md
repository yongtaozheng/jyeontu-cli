# jyeontu-cli

[![npm version](https://img.shields.io/npm/v/jyeontu.svg)](https://www.npmjs.com/package/jyeontu)
[![license](https://img.shields.io/npm/l/jyeontu.svg)](https://github.com/yongtaozheng/jyeontu-cli/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dm/jyeontu.svg)](https://www.npmjs.com/package/jyeontu)
[![stars](https://img.shields.io/github/stars/yongtaozheng/jyeontu-cli.svg)](https://github.com/yongtaozheng/jyeontu-cli/stargazers)
[![forks](https://img.shields.io/github/forks/yongtaozheng/jyeontu-cli.svg)](https://github.com/yongtaozheng/jyeontu-cli/network/members)
[![gitee stars](https://gitee.com/zheng_yongtao/jyeontu-cli/badge/star.svg?theme=white)](https://gitee.com/zheng_yongtao/jyeontu-cli/stargazers)
[![gitee forks](https://gitee.com/zheng_yongtao/jyeontu-cli/badge/fork.svg?theme=white)](https://gitee.com/zheng_yongtao/jyeontu-cli/members)

> 🚀 一个有趣且实用的命令行工具集合，提升开发效率

## 📦 安装

```bash
npm install -g jyeontu
```

## 🎯 功能特性

### 🔧 Git 批量操作

- **批量删除分支** - 快速清理本地和远程分支
- **提交行数统计** - 统计各用户当天提交代码行数

### 📁 模板管理

- **项目模板创建** - 基于模板仓库快速创建新项目
- **单文件模板添加** - 快速添加常用代码模板

### 📶 WiFi 管理

- **WiFi 信息获取** - 获取已连接 WiFi 的名称和密码

### 🖼️ 图片处理

- **批量水印添加** - 为图片批量添加水印
- **百度图片下载** - 根据关键词批量下载图片
- **自定义二维码** - 生成带背景的个性化二维码
- **图片尺寸调整** - 批量调整图片尺寸

### 📄 文件操作

- **项目行数统计** - 统计项目文件行数和超大文件
- **大文件扫描** - 扫描指定大小的文件
- **TXT转PDF** - 将文本文件转换为PDF格式
- **MD转PDF** - 将Markdown文件转换为PDF格式，支持代码高亮

### 🌳 目录树生成

- **项目结构可视化** - 生成美观的目录树结构

## 🚀 快速开始

### Git 操作

```bash
# 批量删除分支
jyeontu git

# 统计提交行数
jyeontu git
```

![Git批量删除分支](https://gitee.com/jyeontostore/img-bed/raw/master/img/1701229700652.jpg)

### 模板创建

```bash
# 创建新项目
jyeontu create
```

![模板创建](https://gitee.com/jyeontostore/img-bed/raw/master/img/1701229955095.jpg)

### 图片处理

```bash
# 图片操作
jyeontu img
```

**批量添加水印效果：**
![批量水印](https://gitee.com/jyeontostore/img-bed/raw/master/img/1702349823117.jpg)

**百度图片下载：**
![百度图片下载](https://gitee.com/jyeontostore/img-bed/raw/master/img/1702349509051.jpg)

**自定义二维码：**
![自定义二维码](https://files.mdnice.com/user/42027/676e59e1-f1c8-46ff-a5e0-5c8f37daa461.png)

### 文件操作

```bash
# 文件操作
jyeontu file
```

**项目行数统计：**
![行数统计](https://gitee.com/jyeontostore/img-bed/raw/master/img/1702349078769.jpg)

**大文件扫描：**
![大文件扫描](https://gitee.com/jyeontostore/img-bed/raw/master/img/1702349035856.jpg)

**MD转PDF：**
支持将Markdown文件转换为PDF，包含代码高亮、表格、列表等格式。

### WiFi 管理

```bash
# WiFi 操作
jyeontu wifi
```

![WiFi信息获取](https://gitee.com/jyeontostore/img-bed/raw/master/img/1702349277580.jpg)

### 目录树生成

```bash
# 生成目录树
jyeontu tree
```

![目录树生成](https://gitee.com/jyeontostore/img-bed/raw/master/img/1703231332045.jpg)

## 📋 命令列表


| 命令             | 功能描述                                 |
| ---------------- | ---------------------------------------- |
| `jyeontu git`    | Git 批量操作（删除分支、统计行数）       |
| `jyeontu create` | 基于模板创建新项目                       |
| `jyeontu add`    | 添加单文件模板                           |
| `jyeontu wifi`   | WiFi 信息管理                            |
| `jyeontu img`    | 图片处理（水印、下载、二维码、调整尺寸） |
| `jyeontu file`   | 文件操作（统计、扫描、TXT/MD转PDF）     |
| `jyeontu tree`   | 生成目录树                               |
| `jyeontu help`   | 显示帮助信息                             |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目基于 [ISC License](LICENSE) 开源。

## 👨‍💻 作者

**JYeontu** - 前端工程师

- 🏸 喜欢打羽毛球
- 📝 喜欢写技术文章
- 🎯 专注于前端开发

## 📱 关注我们

关注公众号 **『前端也能这么有趣』**，获取更多有趣内容！

---

> 🎉 感谢大家的支持！如果这个工具对你有帮助，请给个 ⭐️ 支持一下！
