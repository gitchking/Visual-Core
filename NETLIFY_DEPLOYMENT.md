# Netlify Deployment Guide for NodeHub

## Prerequisites
- Your code is pushed to GitHub
- You have a Netlify account (free tier available)

## Method 1: Deploy via Netlify UI (Recommended)

### Step 1: Connect to GitHub
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your repository: `gitchking/Visual-Core`

### Step 2: Configure Build Settings
Netlify will auto-detect your Vite project, but verify these settings:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Base directory**: (leave empty)

### Step 3: Set Environment Variables
If you're using Supabase, add these environment variables in Netlify:

1. Go to Site settings → Environment variables
2. Add the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Step 4: Deploy
1. Click "Deploy site"
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at a Netlify subdomain (e.g., `https://your-app-name.netlify.app`)

## Method 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```

### Step 3: Initialize and Deploy
```bash
# Build your project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## Custom Domain Setup

### Step 1: Add Custom Domain
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain name
4. Follow the DNS configuration instructions

### Step 2: Configure DNS
Add these DNS records to your domain provider:
- **Type**: CNAME
- **Name**: www (or @)
- **Value**: your-site-name.netlify.app

## Environment Variables for Production

### Supabase Configuration
If using Supabase, ensure these are set in Netlify:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### OAuth Redirect URLs
Update your Supabase OAuth settings to include:
- `https://your-site-name.netlify.app/auth/callback`
- `https://your-custom-domain.com/auth/callback` (if using custom domain)

## Troubleshooting

### Build Failures
1. Check build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility

### Routing Issues
The `netlify.toml` file includes redirects for React Router. If you have routing issues:
1. Verify the redirect rule is present
2. Check that all routes redirect to `/index.html`

### Environment Variables
1. Ensure all `VITE_` prefixed variables are set in Netlify
2. Redeploy after adding new environment variables

## Performance Optimization

### Enable Build Caching
Netlify automatically caches:
- `node_modules`
- Build artifacts

### Optimize Bundle Size
1. Use dynamic imports for large components
2. Enable code splitting in Vite
3. Optimize images and assets

## Monitoring and Analytics

### Netlify Analytics
- Enable in Site settings → Analytics
- Track page views, performance, and user behavior

### Error Tracking
- Set up error monitoring (e.g., Sentry)
- Monitor build and runtime errors

## Continuous Deployment

### Automatic Deploys
- Every push to `main` branch triggers a new deployment
- Preview deployments for pull requests

### Branch Deploys
- Create feature branch deployments
- Test changes before merging to main

## Security Considerations

### Environment Variables
- Never commit `.env` files to Git
- Use Netlify's environment variable system
- Rotate API keys regularly

### HTTPS
- Netlify provides free SSL certificates
- Force HTTPS redirects in site settings

## Support Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/start/overview#deployment)

## Quick Deploy Button

You can also use this button to deploy directly:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gitchking/Visual-Core) 