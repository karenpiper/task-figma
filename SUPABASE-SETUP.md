# Supabase Setup Guide

## 🚀 Quick Setup

### 1. Create Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lgryrpcvbojfaljwlcpi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncnlycGN2Ym9qZmFsandsY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMDAxMTMsImV4cCI6MjA3MTY3NjExM30.Kl7YKYlWEuXDjuXhcG7t2Ii0VmWCB64vu8BGOIk8wjo

# Environment
NODE_ENV=development
```

### 2. Database Setup

#### Option A: Use the Complete Setup Script
Run the `supabase-setup-complete.sql` script in your Supabase SQL editor. This will:
- Create all necessary tables
- Add the new task fields (detail, client, due_date, notes, team_member_id)
- Set up proper indexes and foreign keys
- Enable Row Level Security (RLS)
- Create sample data

#### Option B: Manual Setup
If you prefer to set up manually:

1. **Create Tables**: Run the basic schema from `supabase-schema.sql`
2. **Add New Fields**: Run the migration from `supabase-schema-update.sql`
3. **Set up RLS**: Enable Row Level Security on all tables
4. **Create Policies**: Allow public read/write access

### 3. Vercel Environment Variables

For production deployment, add these environment variables in your Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📊 Database Schema

### Tables

#### `columns`
- `id` (TEXT, PRIMARY KEY)
- `title` (TEXT)
- `color` (TEXT)
- `order_index` (INTEGER)

#### `categories`
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `column_id` (TEXT, FOREIGN KEY)
- `order_index` (INTEGER)
- `is_default` (BOOLEAN)

#### `tasks` (Enhanced)
- `id` (SERIAL, PRIMARY KEY)
- `title` (TEXT, REQUIRED)
- `detail` (TEXT, NEW)
- `priority` (TEXT, DEFAULT: 'medium')
- `project` (TEXT, NEW)
- `client` (TEXT, NEW)
- `due_date` (DATE, NEW)
- `notes` (TEXT, NEW)
- `column_id` (TEXT, FOREIGN KEY)
- `category_id` (TEXT, FOREIGN KEY)
- `team_member_id` (INTEGER, FOREIGN KEY, NEW)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `team_members`
- `id` (SERIAL, PRIMARY KEY)
- `name` (TEXT, REQUIRED)
- `email` (TEXT)
- `avatar` (TEXT)
- `color` (TEXT)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)

### Relationships

- **Columns** → **Categories** (one-to-many)
- **Columns** → **Tasks** (one-to-many)
- **Categories** → **Tasks** (one-to-many)
- **Team Members** → **Tasks** (one-to-many)

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with public read/write policies for development. In production, you may want to restrict access based on user authentication.

## 🧪 Testing

After setup, you should be able to:

1. **View the board** with default columns and categories
2. **Create tasks** with all the new fields
3. **Add team members** through the + button in the follow-up column
4. **Move tasks** between columns and categories
5. **Use the enhanced Add Task dialog** with all fields

## 🚨 Troubleshooting

### Common Issues

1. **"Table doesn't exist"**: Run the setup script in Supabase SQL editor
2. **"Permission denied"**: Check RLS policies are set to allow public access
3. **"Column doesn't exist"**: Ensure you've run the migration script
4. **Environment variables not working**: Restart your development server after adding `.env.local`

### Verification

Check your Supabase dashboard:
- **Table Editor**: Should show all 4 tables
- **SQL Editor**: Run `SELECT * FROM tasks LIMIT 1;` to verify structure
- **Authentication**: RLS policies should be visible in the Policies tab

## 🔄 Updates

The API routes are now configured to:
- Use environment variables (with fallback to hardcoded values)
- Handle all new task fields properly
- Support team member management
- Work with the enhanced dialog components

## 📱 Features

With this setup, you'll have:
- ✅ **Enhanced task creation** with all requested fields
- ✅ **Team member management** with + button in follow-up column
- ✅ **Modern dialog styling** throughout the application
- ✅ **Proper database structure** with relationships and indexes
- ✅ **Row Level Security** for data protection
- ✅ **Sample data** for testing and development 