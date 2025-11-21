# Docker Deployment Guide

This guide covers how to build, run, and deploy the **We Have Food At Home** frontend application using Docker.

## 📋 Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)
- Supabase project credentials

## 🏗️ Project Structure

```
.
├── Dockerfile              # Multi-stage Docker build configuration
├── docker-compose.yml      # Docker Compose orchestration
├── nginx.conf             # Nginx server configuration for SPA
├── .dockerignore          # Files to exclude from Docker build
└── .env.example           # Environment variable template
```

## 🚀 Quick Start

### 1. Set Up Environment Variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Build and Run with Docker Compose (Recommended)

The easiest way to get started:

```bash
docker-compose up -d
```

This will:
- Build the Docker image
- Start the container in detached mode
- Expose the app on port 80

Access the application at: http://localhost

### 3. Alternative: Manual Docker Build

If you prefer to build and run manually:

```bash
# Build the image
docker build \
  --build-arg VITE_SUPABASE_URL=https://your-project-id.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=your-anon-key-here \
  -t wehavefoodathome-frontend .

# Run the container
docker run -d \
  --name wehavefoodathome-frontend \
  -p 80:80 \
  --restart unless-stopped \
  wehavefoodathome-frontend
```

## 📦 Docker Image Details

### Multi-Stage Build

The Dockerfile uses a multi-stage build for optimization:

**Stage 1: Builder**
- Base: `node:20-alpine`
- Installs dependencies with `npm ci`
- Builds the Vite application
- Output: Static files in `/app/dist`

**Stage 2: Production**
- Base: `nginx:alpine`
- Copies built assets from Stage 1
- Uses custom nginx configuration
- Final image size: ~25MB (compared to ~1GB with Node)

### Features

- ✅ Optimized multi-stage build (small image size)
- ✅ Nginx for fast static file serving
- ✅ SPA routing support (React Router compatible)
- ✅ Gzip compression enabled
- ✅ Security headers configured
- ✅ Health check endpoint at `/health`
- ✅ Cache control for static assets
- ✅ Production-ready configuration

## 🛠️ Docker Commands

### View Logs
```bash
docker-compose logs -f
```

### Stop the Container
```bash
docker-compose down
```

### Restart the Container
```bash
docker-compose restart
```

### Rebuild After Changes
```bash
docker-compose up -d --build
```

### Check Container Health
```bash
docker ps
docker inspect wehavefoodathome-frontend | grep -A 10 Health
```

### Access Container Shell
```bash
docker exec -it wehavefoodathome-frontend sh
```

## 🌐 Deployment Options

### 1. Deploy to Docker Hub

```bash
# Tag the image
docker tag wehavefoodathome-frontend yourusername/wehavefoodathome-frontend:latest

# Push to Docker Hub
docker push yourusername/wehavefoodathome-frontend:latest
```

### 2. Deploy to AWS ECS

1. Build and push to Amazon ECR:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

docker tag wehavefoodathome-frontend YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/wehavefoodathome-frontend:latest

docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/wehavefoodathome-frontend:latest
```

2. Create an ECS task definition with your image
3. Create an ECS service to run the task

### 3. Deploy to Google Cloud Run

```bash
# Build and submit
gcloud builds submit --tag gcr.io/YOUR_PROJECT/wehavefoodathome-frontend

# Deploy
gcloud run deploy wehavefoodathome-frontend \
  --image gcr.io/YOUR_PROJECT/wehavefoodathome-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars VITE_SUPABASE_URL=your-url,VITE_SUPABASE_ANON_KEY=your-key
```

### 4. Deploy to Azure Container Instances

```bash
# Create resource group
az group create --name wehavefoodathome-rg --location eastus

# Create container
az container create \
  --resource-group wehavefoodathome-rg \
  --name wehavefoodathome-frontend \
  --image yourusername/wehavefoodathome-frontend:latest \
  --dns-name-label wehavefoodathome \
  --ports 80 \
  --environment-variables \
    VITE_SUPABASE_URL=your-url \
    VITE_SUPABASE_ANON_KEY=your-key
```

### 5. Deploy to DigitalOcean App Platform

1. Push your image to Docker Hub or DigitalOcean Container Registry
2. Create a new App in DigitalOcean
3. Select "Docker Hub" or "Container Registry" as source
4. Configure environment variables in the app settings
5. Deploy

### 6. Self-Hosted with Docker Compose

For a VPS or dedicated server:

```bash
# Clone repository
git clone <your-repo>
cd wehavefoodathome-frontend

# Set up environment
cp .env.example .env
nano .env  # Edit with your values

# Start with Docker Compose
docker-compose up -d

# Optional: Set up reverse proxy with Caddy or Nginx
```

## 🔧 Customization

### Change Port Mapping

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Access on port 8080 instead of 80
```

### Add SSL/TLS

Use a reverse proxy like Caddy or Traefik:

**Example with Caddy:**
```yaml
services:
  caddy:
    image: caddy:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - frontend

  frontend:
    # ... existing config
    expose:
      - "80"  # Don't expose externally
```

**Caddyfile:**
```
yourdomain.com {
  reverse_proxy frontend:80
}
```

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Check if port 80 is already in use
sudo lsof -i :80

# Try a different port
docker-compose down
# Edit docker-compose.yml to use different port
docker-compose up -d
```

### Environment variables not working
```bash
# Verify .env file exists and has correct values
cat .env

# Rebuild with no cache
docker-compose build --no-cache
docker-compose up -d
```

### 404 errors on routes
This should be handled by the nginx configuration. If you still get 404s:
```bash
# Verify nginx.conf is being used
docker exec wehavefoodathome-frontend cat /etc/nginx/conf.d/default.conf
```

## 📊 Performance

### Image Size Comparison

| Build Type | Size |
|------------|------|
| With Node.js | ~1.2 GB |
| Multi-stage (nginx) | ~25 MB |
| **Reduction** | **~98%** |

### Startup Time
- Cold start: ~2-3 seconds
- Warm start: ~500ms

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use secrets management** in production (AWS Secrets Manager, Azure Key Vault, etc.)
3. **Scan images for vulnerabilities**:
   ```bash
   docker scan wehavefoodathome-frontend
   ```
4. **Keep base images updated**:
   ```bash
   docker-compose pull
   docker-compose up -d --build
   ```
5. **Use specific image versions** instead of `latest` in production

## 📝 Notes

- The nginx configuration supports client-side routing (React Router)
- Static assets are cached for 1 year with immutable headers
- HTML is not cached to ensure updates are seen immediately
- Gzip compression is enabled for better performance
- Health check endpoint available at `/health`

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables are set correctly
3. Ensure Docker and Docker Compose are up to date
4. Check that ports are not already in use

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Vite Documentation](https://vitejs.dev/)
