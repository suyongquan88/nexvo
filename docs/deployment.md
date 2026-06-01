# Nexvo — Ubuntu + Docker 部署

在 Ubuntu 服务器上使用 Docker 运行 Nexvo Next.js 应用。

## 前置条件

- Ubuntu 22.04 LTS（或相近版本）
- 已开放防火墙端口 **3000**（或通过 Nginx 反代 80/443）
- 项目根目录已配置 `.env.local`（API 密钥等，**不要**提交到 Git）

## 1. 安装 Docker

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${VERSION_CODENAME:-$VERSION}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
```

重新登录 shell 后，确认安装：

```bash
docker --version
docker compose version
```

## 2. 获取代码

```bash
git clone <your-repo-url> nexvo
cd nexvo
```

将生产环境变量写入 `.env.local`（与本地开发相同格式，例如 `DEEPSEEK_API_KEY` 等）。

## 3. 构建并启动

```bash
docker compose up -d --build
```

- 服务名：`nexvo`
- 容器名：`nexvo`
- 端口映射：`3000:3000`
- 环境变量：从宿主机 `.env.local` 注入（见 `docker-compose.yml` 的 `env_file`）

查看状态与日志：

```bash
docker compose ps
docker compose logs -f nexvo
```

浏览器访问：`http://<服务器IP>:3000`

## 4. 常用运维命令

```bash
# 停止
docker compose down

# 拉取新代码后重新部署
git pull
docker compose up -d --build

# 仅重启容器（不重建镜像）
docker compose restart nexvo
```

## 5. 生产建议（可选）

### 反向代理与 HTTPS

在 Docker 前放置 Nginx 或 Caddy，将 `https://your-domain` 反代到 `http://127.0.0.1:3000`，并配置 TLS 证书（如 Let's Encrypt）。

### 仅本机监听

若使用反代，可将 `docker-compose.yml` 端口改为 `127.0.0.1:3000:3000`，避免对外直接暴露 3000。

### 环境变量

- `.env.local` 仅存在于服务器，由 `env_file` 挂载进容器
- `.dockerignore` 已排除 `.env.local`，构建镜像时不会打入镜像层

### 容器内无法访问

若容器外无法连接，确认 Next 监听 `0.0.0.0`。可在 `docker-compose.yml` 的 `environment` 中增加：

```yaml
environment:
  - HOSTNAME=0.0.0.0
```

## 6. 文件说明

| 文件 | 说明 |
|------|------|
| `Dockerfile` | `node:22-alpine`，安装依赖、`npm run build`、`npm start` |
| `.dockerignore` | 排除 `node_modules`、`.next`、`.git`、`.env.local` |
| `docker-compose.yml` | 服务 `nexvo`，端口 3000，加载 `.env.local` |
