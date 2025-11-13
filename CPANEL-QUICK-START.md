# 🚀 cPanel + Vercel Quick Start Guide

## ⚡ 5-Minute Setup Checklist

### Step 1: Find Database Host (2 min)
**In cPanel:**
- [ ] Login to cPanel
- [ ] Open "Remote MySQL®"
- [ ] Copy the hostname shown (NOT `localhost`)

**Common formats:**
```
✅ server123.hostingprovider.com
✅ 123.45.67.89
✅ yourdomain.com
❌ localhost (won't work)
❌ 127.0.0.1 (won't work)
```

---

### Step 2: Create Database (2 min)
**In cPanel → MySQL® Databases:**

1. **Create Database:**
   - [ ] Name: `cooperative_db`
   - [ ] Click "Create Database"
   - [ ] ✅ Note full name: `cpaneluser_cooperative_db`

2. **Create User:**
   - [ ] Username: `coop_user`
   - [ ] Generate strong password
   - [ ] Click "Create User"
   - [ ] ✅ Copy password somewhere safe
   - [ ] ✅ Note full username: `cpaneluser_coop_user`

3. **Add User to Database:**
   - [ ] Select user: `cpaneluser_coop_user`
   - [ ] Select database: `cpaneluser_cooperative_db`
   - [ ] Click "Add"
   - [ ] Check "ALL PRIVILEGES"
   - [ ] Click "Make Changes"

---

### Step 3: Enable Remote Access (1 min)
**In cPanel → Remote MySQL®:**
- [ ] In "Add Access Host" field, type: `%`
- [ ] Click "Add Host"
- [ ] ✅ Verify `%` appears in the list

**⚠️ Important:** If this doesn't work, contact your hosting support to enable remote MySQL.

---

### Step 4: Import Your Database (Optional)
**If you have existing data:**

**In cPanel → phpMyAdmin:**
- [ ] Select your database (`cpaneluser_cooperative_db`)
- [ ] Click "Import" tab
- [ ] Choose your `.sql` file
- [ ] Click "Go"

---

### Step 5: Configure Vercel (2 min)

**Your Connection Details:**
```
DATABASE_HOST     = server123.hostingprovider.com  (from Step 1)
DATABASE_USER     = cpaneluser_coop_user           (from Step 2)
DATABASE_PASSWORD = your-generated-password         (from Step 2)
DATABASE_NAME     = cpaneluser_cooperative_db      (from Step 2)
DATABASE_PORT     = 3306
JWT_SECRET        = your-random-secret-key
```

**In Vercel Dashboard:**
1. [ ] Go to your project → Settings → Environment Variables
2. [ ] Add each variable above (one by one)
3. [ ] Click "Save" for each one
4. [ ] Verify all 6 variables are added

---

### Step 6: Deploy & Test (1 min)

**Redeploy:**
- [ ] In Vercel: Go to "Deployments" tab
- [ ] Click "..." on latest deployment
- [ ] Click "Redeploy"
- [ ] Wait for deployment to complete

**Test Connection:**
- [ ] Visit: `https://your-app.vercel.app/api/test-db`
- [ ] You should see: `"success": true`
- [ ] ✅ If successful: **Delete** `src/app/api/test-db/route.ts`
- [ ] ❌ If failed: Check error message and follow suggestions

---

## 🎯 Visual Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Setup                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐                    ┌──────────────┐      │
│  │              │                    │              │      │
│  │   Vercel     │◄──── Internet ────►│   cPanel     │      │
│  │ (Next.js App)│                    │ (MySQL DB)   │      │
│  │              │                    │              │      │
│  └──────────────┘                    └──────────────┘      │
│        │                                    │               │
│        │                                    │               │
│        ▼                                    ▼               │
│  Environment Vars:              Database:                   │
│  • DATABASE_HOST ───────────►  server123.host.com          │
│  • DATABASE_USER ───────────►  cpaneluser_coop_user        │
│  • DATABASE_PASSWORD ───────►  ••••••••••••                │
│  • DATABASE_NAME ───────────►  cpaneluser_cooperative_db   │
│  • DATABASE_PORT ───────────►  3306                         │
│                                                              │
│  Remote MySQL Access:                                       │
│  • Allowed Hosts: % (all IPs)                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting Quick Fixes

### ❌ "Can't connect to MySQL server"
```bash
# Fix in cPanel:
1. Go to "Remote MySQL®"
2. Make sure "%" is in the access list
3. Contact hosting support: "Please enable remote MySQL access"
```

### ❌ "Access denied for user"
```bash
# Check these in Vercel:
DATABASE_USER = cpaneluser_coop_user  ← Must include cPanel prefix!
DATABASE_NAME = cpaneluser_cooperative_db  ← Must include cPanel prefix!

# In cPanel:
1. Go to "MySQL® Databases"
2. Scroll to "Current Users"
3. Copy the EXACT username (including prefix)
```

### ❌ "Connection timeout"
```bash
# Your hosting might not support remote MySQL
Solutions:
1. Contact hosting support
2. Ask: "Can you enable port 3306 for remote MySQL?"
3. Or upgrade to a plan that supports it
```

### ❌ "Host not allowed to connect"
```bash
# In cPanel → Remote MySQL®:
1. Delete any specific IPs
2. Add only: %
3. Click "Add Host"
4. Redeploy Vercel
```

---

## 📋 Pre-Flight Checklist

Before you start, make sure you have:
- [ ] cPanel login credentials
- [ ] Vercel account connected to your project
- [ ] Your hosting supports remote MySQL (ask support if unsure)
- [ ] Database backup (if importing existing data)

---

## 🎯 Common Mistakes to Avoid

❌ **Using `localhost` as DATABASE_HOST**
- Won't work! Use server hostname or IP

❌ **Forgetting cPanel username prefix**
- Not: `coop_user`
- Correct: `cpaneluser_coop_user`

❌ **Not enabling Remote MySQL®**
- You MUST add `%` to access hosts

❌ **Wrong database name**
- Not: `cooperative_db`
- Correct: `cpaneluser_cooperative_db`

❌ **Not redeploying after adding env vars**
- Changes only take effect after redeploy

---

## 💡 Pro Tips

✅ **Test locally first**
```bash
# On your computer, test connection:
mysql -h server123.host.com -u cpaneluser_coop_user -p

# If this works, Vercel will work too!
```

✅ **Use strong passwords**
```bash
# Generate in cPanel or use:
openssl rand -base64 32
```

✅ **Keep credentials safe**
- Never commit `.env` files to Git
- Only add to Vercel dashboard
- Use password manager

✅ **Monitor logs**
- Vercel Dashboard → Logs → Runtime Logs
- Watch for connection errors

---

## ⏱️ Expected Time Per Section

| Step | Time | Difficulty |
|------|------|-----------|
| Find DB Host | 2 min | ⭐ Easy |
| Create DB & User | 2 min | ⭐ Easy |
| Enable Remote Access | 1 min | ⭐ Easy |
| Import Database | 5 min | ⭐⭐ Medium |
| Configure Vercel | 2 min | ⭐ Easy |
| Test Connection | 1 min | ⭐ Easy |
| **Total** | **~15 min** | |

---

## 📞 Need Help?

1. **Check full guide:** `CPANEL-DATABASE-SETUP.md`
2. **Test connection:** Visit `/api/test-db` endpoint
3. **Check Vercel logs:** Dashboard → Logs
4. **Contact hosting support:** They can verify server-side settings
5. **Common hosting support phrases:**
   - "Please enable remote MySQL access for my account"
   - "Can you verify port 3306 is open?"
   - "What is my MySQL hostname for remote connections?"

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ `/api/test-db` returns `"success": true`
- ✅ You can login to your app
- ✅ Data loads from database
- ✅ No connection errors in Vercel logs

---

## 🎉 You're Done!

Once successful:
1. **Delete the test file:** `src/app/api/test-db/route.ts`
2. **Commit and push** your changes
3. **Test your app** thoroughly
4. **Set up backups** in cPanel

**Questions? See the full documentation in `CPANEL-DATABASE-SETUP.md`**

