# PHP API Deployment Guide for SmartWeb/cPanel

## 📦 Quick Deployment Steps

### Step 1: Upload PHP Files to SmartWeb

#### Via cPanel File Manager:
1. **Login to cPanel**
2. **Open "File Manager"**
3. **Navigate to `public_html`**
4. **Create `api` folder** (if it doesn't exist)
5. **Upload all files** from `php-api/` folder maintaining the structure:
   ```
   public_html/
   └── api/
       ├── config/
       │   ├── database.php
       │   ├── cors.php
       │   └── jwt.php
       ├── auth/
       │   ├── login.php
       │   └── register.php
       ├── users/
       │   └── get-users.php
       ├── members/
       │   └── get-members.php
       ├── loans/
       │   └── get-loans.php
       ├── dashboard/
       │   └── get-stats.php
       └── .htaccess
   ```

#### Via FTP (Alternative):
1. **Open your FTP client** (FileZilla, WinSCP, etc.)
2. **Connect to your SmartWeb hosting**:
   - Host: `ftp.excellencecoop.com` (or your FTP host)
   - Username: Your cPanel username
   - Password: Your cPanel password
3. **Navigate to `public_html/`**
4. **Create `api` folder**
5. **Upload all PHP files**

---

### Step 2: Configure Database Connection

1. **Open `public_html/api/config/database.php`** in cPanel File Manager
2. **Update these lines**:
   ```php
   private $host = "localhost";           // Keep as localhost
   private $db_name = "excellence_coopdb"; // Your full database name
   private $username = "your_cpanel_username"; // Your database user
   private $password = "your_database_password"; // Your database password
   ```

**To find your database details in cPanel:**
- Go to **"MySQL® Databases"**
- Find your database name (with prefix): `cpaneluser_excellence_coopdb`
- Find your database user (with prefix): `cpaneluser_dbuser`
- Use the password you created earlier

---

### Step 3: Update CORS Configuration

1. **Open `public_html/api/config/cors.php`**
2. **Update the allowed origins**:
   ```php
   $allowed_origins = [
       'http://localhost:3000',                    // Local development
       'https://your-app.vercel.app',              // Your Vercel URL
       'https://excellencecoop.com',               // Your production domain
       'https://www.excellencecoop.com',
   ];
   ```

---

### Step 4: Update JWT Secret

1. **Open `public_html/api/config/jwt.php`**
2. **Change the secret key**:
   ```php
   private static $secret_key = "your-super-secret-jwt-key-change-this";
   ```

**Generate a secure key:**
```bash
# On your computer (Mac/Linux)
openssl rand -base64 32

# Or use online generator:
# https://randomkeygen.com/
```

---

### Step 5: Set File Permissions

In cPanel File Manager, set these permissions:

```
api/                           → 755
api/config/                    → 755
api/config/database.php        → 644
api/config/cors.php            → 644
api/config/jwt.php             → 644
api/auth/login.php             → 644
api/auth/register.php          → 644
api/users/get-users.php        → 644
api/members/get-members.php    → 644
api/loans/get-loans.php        → 644
api/dashboard/get-stats.php    → 644
api/.htaccess                  → 644
```

---

### Step 6: Test Your API Endpoints

#### Test 1: Direct Browser Access
Visit: `https://excellencecoop.com/api/auth/login.php`

**Expected Response:**
```json
{
  "success": false,
  "message": "Method not allowed"
}
```
✅ This means the file is accessible and CORS is working!

#### Test 2: Test Login (Using Postman or cURL)

**Using cURL:**
```bash
curl -X POST https://excellencecoop.com/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Using Postman:**
1. Method: `POST`
2. URL: `https://excellencecoop.com/api/auth/login.php`
3. Headers:
   - `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

#### Test 3: Test Stats Endpoint
```bash
# First login to get token, then:
curl -X GET https://excellencecoop.com/api/dashboard/get-stats.php \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### Step 7: Update Next.js Environment Variables

In your Next.js project (locally or in Vercel):

**Create/Update `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://excellencecoop.com/api
```

**In Vercel Dashboard:**
1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://excellencecoop.com/api`
3. Click **Save**
4. **Redeploy** your application

---

### Step 8: Update Next.js Login Page

Replace your current login API call with the new PHP API:

**Before:**
```typescript
// ❌ Old - Direct MySQL connection
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

**After:**
```typescript
// ✅ New - PHP API call
import { authApi } from '@/lib/api-client';

const response = await authApi.login(email, password);
if (response.success) {
  // Login successful
  router.push('/dashboard');
}
```

---

## 🧪 Testing Checklist

- [ ] Database connection works (check error logs)
- [ ] Login endpoint returns token
- [ ] Register endpoint creates new users
- [ ] Protected endpoints require token
- [ ] CORS allows requests from Vercel
- [ ] Get users endpoint returns data
- [ ] Get members endpoint returns data
- [ ] Get loans endpoint returns data
- [ ] Dashboard stats endpoint returns data

---

## 🐛 Troubleshooting

### Error: "Database connection failed"
**Fix:**
1. Check database credentials in `config/database.php`
2. Ensure database name includes cPanel prefix
3. Verify database user has privileges

### Error: "CORS error" / "Access denied"
**Fix:**
1. Update allowed origins in `config/cors.php`
2. Add your Vercel URL to the array
3. Clear browser cache

### Error: "500 Internal Server Error"
**Check PHP Error Logs:**
1. In cPanel → **"Errors"** or **"Error Log"**
2. Look for recent errors
3. Fix the issue mentioned in the log

### Error: "Failed to open stream"
**Fix:**
1. Check file permissions (should be 644 for .php files)
2. Verify file paths are correct
3. Ensure all folders exist

### Error: "Cannot read property of undefined"
**Fix:**
1. Check if API is returning proper JSON format
2. Verify response structure matches expected format
3. Add error handling in Next.js

---

## 📊 API Endpoints Reference

### Authentication
```
POST   /api/auth/login.php        - User login
POST   /api/auth/register.php     - User registration
GET    /api/auth/verify-token.php - Verify JWT token
```

### Users
```
GET    /api/users/get-users.php   - Get all users (admin only)
GET    /api/users/get-user.php?id=1 - Get single user
POST   /api/users/create-user.php - Create user
PUT    /api/users/update-user.php - Update user
DELETE /api/users/delete-user.php - Delete user
```

### Members
```
GET    /api/members/get-members.php - Get all members
GET    /api/members/get-member.php?id=1 - Get single member
POST   /api/members/create-member.php - Create member
PUT    /api/members/update-member.php - Update member
```

### Loans
```
GET    /api/loans/get-loans.php    - Get all loans
GET    /api/loans/get-loan.php?id=1 - Get single loan
POST   /api/loans/create-loan.php  - Create loan
PUT    /api/loans/update-loan.php  - Update loan
POST   /api/loans/approve-loan.php - Approve loan
POST   /api/loans/reject-loan.php  - Reject loan
```

### Dashboard
```
GET    /api/dashboard/get-stats.php - Get dashboard statistics
```

---

## 🔐 Security Checklist

- [ ] Changed default JWT secret key
- [ ] Updated CORS allowed origins
- [ ] Set correct file permissions
- [ ] Database password is strong
- [ ] `.htaccess` is in place
- [ ] Error display is OFF in production
- [ ] Using HTTPS (SSL certificate installed)
- [ ] Input validation enabled
- [ ] SQL injection prevention (prepared statements)

---

## 📈 Performance Tips

1. **Enable OPcache** (in cPanel → PHP version → Extensions)
2. **Use Cloudflare** for CDN and caching
3. **Enable gzip compression** (already in `.htaccess`)
4. **Add Redis/Memcached** if available
5. **Optimize database queries** with indexes

---

## 🆘 Need Help?

1. Check **PHP error logs** in cPanel
2. Test API endpoints directly in browser/Postman
3. Verify database connection in phpMyAdmin
4. Check **Vercel function logs** for client-side errors
5. Contact SmartWeb support for hosting issues

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Login returns a token
- ✅ Protected endpoints require authorization
- ✅ Dashboard loads data from PHP API
- ✅ No CORS errors in browser console
- ✅ No 500 errors in PHP error log

---

**🎉 Your PHP API is now live and connected to your Next.js app on Vercel!**

