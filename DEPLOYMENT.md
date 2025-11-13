# Deployment Guide - Corporate Cooperative Management System

## ⚠️ Important: This App Requires Node.js

This application **CANNOT** be deployed to traditional shared hosting (cPanel/PHP hosting) because it requires:
- Node.js runtime
- Server-side API routes
- MySQL database connection
- Server-side authentication

---

## 🚀 Recommended Deployment Options

### Option 1: Vercel (Easiest & Free)

**Best for:** Quick deployment, automatic scaling, free SSL

#### Steps:
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Configure Environment Variables**
   Create `.env.local` file:
   ```env
   DATABASE_HOST=your-mysql-host
   DATABASE_USER=your-mysql-user
   DATABASE_PASSWORD=your-mysql-password
   DATABASE_NAME=your-database-name
   JWT_SECRET=your-secret-key-here
   ```

4. **Deploy**
   ```bash
   # Test deployment
   vercel
   
   # Production deployment
   vercel --prod
   ```

5. **Add Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Navigate to Environment Variables
   - Add all variables from `.env.local`

**Important Notes:**
- Vercel serverless functions have 10-second timeout (Hobby plan)
- Database must be accessible from external connections
- Use connection pooling for better performance

---

### Option 2: Railway.app (Simple Setup)

**Best for:** Full-stack apps with database, $5/month credit

#### Steps:
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables in Railway dashboard
6. Railway will automatically detect Next.js and deploy

**Advantages:**
- Can host MySQL database on same platform
- Automatic deployments on git push
- Easy to manage

---

### Option 3: DigitalOcean App Platform

**Best for:** Production apps, starts at $5/month

#### Steps:
1. Go to [digitalocean.com](https://www.digitalocean.com/products/app-platform)
2. Create account
3. Click "Create App" → Select GitHub
4. Choose repository
5. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
6. Add environment variables
7. Deploy

---

### Option 4: VPS with PM2 (Full Control)

**Best for:** Advanced users, custom setup

#### Requirements:
- VPS (DigitalOcean, Linode, Vultr) - $4-6/month
- Ubuntu 22.04 or similar
- Root access

#### Steps:

1. **Connect to VPS via SSH**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Node.js 20.x**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

4. **Install Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

5. **Clone Your Repository**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/yourrepo.git
   cd yourrepo
   ```

6. **Install Dependencies**
   ```bash
   npm install
   ```

7. **Create Environment File**
   ```bash
   nano .env.local
   ```
   Add your environment variables:
   ```env
   DATABASE_HOST=localhost
   DATABASE_USER=your-user
   DATABASE_PASSWORD=your-password
   DATABASE_NAME=cooperative_db
   JWT_SECRET=your-secret-key
   ```

8. **Build the Application**
   ```bash
   npm run build
   ```

9. **Start with PM2**
   ```bash
   pm2 start npm --name "cooperative-app" -- start
   pm2 save
   pm2 startup
   ```

10. **Configure Nginx**
    ```bash
    sudo nano /etc/nginx/sites-available/cooperative
    ```
    
    Add this configuration:
    ```nginx
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

11. **Enable Site**
    ```bash
    sudo ln -s /etc/nginx/sites-available/cooperative /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

12. **Install SSL Certificate (Let's Encrypt)**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    ```

---

## 📦 Alternative: Convert to Static (Not Recommended)

**⚠️ Warning:** You will lose:
- API routes functionality
- Authentication
- Database features
- Server-side rendering

Only do this if you plan to rebuild with a separate backend.

### Steps:

1. **Modify `next.config.js`**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     typescript: {
       ignoreBuildErrors: true,
     },
     eslint: {
       ignoreDuringBuilds: true,
     },
   };
   
   module.exports = nextConfig;
   ```

2. **Build Static Files**
   ```bash
   npm run build
   ```

3. **Upload `out` folder to shared hosting**
   - Files will be in `/out` directory
   - Upload via FTP/cPanel File Manager
   - Point domain to the uploaded folder

**Note:** API routes won't work. You'll need to create a separate backend API.

---

## 🗄️ Database Setup

### For Remote MySQL Access:

1. **Update MySQL to allow remote connections**
   ```sql
   CREATE USER 'your_user'@'%' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON cooperative_db.* TO 'your_user'@'%';
   FLUSH PRIVILEGES;
   ```

2. **Update MySQL config** (`/etc/mysql/mysql.conf.d/mysqld.cnf`)
   ```ini
   bind-address = 0.0.0.0
   ```

3. **Restart MySQL**
   ```bash
   sudo systemctl restart mysql
   ```

### Recommended: Use Managed Database
- **PlanetScale** (Free tier available)
- **Railway MySQL** (Integrated with Railway hosting)
- **DigitalOcean Managed Database**
- **AWS RDS**

---

## 🔐 Security Checklist

- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS properly
- [ ] Use database connection pooling
- [ ] Set up firewall rules
- [ ] Regular backups
- [ ] Keep dependencies updated

---

## 📊 Performance Optimization

1. **Enable caching**
2. **Use CDN** (Cloudflare)
3. **Database indexing**
4. **Connection pooling**
5. **Image optimization**
6. **Code splitting**

---

## 🆘 Troubleshooting

### Common Issues:

1. **"Cannot connect to database"**
   - Check database host is accessible
   - Verify credentials
   - Check firewall rules

2. **"Module not found"**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build fails**
   ```bash
   npm run build -- --debug
   ```

4. **PM2 app crashes**
   ```bash
   pm2 logs cooperative-app
   pm2 restart cooperative-app
   ```

---

## 💰 Cost Comparison

| Provider | Starting Price | Best For |
|----------|---------------|----------|
| Vercel | Free (Hobby) | Quick deployment |
| Railway | $5/month credit | All-in-one solution |
| DigitalOcean | $6/month | Full control |
| Render | Free tier | Small projects |
| VPS (Vultr) | $3.50/month | Budget option |

---

## 📞 Support

For deployment issues:
1. Check deployment provider docs
2. Review logs: `pm2 logs` or provider dashboard
3. Verify environment variables
4. Test database connection

---

## ✅ Recommended Setup

**For Beginners:** Vercel + PlanetScale (Both have free tiers)

**For Small Business:** Railway ($5/month all-inclusive)

**For Full Control:** VPS + PM2 + Nginx

**For Enterprise:** DigitalOcean App Platform or AWS
