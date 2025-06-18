# 🚀 NodeHub Deployment Guide

This guide will help you deploy your NodeHub application to various platforms.

## 📋 Pre-Deployment Checklist

### ✅ Environment Variables
Ensure your Supabase credentials are ready:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### ✅ Supabase Configuration
1. **Disable email confirmation** (for easier testing)
2. **Set up authentication providers** (if needed)
3. **Configure CORS origins** for your domain
4. **Set up database tables** (profiles, threads, etc.)

### ✅ Build Test
```bash
npm run build
```
Should complete without errors.

## 🌐 Deployment Options

### **Option 1: Vercel (Recommended)**

#### **Step 1: Prepare Repository**
```bash
# Ensure your code is in a Git repository
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### **Step 2: Deploy to Vercel**
1. **Go to [Vercel](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your repository**
5. **Configure settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### **Step 3: Set Environment Variables**
In Vercel dashboard:
1. Go to **Settings → Environment Variables**
2. Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

#### **Step 4: Deploy**
Click **Deploy** and wait for build to complete.

**✅ Benefits:**
- Automatic deployments on push
- Global CDN
- Custom domains
- Analytics included

---

### **Option 2: Netlify**

#### **Step 1: Deploy to Netlify**
1. **Go to [Netlify](https://netlify.com)**
2. **Sign up/Login** with GitHub
3. **Click "New site from Git"**
4. **Choose your repository**
5. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

#### **Step 2: Set Environment Variables**
In Netlify dashboard:
1. Go to **Site settings → Environment variables**
2. Add your Supabase credentials

#### **Step 3: Deploy**
Click **Deploy site**

**✅ Benefits:**
- Free tier available
- Form handling
- Serverless functions
- Easy custom domains

---

### **Option 3: GitHub Pages**

#### **Step 1: Enable GitHub Pages**
1. **Go to your repository settings**
2. **Scroll to "Pages" section**
3. **Source:** Deploy from a branch
4. **Branch:** `gh-pages` (will be created by action)

#### **Step 2: Set Repository Secrets**
1. **Go to Settings → Secrets and variables → Actions**
2. **Add repository secrets:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

#### **Step 3: Push to Deploy**
```bash
git push origin main
```
The GitHub Action will automatically build and deploy.

**✅ Benefits:**
- Free hosting
- Integrated with GitHub
- Automatic deployments

---

### **Option 4: Firebase Hosting**

#### **Step 1: Install Firebase CLI**
```bash
npm install -g firebase-tools
```

#### **Step 2: Initialize Firebase**
```bash
firebase login
firebase init hosting
```

#### **Step 3: Configure firebase.json**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### **Step 4: Deploy**
```bash
npm run build
firebase deploy
```

**✅ Benefits:**
- Google's infrastructure
- Fast global CDN
- Easy custom domains

---

## 🔧 Post-Deployment Configuration

### **Supabase Settings**
1. **Update CORS origins** in Supabase dashboard:
   ```
   https://your-domain.vercel.app
   https://your-domain.netlify.app
   https://your-username.github.io
   ```

2. **Update redirect URLs** for authentication:
   ```
   https://your-domain.vercel.app/auth/callback
   https://your-domain.netlify.app/auth/callback
   ```

### **Custom Domain (Optional)**
1. **Purchase domain** (Namecheap, GoDaddy, etc.)
2. **Configure DNS** to point to your hosting provider
3. **Add domain** in hosting provider dashboard
4. **Update Supabase CORS** with new domain

### **SSL Certificate**
- **Vercel/Netlify:** Automatic SSL
- **GitHub Pages:** Automatic SSL
- **Firebase:** Automatic SSL

## 🧪 Testing Your Deployment

### **Functionality Tests**
1. **Authentication:**
   - Sign up with new account
   - Sign in with existing account
   - Check profile creation

2. **Core Features:**
   - Flow editor (create/edit flows)
   - Todo management
   - Community threads
   - DevTool access

3. **Responsive Design:**
   - Test on mobile devices
   - Test on different browsers

### **Performance Tests**
- **Lighthouse Audit:** Run in Chrome DevTools
- **Page Speed:** Check loading times
- **Bundle Size:** Verify optimization

## 🔍 Troubleshooting

### **Common Issues**

#### **Build Failures**
```bash
# Check for TypeScript errors
npm run lint

# Check for missing dependencies
npm install

# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **Environment Variables**
- Ensure variables are set in hosting platform
- Check variable names (case-sensitive)
- Verify Supabase credentials are correct

#### **Routing Issues**
- Ensure SPA routing is configured
- Check for 404 errors on refresh
- Verify `index.html` fallback is set

#### **Authentication Issues**
- Check Supabase CORS settings
- Verify redirect URLs
- Test with different browsers

## 📊 Monitoring & Analytics

### **Vercel Analytics**
- Built-in performance monitoring
- Real user metrics
- Error tracking

### **Google Analytics**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### **Error Tracking**
Consider adding Sentry for error monitoring:
```bash
npm install @sentry/react @sentry/tracing
```

## 🚀 Production Optimization

### **Performance**
- Enable gzip compression
- Optimize images
- Use CDN for assets
- Implement lazy loading

### **Security**
- Enable HTTPS
- Set security headers
- Regular dependency updates
- Environment variable protection

### **SEO**
- Add meta tags
- Implement sitemap
- Optimize for search engines
- Add Open Graph tags

---

## 🎉 Success!

Your NodeHub application is now deployed and ready for users!

**Next Steps:**
1. Share your deployed URL
2. Monitor performance
3. Gather user feedback
4. Plan future updates

**Support:**
- Check hosting provider documentation
- Review Supabase guides
- Monitor application logs
- Set up monitoring alerts 