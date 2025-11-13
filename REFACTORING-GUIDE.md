# Refactoring Guide: MySQL → PHP API

## 🎯 Overview

This guide shows you how to refactor your Next.js app to use the PHP API instead of direct MySQL connections.

---

## 📝 Step-by-Step Refactoring

### 1. Update Login Page

**File: `src/app/login/page.tsx`**

#### Before (Direct MySQL):
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (data.success) {
      router.push('/dashboard');
    } else {
      setError(data.message);
    }
  } catch (error) {
    setError('Login failed');
  } finally {
    setIsLoading(false);
  }
};
```

#### After (PHP API):
```typescript
import { authApi } from '@/lib/api-client';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await authApi.login(email, password);
    
    if (response.success) {
      // Token is automatically saved by authApi.login()
      router.push('/dashboard');
    } else {
      setError(response.message);
    }
  } catch (error) {
    setError('Login failed');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 2. Update Register Page

**File: `src/app/register/page.tsx`**

#### After (PHP API):
```typescript
import { authApi } from '@/lib/api-client';

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await authApi.register({
      email,
      password,
      full_name: fullName,
      user_type: userType,
    });
    
    if (response.success) {
      router.push('/dashboard');
    } else {
      setError(response.message);
    }
  } catch (error) {
    setError('Registration failed');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 3. Update Admin Dashboard (Get Users)

**File: `src/app/dashboard/admin/users/page.tsx`**

#### Before:
```typescript
useEffect(() => {
  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data.users);
  };
  fetchUsers();
}, []);
```

#### After:
```typescript
import { usersApi } from '@/lib/api-client';

useEffect(() => {
  const fetchUsers = async () => {
    const response = await usersApi.getUsers({
      user_type: 'member', // optional filter
      limit: 50,
      offset: 0,
    });
    
    if (response.success) {
      setUsers(response.data.users);
      setTotal(response.data.total);
    }
  };
  fetchUsers();
}, []);
```

---

### 4. Update Members List

**File: `src/app/dashboard/members/page.tsx`**

#### After:
```typescript
import { membersApi } from '@/lib/api-client';

useEffect(() => {
  const fetchMembers = async () => {
    const response = await membersApi.getMembers({
      status: 'active', // optional filter
      limit: 100,
      offset: 0,
    });
    
    if (response.success) {
      setMembers(response.data.members);
      setTotal(response.data.total);
    }
  };
  fetchMembers();
}, []);
```

---

### 5. Update Loans List

**File: `src/app/dashboard/loans/page.tsx`**

#### After:
```typescript
import { loansApi } from '@/lib/api-client';

useEffect(() => {
  const fetchLoans = async () => {
    const response = await loansApi.getLoans({
      status: 'pending', // optional filter
      limit: 50,
      offset: 0,
    });
    
    if (response.success) {
      setLoans(response.data.loans);
      setTotal(response.data.total);
    }
  };
  fetchLoans();
}, []);
```

---

### 6. Update Dashboard Stats

**File: `src/components/dashboard/AdminDashboard.tsx`**

#### After:
```typescript
import { dashboardApi } from '@/lib/api-client';

useEffect(() => {
  const fetchStats = async () => {
    const response = await dashboardApi.getStats();
    
    if (response.success) {
      const stats = response.data;
      setTotalMembers(stats.total_members);
      setActiveMembers(stats.active_members);
      setTotalLoans(stats.total_loans);
      setActiveLoanAmount(stats.active_loans_amount);
      // ... more stats
    }
  };
  fetchStats();
}, []);
```

---

## 🗑️ Files to Delete/Remove

Once you've refactored to use the PHP API, you can remove these files:

### Delete MySQL API Routes:
```bash
# These are no longer needed
src/app/api/auth/login/route.ts
src/app/api/auth/register/route.ts
src/app/api/users/route.ts
src/app/api/members/route.ts
src/app/api/loans/route.ts
# ... any other MySQL-based API routes
```

### Remove MySQL Dependencies:
```bash
# Update package.json - remove mysql2
npm uninstall mysql2
```

---

## 🔄 Migration Checklist

### Phase 1: Setup PHP API
- [ ] Upload PHP files to SmartWeb
- [ ] Configure database credentials
- [ ] Update CORS settings
- [ ] Change JWT secret
- [ ] Set file permissions
- [ ] Test endpoints with Postman

### Phase 2: Update Next.js
- [ ] Create `.env.local` with `NEXT_PUBLIC_API_URL`
- [ ] Copy `src/lib/api-client.ts` to your project
- [ ] Update login page to use `authApi.login()`
- [ ] Update register page to use `authApi.register()`
- [ ] Add logout functionality using `authApi.logout()`

### Phase 3: Refactor Data Fetching
- [ ] Update users list to use `usersApi.getUsers()`
- [ ] Update members list to use `membersApi.getMembers()`
- [ ] Update loans list to use `loansApi.getLoans()`
- [ ] Update dashboard stats to use `dashboardApi.getStats()`
- [ ] Update all other data fetching calls

### Phase 4: Test Everything
- [ ] Test login flow
- [ ] Test registration
- [ ] Test protected routes
- [ ] Test data fetching on all pages
- [ ] Test error handling
- [ ] Test logout

### Phase 5: Cleanup
- [ ] Delete old API route files
- [ ] Remove `mysql2` from package.json
- [ ] Remove `src/app/api/test-db/route.ts`
- [ ] Update environment variables in Vercel
- [ ] Deploy to Vercel

### Phase 6: Deploy
- [ ] Push changes to GitHub
- [ ] Redeploy on Vercel
- [ ] Test production deployment
- [ ] Monitor error logs

---

## 🔑 Environment Variables

### Local Development (`.env.local`):
```env
NEXT_PUBLIC_API_URL=https://excellencecoop.com/api
```

### Vercel Production:
```
NEXT_PUBLIC_API_URL=https://excellencecoop.com/api
```

**Remove these (no longer needed):**
```
DATABASE_HOST
DATABASE_USER
DATABASE_PASSWORD
DATABASE_NAME
DATABASE_PORT
```

---

## 🧪 Testing Your Refactored App

### 1. Test Login
```typescript
// Should work and redirect to dashboard
await authApi.login('test@example.com', 'password123');
```

### 2. Test Data Fetching
```typescript
// Should return members data
const response = await membersApi.getMembers();
console.log(response.data.members);
```

### 3. Test Protected Routes
```typescript
// Should work with saved token
const response = await usersApi.getUsers();
// If token is invalid/expired, should return 401
```

### 4. Test Logout
```typescript
// Should clear token from localStorage
authApi.logout();
// Then redirect to login page
```

---

## 🐛 Common Issues After Refactoring

### Issue 1: "Token not found" error
**Cause:** Token not being saved or retrieved correctly

**Fix:**
```typescript
// Check if token is saved after login
console.log(localStorage.getItem('authToken'));

// Make sure authApi.login() is being used correctly
```

### Issue 2: CORS errors
**Cause:** Vercel URL not in allowed origins

**Fix:**
1. Update `php-api/config/cors.php`
2. Add your Vercel URL to `$allowed_origins`

### Issue 3: "Cannot read property 'data'" error
**Cause:** Response structure different from expected

**Fix:**
```typescript
// Always check response.success first
if (response.success && response.data) {
  // Use response.data
} else {
  // Handle error
  console.error(response.message);
}
```

### Issue 4: Infinite loading states
**Cause:** API calls failing silently

**Fix:**
```typescript
try {
  const response = await membersApi.getMembers();
  if (response.success) {
    setMembers(response.data.members);
  } else {
    console.error('API Error:', response.message);
    setError(response.message);
  }
} catch (error) {
  console.error('Network Error:', error);
  setError('Failed to load data');
} finally {
  setIsLoading(false); // Always stop loading
}
```

---

## 📊 Performance Comparison

| Aspect | Before (Direct MySQL) | After (PHP API) |
|--------|----------------------|-----------------|
| Security | ❌ Exposed credentials | ✅ Hidden on server |
| Hosting | ⚠️ Needs Node.js support | ✅ Works on any shared hosting |
| Setup | ⚠️ Complex remote MySQL | ✅ Simple localhost connection |
| Performance | ⚠️ External DB connection | ✅ Local DB connection |
| Maintenance | ⚠️ Harder to debug | ✅ Easier to debug |
| Cost | 💰 $6-20/month | 💰 $0-5/month (shared hosting) |

---

## ✅ Completion Checklist

- [ ] All pages refactored to use PHP API
- [ ] Old API routes deleted
- [ ] `mysql2` dependency removed
- [ ] Environment variables updated
- [ ] Tested locally
- [ ] Deployed to Vercel
- [ ] Tested in production
- [ ] Error logs checked
- [ ] Performance verified

---

**🎉 Congratulations! Your app now uses a PHP API layer and can be hosted on SmartWeb!**

