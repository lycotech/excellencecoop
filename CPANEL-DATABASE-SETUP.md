# cPanel MySQL Database Setup for Vercel Deployment

## 📋 Overview
This guide shows how to host your MySQL database on cPanel shared hosting and connect it to your Vercel-deployed application.

---

## 🔍 Step 1: Find Your Database Host in cPanel

### Method 1: MySQL Databases Section
1. **Login to cPanel**
2. **Search for "MySQL® Databases"** or find it under "Databases" section
3. **Scroll down** to "Current Databases"
4. **Look for the hostname** - usually shown as:
   - `localhost` (won't work for remote connections)
   - `your-server.hostingprovider.com`
   - `IP address` (e.g., `123.45.67.89`)

### Method 2: Remote MySQL Section
1. **Login to cPanel**
2. **Search for "Remote MySQL®"**
3. The hostname is usually displayed at the top of the page

### Method 3: phpMyAdmin
1. **Login to cPanel**
2. **Click "phpMyAdmin"**
3. Look at the **"Server:"** section at the top
4. The hostname will be displayed there

### Common cPanel Database Hosts:
- `localhost` - **Won't work** for Vercel (local only)
- `127.0.0.1` - **Won't work** for Vercel (local only)
- `your-domain.com` - Your actual domain
- `server123.hostingprovider.com` - Server hostname
- `123.45.67.89` - Server IP address

---

## 🗄️ Step 2: Create Database & User in cPanel

### 1. Create Database
1. Go to **"MySQL® Databases"** in cPanel
2. Under **"Create New Database"**:
   - Database Name: `cooperative_db` (or your choice)
   - Click **"Create Database"**
3. **Note the full database name**: Usually `cpaneluser_cooperative_db`

### 2. Create Database User
1. Scroll to **"MySQL Users"** section
2. Under **"Add New User"**:
   - Username: `coop_user` (or your choice)
   - Password: Generate a strong password
   - Click **"Create User"**
3. **Copy the password!** You'll need it later
4. **Note the full username**: Usually `cpaneluser_coop_user`

### 3. Add User to Database
1. Scroll to **"Add User To Database"**
2. Select:
   - User: `cpaneluser_coop_user`
   - Database: `cpaneluser_cooperative_db`
3. Click **"Add"**
4. On the next page, select **"ALL PRIVILEGES"**
5. Click **"Make Changes"**

---

## 🌐 Step 3: Enable Remote MySQL Access

This is **CRITICAL** for Vercel to connect!

### 1. Find Your Vercel IPs
Unfortunately, Vercel uses dynamic IPs. You have two options:

#### Option A: Allow All IPs (Less Secure but Easier)
1. Go to **"Remote MySQL®"** in cPanel
2. In the **"Add Access Host"** field, enter: `%` (wildcard for all IPs)
3. Click **"Add Host"**

**⚠️ Security Note:** This allows connections from any IP. Use strong passwords!

#### Option B: Use Vercel's IP Ranges (More Secure)
Vercel doesn't provide static IPs, but you can try adding these ranges:
```
76.76.21.0/24
76.223.126.0/24
```

However, **Option A** is more reliable for Vercel.

### 2. Verify Firewall Settings
Some hosting providers block external MySQL connections by default:
- Contact your hosting provider's support
- Ask them to enable **"Remote MySQL"** for your account
- Provide your server details if needed

---

## 📤 Step 4: Import Your Database

### Method 1: Using phpMyAdmin (Best for Small Databases)
1. **Export from local database first**:
   ```bash
   # On your local machine
   mysqldump -u root -p cooperative_db > cooperative_backup.sql
   ```

2. **Login to cPanel → phpMyAdmin**
3. **Select your database** (e.g., `cpaneluser_cooperative_db`)
4. Click **"Import"** tab
5. **Choose File** → Select your `.sql` file
6. Scroll down and click **"Go"**

### Method 2: Using Terminal (For Larger Databases)
1. **Login to cPanel → Terminal** (if available)
2. Upload your `.sql` file via **File Manager**
3. Run:
   ```bash
   mysql -u cpaneluser_coop_user -p cpaneluser_cooperative_db < /path/to/cooperative_backup.sql
   ```

### Method 3: Via File Manager (If Terminal Not Available)
1. **Compress** your `.sql` file to `.zip` or `.gz`
2. **Upload** via cPanel File Manager
3. In **phpMyAdmin**, select **Import**
4. Choose your compressed file

---

## 🚀 Step 5: Configure Vercel Environment Variables

### Find Your Database Connection Details:
```
DATABASE_HOST = your-server.hostingprovider.com (or IP)
DATABASE_USER = cpaneluser_coop_user (full username with prefix)
DATABASE_NAME = cpaneluser_cooperative_db (full database name with prefix)
DATABASE_PASSWORD = your-strong-password
DATABASE_PORT = 3306 (default MySQL port)
```

### Add to Vercel:

#### Via Vercel Dashboard:
1. Go to your project on **vercel.com**
2. Click **"Settings"** tab
3. Click **"Environment Variables"**
4. Add each variable:
   - **Name**: `DATABASE_HOST`
   - **Value**: `server123.hostingprovider.com` (your actual host)
   - Click **"Save"**
5. Repeat for all variables:
   ```
   DATABASE_HOST
   DATABASE_USER
   DATABASE_PASSWORD
   DATABASE_NAME
   DATABASE_PORT
   JWT_SECRET
   ```

#### Via Vercel CLI:
```bash
vercel env add DATABASE_HOST
# Enter your value when prompted
vercel env add DATABASE_USER
vercel env add DATABASE_PASSWORD
vercel env add DATABASE_NAME
vercel env add DATABASE_PORT
vercel env add JWT_SECRET
```

### 6. Redeploy Your Application
```bash
vercel --prod
```

Or trigger a redeploy from Vercel dashboard:
- Go to **"Deployments"** tab
- Click **"..."** on latest deployment
- Click **"Redeploy"**

---

## 🧪 Step 6: Test Database Connection

### Create a Test API Route (Temporary)
Create `src/app/api/test-db/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: parseInt(process.env.DATABASE_PORT || '3306'),
    });

    await connection.execute('SELECT 1');
    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      host: process.env.DATABASE_HOST,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      host: process.env.DATABASE_HOST,
    }, { status: 500 });
  }
}
```

**Test it:**
1. Deploy to Vercel
2. Visit: `https://your-app.vercel.app/api/test-db`
3. You should see: `{"success": true, "message": "Database connection successful!"}`

**⚠️ Remember to delete this test route after verifying!**

---

## 🐛 Common Issues & Solutions

### Issue 1: "Can't connect to MySQL server"
**Causes:**
- Wrong hostname
- Remote MySQL not enabled
- Firewall blocking connections

**Solutions:**
```bash
# Test connection from your local machine first
mysql -h your-server.hostingprovider.com -u cpaneluser_coop_user -p

# If this fails, contact hosting support
```

**Steps:**
1. Verify hostname is correct (not `localhost`)
2. Check "Remote MySQL®" has `%` added
3. Contact hosting support to enable remote MySQL
4. Ask them to check firewall settings

### Issue 2: "Access denied for user"
**Causes:**
- Wrong username/password
- User not added to database
- Missing cPanel username prefix

**Solutions:**
1. Verify full username includes prefix: `cpaneluser_coop_user`
2. Verify full database name: `cpaneluser_cooperative_db`
3. Check password is correct (no extra spaces)
4. Re-add user to database in cPanel

### Issue 3: "Host 'vercel-ip' is not allowed to connect"
**Causes:**
- Remote MySQL access not configured
- Wrong IP in access list

**Solutions:**
1. Add `%` to Remote MySQL® access hosts
2. Contact hosting provider to allow external connections

### Issue 4: "Connection timeout"
**Causes:**
- Port 3306 blocked by firewall
- Hosting provider doesn't allow remote MySQL

**Solutions:**
1. Check if your hosting plan supports remote MySQL
2. Try using port `3307` if available
3. Contact hosting support
4. Consider upgrading hosting plan

### Issue 5: "Too many connections"
**Causes:**
- Shared hosting connection limits
- Not closing connections properly

**Solutions:**
1. Use connection pooling in your app
2. Update your database configuration file if you have one
3. Close connections after use
4. Consider upgrading to VPS

---

## 🔐 Security Best Practices

### 1. Use Strong Passwords
```bash
# Generate a strong password
openssl rand -base64 32
```

### 2. Limit Database User Permissions
In phpMyAdmin:
- Don't give `FILE`, `SHUTDOWN`, `PROCESS` privileges
- Only give necessary table permissions

### 3. Use SSL/TLS (If Available)
Some hosting providers offer MySQL over SSL:
```javascript
const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: true
  }
});
```

### 4. Monitor Access Logs
In cPanel:
- Check "Raw Access Logs"
- Look for suspicious connection attempts

### 5. Regular Backups
In cPanel → "Backup Wizard":
- Schedule automatic backups
- Download backups regularly

---

## 📊 Connection Pooling (Recommended)

For better performance on shared hosting, use connection pooling:

Create `src/lib/db.ts`:
```typescript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 5, // Low limit for shared hosting
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;
```

Then use it in your API routes:
```typescript
import pool from '@/lib/db';

export async function GET() {
  const [rows] = await pool.execute('SELECT * FROM users');
  return NextResponse.json(rows);
}
```

---

## 📝 Quick Reference Checklist

- [ ] Found database hostname (not `localhost`)
- [ ] Created database in cPanel
- [ ] Created database user with strong password
- [ ] Added user to database with ALL PRIVILEGES
- [ ] Enabled Remote MySQL® with `%` wildcard
- [ ] Imported database tables/data
- [ ] Added environment variables to Vercel
- [ ] Redeployed Vercel application
- [ ] Tested database connection
- [ ] Deleted test API route
- [ ] Configured connection pooling

---

## 💡 Pro Tips

1. **Keep cPanel & Vercel docs open**
   - cPanel: Usually at `yourdomain.com:2083`
   - Vercel: Dashboard for logs and env vars

2. **Use phpMyAdmin for quick testing**
   - Test queries before adding to code
   - Check table structures

3. **Monitor Vercel Function Logs**
   - Go to Vercel Dashboard → Your Project → "Logs"
   - Check for connection errors

4. **Backup before importing**
   - Always backup existing data
   - Test on a staging database first

5. **Contact Support if Stuck**
   - Most cPanel hosts have 24/7 support
   - They can enable remote MySQL quickly

---

## 🆘 Need More Help?

1. **Check Vercel logs**: Dashboard → Logs → Runtime Logs
2. **Check cPanel Error Logs**: Error Log in cPanel
3. **Test connection locally first**: Use MySQL Workbench or command line
4. **Contact hosting support**: They can verify server-side settings
5. **Try different hostname formats**: IP, domain, server hostname

---

## 📞 Hosting Provider Specific Notes

### Hostinger
- MySQL Host: `mysqlXX.hostinger.com`
- Remote MySQL: Usually enabled by default
- Support: 24/7 live chat

### Bluehost
- MySQL Host: `box####.bluehost.com` or your domain
- Remote MySQL: May need to contact support
- Support: Chat/Phone available

### GoDaddy
- MySQL Host: Your domain or IP address
- Remote MySQL: Contact support to enable
- Support: Phone support available

### Namecheap
- MySQL Host: Server hostname (found in cPanel welcome email)
- Remote MySQL: Usually allowed with % wildcard
- Support: Live chat available

---

**Good luck with your deployment! 🚀**

