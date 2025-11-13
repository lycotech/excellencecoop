# 🚀 Quick Start: PHP API + Vercel Setup

## ⚡ 10-Minute Setup Guide

### ✅ Prerequisites
- SmartWeb/cPanel hosting account
- MySQL database created in cPanel
- Vercel account with Next.js app deployed
- FTP or cPanel File Manager access

---

## 📋 Step-by-Step (10 Minutes)

### 1️⃣ Upload PHP Files (3 min)

**Via cPanel File Manager:**
1. Login to cPanel
2. Open "File Manager"
3. Navigate to `public_html/`
4. Create folder: `api`
5. Upload entire `php-api/` folder contents to `public_html/api/`

**Folder structure should be:**
```
public_html/
└── api/
    ├── config/
    ├── auth/
    ├── users/
    ├── members/
    ├── loans/
    ├── dashboard/
    └── .htaccess
```

---

### 2️⃣ Configure Database (2 min)

**Edit: `public_html/api/config/database.php`**

Change these 3 lines:
```php
private $db_name = "excellence_coopdb";  // ← Your database name
private $username = "dbuser";             // ← Your database user
private $password = "your_password";      // ← Your database password
```

**Keep `$host = "localhost"`** ✅

---

### 3️⃣ Update CORS (1 min)

**Edit: `public_html/api/config/cors.php`**

Add your domains:
```php
$allowed_origins = [
    'http://localhost:3000',               // Local dev
    'https://your-app.vercel.app',         // ← Your Vercel URL
    'https://excellencecoop.com',          // ← Your domain
];
```

---

### 4️⃣ Change JWT Secret (1 min)

**Edit: `public_html/api/config/jwt.php`**

```php
private static $secret_key = "YOUR-RANDOM-SECRET-KEY-HERE";
```

**Generate a key:**
```bash
# Mac/Linux terminal:
openssl rand -base64 32

# Or use: https://randomkeygen.com/
```

---

### 5️⃣ Test PHP API (1 min)

**Visit in browser:**
```
https://excellencecoop.com/api/auth/login.php
```

**Should see:**
```json
{"success":false,"message":"Method not allowed"}
```

✅ **This is correct!** It means your API is working.

---

### 6️⃣ Update Next.js Project (2 min)

**Copy this file to your project:**
```
src/lib/api-client.ts
```

**Create `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://excellencecoop.com/api
```

**Update Vercel Environment Variables:**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://excellencecoop.com/api`
4. Save

---

### 7️⃣ Update Login Page Example

**File: `src/app/login/page.tsx`**

Add this import at the top:
```typescript
import { authApi } from '@/lib/api-client';
```

Replace your login function with:
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await authApi.login(email, password);
    
    if (response.success) {
      router.push('/dashboard');
    } else {
      setError(response.message);
    }
  } catch (error) {
    setError('Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 8️⃣ Deploy & Test

**Deploy to Vercel:**
```bash
git add .
git commit -m "Switch to PHP API"
git push origin main
```

**Or manually redeploy:**
- Go to Vercel Dashboard
- Click "Redeploy"

**Test your login:**
1. Visit your Vercel app
2. Try logging in
3. Check if it redirects to dashboard

✅ **Success!**

---

## 🎯 What You Just Did

```
Before:
Next.js (Vercel) ──X──> MySQL (cPanel)
❌ Didn't work - Remote MySQL blocked

After:
Next.js (Vercel) ──✅──> PHP API (cPanel) ──✅──> MySQL (localhost)
✅ Works perfectly!
```

---

## 📝 Quick API Reference

### Use in Your Next.js Code:

```typescript
import { authApi, usersApi, membersApi, loansApi } from '@/lib/api-client';

// Login
const response = await authApi.login(email, password);

// Register
const response = await authApi.register({
  email, password, full_name, user_type
});

// Logout
authApi.logout();

// Get users
const response = await usersApi.getUsers();

// Get members
const response = await membersApi.getMembers({ status: 'active' });

// Get loans
const response = await loansApi.getLoans({ status: 'pending' });

// Get dashboard stats
const response = await dashboardApi.getStats();
```

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to database"
**Fix:** Check database credentials in `config/database.php`

### ❌ "CORS error"
**Fix:** Add your Vercel URL to `config/cors.php`

### ❌ "404 Not Found"
**Fix:** Make sure files are in `public_html/api/` folder

### ❌ "500 Internal Server Error"
**Fix:** Check PHP error logs in cPanel

### ❌ Login not working
**Fix:** 
1. Test API directly: `https://excellencecoop.com/api/auth/login.php`
2. Check browser console for errors
3. Verify `NEXT_PUBLIC_API_URL` is set in Vercel

---

## ✅ Success Checklist

- [ ] PHP files uploaded to `public_html/api/`
- [ ] Database credentials updated in `database.php`
- [ ] CORS updated with your Vercel URL
- [ ] JWT secret changed
- [ ] Test endpoint works (login.php shows "Method not allowed")
- [ ] `api-client.ts` copied to your Next.js project
- [ ] `.env.local` created with API URL
- [ ] Vercel environment variable added
- [ ] Login page updated to use `authApi.login()`
- [ ] Successfully logged in via new API

---

## 📚 Next Steps

1. **Refactor other pages** - See `REFACTORING-GUIDE.md`
2. **Add more endpoints** - Copy and modify existing PHP files
3. **Remove old API routes** - Delete `/api/auth/login/route.ts` etc.
4. **Test thoroughly** - Try all features
5. **Monitor logs** - Check for errors in cPanel and Vercel

---

## 💡 Pro Tips

✅ **Keep it simple** - Start with login/register, then add more
✅ **Test endpoints directly** - Use Postman or browser first
✅ **Check logs often** - Both PHP (cPanel) and Next.js (Vercel)
✅ **Backup regularly** - Before making big changes
✅ **Use version control** - Commit after each working feature

---

## 🎉 Done!

Your app now uses a PHP API layer and works perfectly with SmartWeb hosting!

**Time taken: ~10 minutes**
**Cost: $0 extra (uses existing hosting)**
**Difficulty: ⭐⭐ Easy**

---

**Questions? Check the full guides:**
- `PHP-API-ARCHITECTURE.md` - Full architecture explanation
- `PHP-DEPLOYMENT-GUIDE.md` - Detailed deployment steps
- `REFACTORING-GUIDE.md` - How to refactor all pages

**Good luck! 🚀**

