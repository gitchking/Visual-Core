#!/bin/bash

# NodeHub Deployment Script
echo "🚀 NodeHub Deployment Script"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Please create one with your Supabase credentials."
    echo "Example .env content:"
    echo "VITE_SUPABASE_URL=https://your-project.supabase.co"
    echo "VITE_SUPABASE_ANON_KEY=your-anon-key-here"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build the project
echo "🏗️  Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Your app is ready for deployment!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Choose your deployment platform:"
    echo "   - Vercel (recommended): https://vercel.com"
    echo "   - Netlify: https://netlify.com"
    echo "   - GitHub Pages: Push to main branch"
    echo "   - Firebase: Run 'firebase deploy'"
    echo ""
    echo "2. Set environment variables in your hosting platform:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo ""
    echo "3. Update Supabase CORS settings with your domain"
    echo ""
    echo "📁 Build output: ./dist/"
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi 