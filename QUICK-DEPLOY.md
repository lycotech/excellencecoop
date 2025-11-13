# Quick Deployment Guide

## 🚨 IMPORTANT: Your App Needs Node.js Hosting!

**Your app CANNOT run on regular shared hosting (cPanel/PHP) because it uses:**
- ✅ Node.js server
- ✅ MySQL database with API routes
- ✅ Server-side authentication

---

## 🎯 Fastest Deployment: Vercel (5 Minutes)

### Prerequisites:
- GitHub account
- Vercel account (free)
- MySQL database (local or hosted)

### Steps:

1. **Push your code to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login
   vercel login
   
   # Deploy
   vercel
   ```

3. **Add Environment Variables in Vercel Dashboard**
   - Go to your project → Settings → Environment Variables
   - Add these variables:
     ```
     DATABASE_HOST=your-mysql-host
     DATABASE_USER=your-mysql-user
     DATABASE_PASSWORD=your-mysql-password
     DATABASE_NAME=cooperative_db
     JWT_SECRET=your-random-secret-key-here
     ```

4. **Redeploy** (after adding env vars)
   ```bash
   vercel --prod
   ```

✅ Done! Your app is live at `your-project.vercel.app`

---

## 💰 Budget Option: VPS with PM2 ($4-6/month)

### Providers:
- Vultr: $3.50/month
- Hetzner: €4.51/month
- DigitalOcean: $6/month
- Contabo: €4.50/month

### Quick Setup (Ubuntu 22.04):

1. **Run the automated script**
   ```bash
   # On your VPS
   chmod +x deploy-vps.sh
   ./deploy-vps.sh
   ```

2. **Clone your repository**
   ```bash
   cd /var/www/cooperative
   git clone YOUR_REPO_URL .
   ```

3. **Configure environment**
   ```bash
   nano .env.local
   ```
   Add:
   ```env
   DATABASE_HOST=localhost
   DATABASE_USER=root
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=cooperative_db
   JWT_SECRET=your-secret-key
   ```

4. **Install and build**
   ```bash
   npm install
   npm run build
   ```

5. **Start the app**
   ```bash
   pm2 start npm --name "cooperative" -- start
   pm2 save
   pm2 startup
   ```

6. **Setup SSL (Free with Let's Encrypt)**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

✅ Done! Your app is live at your domain!

---

## 🔥 One-Click Alternatives

### Railway.app
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Connect GitHub repo
4. Add environment variables
5. Deploy! ✅

### Render.com
1. Go to [render.com](https://render.com)
2. Create "Web Service"
3. Connect GitHub repo
4. Set build command: `npm run build`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy! ✅

---

## 🗄️ Database Options

### Option 1: Use Existing MySQL Server
- Point `DATABASE_HOST` to your server IP
- Ensure MySQL allows remote connections
- Configure firewall to allow port 3306

### Option 2: Free Hosted Database
- **PlanetScale** (Free tier) - [planetscale.com](https://planetscale.com)
- **Railway MySQL** (With Railway hosting)
- **Aiven** (Free tier) - [aiven.io](https://aiven.io)

### Option 3: Install on Same VPS
```bash
sudo apt install mysql-server
sudo mysql_secure_installation
```

---

## ⚡ Deployment Commands Cheat Sheet

### Vercel
```bash
vercel                 # Deploy to preview
vercel --prod          # Deploy to production
vercel logs            # View logs
vercel env ls          # List environment variables
```

### PM2 (VPS)
```bash
pm2 start npm --name "app" -- start   # Start app
pm2 stop app                          # Stop app
pm2 restart app                       # Restart app
pm2 logs app                          # View logs
pm2 status                            # Check status
pm2 monit                             # Monitor resources
```

### Nginx
```bash
sudo nginx -t                         # Test config
sudo systemctl restart nginx          # Restart nginx
sudo systemctl status nginx           # Check status
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Test database connection
mysql -h DATABASE_HOST -u DATABASE_USER -p

# Check if MySQL allows remote connections
# Edit /etc/mysql/mysql.conf.d/mysqld.cnf
bind-address = 0.0.0.0

# Create user with remote access
CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON database_name.* TO 'user'@'%';
FLUSH PRIVILEGES;
```

### "Port 3000 already in use"
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 PID

# Or use different port
PORT=3001 npm start
```

### Build fails
```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

## 📱 Mobile Access Configuration

Add to your Nginx config for better mobile experience:
```nginx
# Add inside server block
client_max_body_size 10M;

# Add gzip compression
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

---

## 🔐 Security Checklist

- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (UFW)
- [ ] Use environment variables (never commit secrets)
- [ ] Regular backups
- [ ] Keep dependencies updated: `npm audit fix`
- [ ] Use strong MySQL passwords
- [ ] Limit MySQL remote access to specific IPs

---

## 💡 Pro Tips

1. **Use Git for deployment**
   ```bash
   git pull origin main
   npm install
   npm run build
   pm2 restart app
   ```

2. **Auto-deploy with GitHub Actions** (Vercel does this automatically)

3. **Monitor your app**
   - Vercel: Built-in analytics
   - VPS: `pm2 monit` or install Grafana

4. **Backups**
   ```bash
   # Database backup
   mysqldump -u user -p database_name > backup.sql
   
   # Automate with cron
   0 2 * * * mysqldump -u user -p'password' database > /backups/db-$(date +\%F).sql
   ```

---

## 🆘 Need Help?

1. Check logs: `pm2 logs` or Vercel dashboard
2. Verify environment variables are set correctly
3. Test database connection separately
4. Check firewall rules
5. Review error messages carefully

---

## 📊 Cost Summary

| Option | Monthly Cost | Effort | Best For |
|--------|-------------|--------|----------|
| Vercel | Free - $20 | ⭐ Easy | Quick deployment |
| Railway | $5 | ⭐⭐ Easy | All-in-one |
| Render | Free - $7 | ⭐⭐ Easy | Budget option |
| VPS | $4 - $10 | ⭐⭐⭐ Medium | Full control |

---

**Questions? See the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide for detailed instructions.**


