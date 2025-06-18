# Supabase Authentication Setup

This project now uses Supabase for authentication and database management. Follow these steps to set up Supabase:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be set up (this may take a few minutes)

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon/public key

## 3. Set Up Environment Variables

Create a `.env` file in the root directory with:

```env
# Supabase Configuration
# Replace these placeholder values with your actual Supabase credentials
# Get these from: https://supabase.com/dashboard/project/[YOUR-PROJECT-ID]/settings/api

VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Set Up Database Tables

Run these SQL commands in your Supabase SQL Editor:

### Profiles Table
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Threads Table
```sql
-- Create threads table
CREATE TABLE threads (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT,
  website_url TEXT,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view threads" ON threads
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create threads" ON threads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads" ON threads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own threads" ON threads
  FOR DELETE USING (auth.uid() = user_id);
```

## 5. Set Up Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL (e.g., `http://localhost:8087` for development)
3. Add redirect URLs for OAuth providers if you want to use Google/GitHub login

### OAuth Setup (Optional)

#### Google OAuth
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add your Supabase redirect URL: `https://your-project.supabase.co/auth/v1/callback`
4. Add the client ID and secret to Supabase Auth settings

#### GitHub OAuth
1. Go to GitHub Developer Settings
2. Create a new OAuth App
3. Add your Supabase redirect URL: `https://your-project.supabase.co/auth/v1/callback`
4. Add the client ID and secret to Supabase Auth settings

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Try signing up with email/password
3. Try creating a thread in the community
4. Test OAuth login if configured

## 7. Database Functions (Optional)

You can also create a function to automatically create a profile when a user signs up:

```sql
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Troubleshooting

- Make sure your environment variables are correctly set
- Check the browser console for any errors
- Verify that your Supabase project is active and not paused
- Ensure RLS policies are correctly configured
- Check that your redirect URLs are properly set up for OAuth

## Features

With this setup, you now have:

✅ **Real User Authentication** - No more dummy accounts
✅ **User Profiles** - Customizable user information
✅ **OAuth Support** - Google and GitHub login
✅ **Secure Database** - Row Level Security enabled
✅ **Social Media Features** - Real user interactions
✅ **Persistent Data** - All data stored in Supabase cloud 