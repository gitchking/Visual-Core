# 🔐 Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your NodeHub application.

## 📋 Prerequisites

- A Google Cloud Console account
- A Supabase project (already configured)
- Your NodeHub app running locally

## 🚀 Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make sure billing is enabled (required for OAuth)

### 1.2 Enable Google+ API
1. Navigate to **APIs & Services** → **Library**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click on it and press **Enable**

### 1.3 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application** as the application type
4. Fill in the details:
   - **Name:** `NodeHub OAuth Client`
   - **Authorized JavaScript origins:**
     ```
     http://localhost:8087
     http://localhost:3000
     https://your-domain.com (if you have one)
     ```
   - **Authorized redirect URIs:**
     ```
     https://your-project.supabase.co/auth/v1/callback
     http://localhost:8087/auth/callback
     ```

### 1.4 Copy Credentials
After creation, you'll get:
- **Client ID** (looks like: `123456789-abcdef.apps.googleusercontent.com`)
- **Client Secret** (keep this secure!)

## 🔧 Step 2: Configure Supabase

### 2.1 Add Google Provider
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list and click **Enable**

### 2.2 Configure Google OAuth
1. In the Google provider settings, enter:
   - **Client ID:** Your Google OAuth Client ID
   - **Client Secret:** Your Google OAuth Client Secret
2. Click **Save**

### 2.3 Configure Site URL
1. Go to **Authentication** → **Settings**
2. Set **Site URL** to: `http://localhost:8087`
3. Add **Redirect URLs:**
   ```
   http://localhost:8087/auth/callback
   http://localhost:8087/**
   ```

## 🔧 Step 3: Update Environment Variables

Update your `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🧪 Step 4: Test the Setup

### 4.1 Start Your App
```bash
npm run dev
```

### 4.2 Test Google Sign-In
1. Go to `http://localhost:8087`
2. Click **Sign In** or **Sign Up**
3. Click **Continue with Google**
4. You should be redirected to Google's consent screen
5. After authorization, you'll be redirected back to your app

## 🔍 Troubleshooting

### Common Issues:

#### 1. "Invalid redirect URI" Error
- **Cause:** Redirect URI doesn't match what's configured in Google Console
- **Solution:** Double-check the redirect URIs in Google Cloud Console

#### 2. "OAuth requires Supabase configuration" Error
- **Cause:** Environment variables not set correctly
- **Solution:** Verify your `.env` file has real Supabase credentials

#### 3. "Failed to fetch" Error
- **Cause:** Network issues or CORS problems
- **Solution:** Check browser console for detailed error messages

#### 4. Redirect Loop
- **Cause:** Incorrect redirect URL configuration
- **Solution:** Ensure Supabase redirect URLs include your localhost URL

### Debug Steps:
1. Check browser console for errors
2. Verify Google Cloud Console settings
3. Confirm Supabase provider configuration
4. Test with different browsers
5. Check network tab for failed requests

## 🔒 Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all secrets
3. **Restrict OAuth scopes** to minimum required
4. **Regularly rotate** client secrets
5. **Monitor OAuth usage** in Google Cloud Console

## 📱 Additional Providers

You can also add other OAuth providers:
- **GitHub:** Similar setup process
- **Discord:** Available in Supabase
- **Apple:** Requires Apple Developer account
- **Microsoft:** Azure AD setup required

## 🎉 Success!

Once configured, users can:
- Sign in with their Google account
- Access their profile information
- Use the app without creating a separate account
- Have their data securely stored in Supabase

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Google Cloud Console logs
3. Check Supabase authentication logs
4. Verify all URLs and credentials are correct

---

**Note:** This setup works with the local storage fallback system. When Supabase is properly configured, OAuth will work seamlessly. When using placeholder credentials, OAuth buttons will show an error message but the app will continue to function with local authentication. 