# 🔐 GitHub Secrets Setup Guide

This guide will help you set up the required secrets for GitHub Actions deployment.

## 📋 Required Secrets

For the GitHub Actions workflow to work properly with Supabase, you need to set up these repository secrets:

### **1. VITE_SUPABASE_URL**
- **Value:** Your Supabase project URL
- **Example:** `https://azysnmzwcblwwswdpnnl.supabase.co`

### **2. VITE_SUPABASE_ANON_KEY**
- **Value:** Your Supabase anon/public key
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6eXNubXp3Y2Jsd3dzd2Rwbm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNTg0OTYsImV4cCI6MjA2NTgzNDQ5Nn0.3e1DQPdBySzvBGLxtBbkOggn3DZje54ILdmcJnNXepMg`

## 🚀 How to Set Up Secrets

### **Step 1: Go to Repository Settings**
1. Navigate to your repository: `https://github.com/gitchking/Visual-Core`
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### **Step 2: Add Repository Secrets**
1. Click **New repository secret**
2. Add each secret:

#### **Secret 1:**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** Your Supabase project URL

#### **Secret 2:**
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** Your Supabase anon key

### **Step 3: Verify Secrets**
- You should see both secrets listed (values will be hidden)
- The workflow will now use these secrets during deployment

## 🔍 Finding Your Supabase Credentials

### **If you already have a Supabase project:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key

### **If you need to create a new Supabase project:**
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Wait for it to be created
4. Go to **Settings** → **API**
5. Copy the credentials

## ⚠️ Important Notes

### **Security:**
- ✅ Secrets are encrypted and hidden
- ✅ Only repository admins can see/edit secrets
- ✅ Values are never shown in logs

### **Fallback Mode:**
- If secrets are not set, the app will use local storage fallback
- This means authentication and data will be stored locally
- Perfect for testing and development

### **Environment Variables vs Secrets:**
- **Secrets:** Used in GitHub Actions (CI/CD)
- **Environment Variables:** Used in hosting platforms (Netlify, Vercel, etc.)

## 🧪 Testing the Setup

### **After setting up secrets:**
1. Make a small change to your code
2. Push to the `main` branch
3. Go to **Actions** tab in your repository
4. Watch the workflow run
5. Check that the build succeeds

### **Expected Behavior:**
- ✅ Build completes successfully
- ✅ App deploys to GitHub Pages
- ✅ No "context access might be invalid" errors

## 🔧 Troubleshooting

### **If you see "context access might be invalid" errors:**
1. Check that secret names are exactly correct (case-sensitive)
2. Ensure secrets are added to the repository (not organization)
3. Verify you have admin access to the repository

### **If the build fails:**
1. Check the Actions logs for specific errors
2. Verify your Supabase credentials are correct
3. Test the credentials locally first

### **If you want to use fallback mode only:**
- Simply don't set the secrets
- The app will work with local storage
- Perfect for demos and testing

## 📚 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 🎉 Success!

Once you've set up the secrets, your GitHub Actions workflow will:
1. ✅ Build your app with proper environment variables
2. ✅ Deploy to GitHub Pages automatically
3. ✅ Work with Supabase authentication and database
4. ✅ Update on every push to main branch

**Your NodeHub app will be live at:** `https://gitchking.github.io/Visual-Core/` 