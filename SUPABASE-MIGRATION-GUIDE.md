# Supabase Migration Guide

## 🚀 Complete Schema Transfer to New Organization

This guide will help you transfer your Karenban app's database to a new Supabase organization.

## 📋 What's Included

The `COMPLETE-SUPABASE-SCHEMA.sql` file contains:

### ✅ **Core Tables**
- `columns` - Kanban board columns
- `categories` - Task categories within columns  
- `tasks` - All task data with full field set
- `team_members` - Team member management

### ✅ **Coach Feature Tables**
- `conversations` - Managing-up conversation logs
- `recommendations` - Generated recommendations

### ✅ **Complete Feature Set**
- **Main Kanban Board** - All columns and categories
- **Personal Column** - Personal task management
- **Week View** - Day-by-day planning (Day 1-6)
- **Team Management** - Team member tracking
- **Coach Feature** - Conversation analysis and recommendations

### ✅ **Database Optimizations**
- Performance indexes
- Row Level Security (RLS) policies
- Foreign key constraints
- Data validation rules

## 🔧 Migration Steps

### **Step 1: Create New Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your new organization
3. Click "New Project"
4. Choose your organization
5. Set up the project (name, database password, region)

### **Step 2: Run the Schema**
1. Go to **SQL Editor** in your new project
2. Copy the entire contents of `COMPLETE-SUPABASE-SCHEMA.sql`
3. Paste into the SQL Editor
4. Click **Run** to execute the schema

### **Step 3: Update Environment Variables**
In your Vercel project settings, update:
- `NEXT_PUBLIC_SUPABASE_URL` → Your new project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Your new project anon key

### **Step 4: Verify Migration**
1. Check that all tables were created
2. Verify default data is present
3. Test your app with the new database

## 📊 Expected Results

After running the schema, you should have:

### **Tables Created:**
- ✅ `columns` (14 rows) - All board columns including week view
- ✅ `categories` (30+ rows) - All categories for each column
- ✅ `tasks` (0 rows) - Ready for your tasks
- ✅ `team_members` (0 rows) - Ready for team setup
- ✅ `conversations` (0 rows) - Ready for Coach feature
- ✅ `recommendations` (0 rows) - Ready for Coach recommendations

### **Features Available:**
- ✅ **Main Board** - Today, Follow-up, Later, Completed
- ✅ **Personal Column** - Personal task management
- ✅ **Week View** - Day 1-6 planning
- ✅ **Team Management** - Add/manage team members
- ✅ **Coach Feature** - Managing-up conversations
- ✅ **All UI Features** - Drag & drop, task creation, etc.

## 🔍 Verification Queries

Run these in your new Supabase SQL Editor to verify:

```sql
-- Check table counts
SELECT 'Columns' as table_name, COUNT(*) as count FROM columns
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'Team Members', COUNT(*) FROM team_members;

-- Check column structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'tasks' ORDER BY ordinal_position;
```

## 🚨 Important Notes

### **Data Transfer**
- This schema creates the **structure** and **default data**
- Your **existing tasks and team members** will need to be exported/imported separately
- The Coach feature starts fresh (no existing conversations)

### **Environment Variables**
- Update your Vercel project with new Supabase credentials
- The app will work immediately with the new database
- All features will be available from the start

### **RLS Policies**
- All tables have public read/write access
- You can customize these later for better security
- Current setup allows the app to work immediately

## 🎯 Next Steps

1. **Run the schema** in your new Supabase project
2. **Update environment variables** in Vercel
3. **Test the app** - everything should work immediately
4. **Add your team members** through the UI
5. **Start using the Coach feature** for managing-up conversations

## 🆘 Troubleshooting

### **If tables don't create:**
- Check for SQL syntax errors
- Ensure you have proper permissions
- Try running sections individually

### **If app shows 500 errors:**
- Verify environment variables are updated
- Check that RLS policies are created
- Ensure all tables exist

### **If features don't work:**
- Check that default data was inserted
- Verify indexes were created
- Test with a simple query first

Your Karenban app with the Coach feature will be fully functional in the new organization! 🎉
