#!/bin/bash

# Vercel Deployment Script for JAL Event Booking Portal

echo "🚀 Starting Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if DATABASE_URL is set for production
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Warning: DATABASE_URL not set. Make sure to configure it in Vercel dashboard."
    echo "   Go to: Project Settings > Environment Variables"
    echo "   Add: DATABASE_URL with your PostgreSQL connection string"
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔧 Don't forget to:"
echo "   1. Set DATABASE_URL in Vercel dashboard"
echo "   2. Set ADMIN_API_KEY in Vercel dashboard"
echo "   3. The database schema will be automatically created on first deployment"
