# Deployment Guide for Coach Feature

## Overview
The Coach feature has been successfully implemented and is ready for deployment. Here's how to deploy it to your Vercel app.

## Files Added/Modified

### New Files:
- `lib/coach/rules.ts` - Recommendation logic
- `app/api/coach/conversations/route.ts` - API endpoint
- `src/components/CoachPage.tsx` - Coach interface
- `supabase-coach-tables.sql` - Database schema
- `COACH-FEATURE.md` - Feature documentation

### Modified Files:
- `src/App.tsx` - Added Coach tab to navigation

## Deployment Steps

### 1. Database Setup
First, run the Supabase migration to create the new tables:

```sql
-- Run this in your Supabase SQL editor
-- File: supabase-coach-tables.sql
```

The SQL file contains the complete schema for:
- `conversations` table
- `recommendations` table
- Proper indexes and RLS policies

### 2. Git Setup (if not already done)
```bash
git init
git add .
git commit -m "Add Coach feature with Supabase integration"
```

### 3. Vercel Deployment Options

#### Option A: Automatic Deployment (if connected to Git)
If your Vercel project is connected to a Git repository, simply push your changes:
```bash
git push origin main
```
Vercel will automatically detect the changes and deploy.

#### Option B: Manual Deployment with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option C: Deploy via Vercel Dashboard
1. Go to your Vercel dashboard
2. Find your project (task-figma-ten)
3. Click "Deploy" or trigger a new deployment

### 4. Environment Variables
Ensure these environment variables are set in your Vercel project:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Test the Deployment
After deployment, test the Coach feature:
1. Navigate to your app
2. Click the "Coach" tab
3. Fill out the form and submit
4. Verify recommendations are generated
5. Check that TASK recommendations sync to Kanban

## Feature Verification

### Expected Behavior:
- ✅ Coach tab appears in main navigation
- ✅ Form accepts conversation summary and rubric scores
- ✅ Recommendations are generated based on scores
- ✅ TASK recommendations create items in Kanban board
- ✅ Data persists in Supabase tables
- ✅ Styling matches existing app design

### API Endpoints:
- `POST /api/coach/conversations` - Submit conversation and get recommendations

### Database Tables:
- `conversations` - Stores conversation data
- `recommendations` - Stores generated recommendations

## Troubleshooting

### If deployment fails:
1. Check Vercel build logs
2. Verify all environment variables are set
3. Ensure Supabase tables are created
4. Check for any TypeScript errors

### If Coach tab doesn't appear:
1. Verify `src/App.tsx` was updated correctly
2. Check that `CoachPage.tsx` is imported
3. Ensure no build errors

### If API calls fail:
1. Check Supabase connection
2. Verify RLS policies allow public access
3. Check API route logs in Vercel

## Post-Deployment
Once deployed, the Coach feature will be available at:
- Your app URL + click "Coach" tab
- Direct API access at `/api/coach/conversations`

The feature integrates seamlessly with your existing Kanban system and maintains the same visual design language.

