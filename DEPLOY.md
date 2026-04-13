# VeloCity Deployment Guide

## 🚀 Quick Deploy (Frontend Only - Works Now!)

### Step 1: Push to GitHub
```bash
cd D:\VeloCity

# Initialize git (if not already)
git init
git add .
git commit -m "VeloCity v1 - Fuel Access Ecosystem"

# Create GitHub repo and push:
# 1. Go to https://github.com/new
# 2. Create repo named "velocity" 
# 3. Run these commands:
git remote add origin https://github.com/YOUR_USERNAME/velocity.git
git branch -M main
git push -u main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click **"Add New..."** → **Project**
3. Import your **velocity** repository
4. Click **Deploy**

✅ Your app is live at `https://velocity.vercel.app`!

---

## 🗄️ Full Backend (Supabase)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Click **"Start your project"**
3. Create new project → Fill in details
4. Wait for project to provision (~2 min)

### Step 2: Run Database Schema
1. In Supabase dashboard → **SQL Editor**
2. Copy contents from `supabase/schema.sql`
3. Click **Run**

### Step 3: Get API Keys
1. Go to **Settings** → **API**
2. Copy **Project URL**
3. Copy **anon public** key (under "Project API keys")

### Step 4: Configure Vercel
In your Vercel project → **Settings** → **Environment Variables**:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Then **Redeploy** to activate.

---

## 📱 What Works

| Feature | Demo Mode | Full Mode |
|---------|----------|----------|
| Login | ✅ | ✅ |
| Dashboard | ✅ | ✅ |
| QR Dispense | ✅ | ✅ |
| Vehicle Registration | ✅ | ✅ |
| Appointments | ✅ | ✅ |
| Multi-user sync | ❌ | ✅ |
| SMS Notifications | ❌ | ✅* |
| Revenue Split | ✅ | ✅ |

*Needs Supabase Edge Functions

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Styling | CSS (Modern) |
| Animations | Framer Motion |
| Auth | Supabase Auth |
| Database | PostgreSQL |
| Hosting | Vercel |
| SMS | EthioTelecom API |

---

## 📞 Support

- GitHub Issues: https://github.com/yourusername/velocity/issues
- Demo Login: developer / dev123

---

**Quick Start:** Just push to GitHub and deploy to Vercel! The demo mode works without any backend!