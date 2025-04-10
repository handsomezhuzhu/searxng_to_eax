# 📡 Deno Deploy Proxy for EXA + OpenWebUI

这个项目是一个部署在 [Deno Deploy](https://dash.deno.com) 上的轻量级代理服务器，用于接收 OpenWebUI 发出的联网搜索请求（兼容 SearxNG 接口），并将查询转发给 [EXA API](https://docs.exa.ai/)。

## 🚀 功能简介
- 接收 OpenWebUI 发出的 GET 请求
- 转发搜索关键词到 EXA
- 格式化返回结果为 `results: [ { title, url, content } ]`
- 自动处理字段缺失（如 EXA 返回中无 text）
- 支持通过环境变量设置 API 密钥

---

## 🗂 项目结构

```txt
├── main.ts            # 主服务逻辑文件
├── README.md          # 项目说明文档
```

---

## 🛠 使用方法

### 1. 克隆或 Fork 项目

```bash
git clone https://github.com/your-user/deno-exa-proxy.git
```

### 2. 修改 API Key（环境变量）

部署到 Deno 后，进入：
- 项目设置 → Environment Variables
- 添加变量：

```
EXA_API_KEY=你的EXA密钥
```

### 3. 部署到 Deno Deploy

在 [https://dash.deno.com](https://dash.deno.com)：
- 点击 "New Project"
- 选择 "Import from GitHub"
- 选择该仓库并部署
- 设置入口为 `main.ts`

部署成功后你将获得一个访问地址，例如：

```
https://your-proxy.deno.dev
```

---

## ⚙️ 用法示例

OpenWebUI 设置联网搜索时，使用以下 SearxNG 查询地址：

```
https://your-proxy.deno.dev/?q=chatgpt
```

返回 JSON 示例：

```json
{
  "results": [
    {
      "title": "What is ChatGPT?",
      "url": "https://openai.com/chatgpt",
      "content": "ChatGPT is a large language model developed by OpenAI..."
    },
    ...
  ]
}
```

---

## 🧠 高级特性（可选）
- fallback 内容自动拼接 title + url
- 控制台日志输出调试
- 支持 EXA 参数自定义（如 `numResults`, `filters`, `searchMode`）
- 可扩展接入多个 API（如 Brave, Google, Perplexity）

---

## 📄 许可证
MIT License.

