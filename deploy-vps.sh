#!/bin/bash
# VPS Deployment Script for Corporate Cooperative Management System
# Run this on Ubuntu 22.04 VPS

echo "🚀 Starting deployment process..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
echo -e "${BLUE}📦 Installing Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ NPM version: $(npm --version)${NC}"

# Install PM2
echo -e "${BLUE}📦 Installing PM2...${NC}"
sudo npm install -g pm2

# Install Nginx
echo -e "${BLUE}📦 Installing Nginx...${NC}"
sudo apt install -y nginx

# Install MySQL
echo -e "${BLUE}📦 Installing MySQL...${NC}"
sudo apt install -y mysql-server

# Secure MySQL installation
echo -e "${BLUE}🔐 Securing MySQL...${NC}"
sudo mysql_secure_installation

# Create application directory
echo -e "${BLUE}📁 Creating application directory...${NC}"
sudo mkdir -p /var/www/cooperative
sudo chown -R $USER:$USER /var/www/cooperative

# Prompt for domain name
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN_NAME

# Create Nginx configuration
echo -e "${BLUE}⚙️  Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/cooperative > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/cooperative /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# Install Certbot for SSL
echo -e "${BLUE}🔐 Installing SSL certificate...${NC}"
sudo apt install -y certbot python3-certbot-nginx

# Configure firewall
echo -e "${BLUE}🔥 Configuring firewall...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

echo -e "${GREEN}✅ Server setup complete!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Clone your repository to /var/www/cooperative"
echo "   cd /var/www/cooperative"
echo "   git clone YOUR_REPO_URL ."
echo ""
echo "2. Create .env.local file with your environment variables"
echo "   nano .env.local"
echo ""
echo "3. Install dependencies and build"
echo "   npm install"
echo "   npm run build"
echo ""
echo "4. Start with PM2"
echo "   pm2 start npm --name 'cooperative' -- start"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "5. Get SSL certificate"
echo "   sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
echo ""
echo -e "${GREEN}🎉 Deployment setup ready!${NC}"


