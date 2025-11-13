# 🔄 Migration Steps: From Direct MySQL to PHP API

## 📍 Current Status

✅ **PHP API is configured on SmartWeb**
- Database credentials set
- CORS configured  
- JWT secret updated

❌ **Next.js still has old API routes**
- 33 route files trying to use direct MySQL
- Missing DB_* environment variables
- Getting "Missing required environment variables" error

---

## 🎯 Solution: Gradual Migration

You have **33 API route files**. Instead of refactoring all at once, let's do it gradually:

### **Phase 1: Stop the Error (5 minutes)** ✅

**Update your `.env.local` file:**

```env
# PHP API Configuration (NEW)
NEXT_PUBLIC_API_URL=https://excellencecoop.com/api

# Temporary dummy values to stop errors
DB_HOST=localhost
DB_USER=dummy_user
DB_PASSWORD=dummy_password
DB_NAME=dummy_database
DB_PORT=3306

# JWT Secret (needed by both systems)
JWT_SECRET=f5e1c332fc47cb7de1b06b8121792ac8fe9beb38e202d01f6d92ab247888184603d880590916e05705cb4cef88427ed6d1ead39de76d317f02f92ec36cc1b3d2
```

**Why this works:**
- Old routes won't crash (they'll just fail gracefully)
- PHP API is ready to use
- You can migrate page by page

---

### **Phase 2: Create New PHP Endpoints (As Needed)**

Your current API routes:

#### **Authentication** (Priority 1 - Do First!)
- ✅ `/api/auth/login.php` - Already created
- ✅ `/api/auth/register.php` - Already created
- ❌ `/api/auth/logout` - Create PHP version
- ❌ `/api/auth/me` - Create PHP version  
- ❌ `/api/auth/request-password-reset` - Create PHP version
- ❌ `/api/auth/reset-password` - Create PHP version

#### **Users**
- ✅ `/api/users/get-users.php` - Already created
- ❌ `/api/users/upload` - Need PHP version
- ❌ `/api/users/create-login` - Need PHP version

#### **Members**
- ✅ `/api/members/get-members.php` - Already created
- ❌ Need more member endpoints...

#### **Loans**
- ✅ `/api/loans/get-loans.php` - Already created
- ❌ Need more loan endpoints...

#### **Dashboard**
- ✅ `/api/dashboard/get-stats.php` - Already created

---

### **Phase 3: Update Next.js Pages (One at a Time)**

#### **Example: Login Page**

**Current code (uses old API route):**
```typescript
// ❌ Old way
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ identifier, password })
});
```

**New code (uses PHP API):**
```typescript
// ✅ New way
import { authApi } from '@/lib/api-client';

const response = await authApi.login(email, password);
if (response.success) {
  // Login successful
  router.push('/dashboard');
}
```

---

## 📋 Migration Checklist

### ✅ **Immediate (Do Now):**
- [ ] Update `.env.local` with dummy DB variables
- [ ] Restart your dev server: `npm run dev`
- [ ] Verify error is gone

### 🔄 **Short Term (This Week):**
- [ ] Update login page to use `authApi.login()`
- [ ] Update register page to use `authApi.register()`
- [ ] Test authentication works with PHP API
- [ ] Create logout PHP endpoint
- [ ] Update logout to use PHP API

### 📊 **Medium Term (Next Week):**
- [ ] Create PHP endpoints for members
- [ ] Update member pages to use PHP API
- [ ] Create PHP endpoints for loans
- [ ] Update loan pages to use PHP API
- [ ] Create PHP endpoints for contributions
- [ ] Update contribution pages to use PHP API

### 🧹 **Long Term (When Complete):**
- [ ] Delete all files in `src/app/api/`
- [ ] Remove `mysql2` from package.json
- [ ] Remove DB_* variables from `.env.local`
- [ ] Remove `src/lib/db.ts`
- [ ] Update Vercel environment variables

---

## 🚀 Quick Start (Stop the Error Now)

### **Step 1: Update `.env.local`**

Open or create `.env.local` and add:

```env
NEXT_PUBLIC_API_URL=https://excellencecoop.com/api

DB_HOST=localhost
DB_USER=dummy
DB_PASSWORD=dummy
DB_NAME=dummy
JWT_SECRET=f5e1c332fc47cb7de1b06b8121792ac8fe9beb38e202d01f6d92ab247888184603d880590916e05705cb4cef88427ed6d1ead39de76d317f02f92ec36cc1b3d2
```

### **Step 2: Restart Dev Server**

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### **Step 3: Verify**

The error should be gone! ✅

---

## 📝 Next Steps

1. **Keep both systems running** temporarily
2. **Update authentication first** (login/register pages)
3. **Test thoroughly**
4. **Migrate other pages gradually**
5. **Delete old API routes when done**

---

## 💡 Pro Tips

✅ **Don't rush** - Migrate one feature at a time
✅ **Test each change** - Make sure it works before moving on
✅ **Keep old routes** - Until you've migrated everything
✅ **Document as you go** - Note what's been migrated
✅ **Use Git commits** - Commit after each successful migration

---

## 🆘 Troubleshooting

### **Still getting the error?**
1. Make sure `.env.local` exists in project root
2. Restart your dev server completely
3. Check you're not using nodemon (it doesn't pick up .env changes)

### **Login not working?**
1. Make sure PHP API is accessible: `https://excellencecoop.com/api/auth/login.php`
2. Check CORS is configured correctly
3. Look at browser console for errors
4. Check Vercel environment variables have `NEXT_PUBLIC_API_URL`

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ No "Missing required environment variables" error
- ✅ Dev server starts without errors
- ✅ Can see your app in browser
- ✅ Login works (after migrating that page)
- ✅ Data loads from PHP API

---

**🎉 You're on the right track! Follow these steps and you'll be fully migrated soon.**

