# InsightShield Authentication Setup Guide

This guide will help you set up authentication for the InsightShield project using Supabase with two predefined users.

## Prerequisites

- Supabase project created
- Supabase CLI installed (optional, for local development)

## Step 1: Configure Supabase Authentication

### 1.1 Enable Email Authentication

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Ensure **Email** provider is enabled
4. Disable **Enable sign up** to prevent new user registrations
5. Save the changes

### 1.2 Create the Two Users

You need to create two users manually in Supabase:

#### Option A: Using Supabase Dashboard

1. Go to **Authentication** > **Users**
2. Click **Add User**
3. Create the first user:
   - **Email**: `superuser@insightshield.com`
   - **Password**: Choose a strong password (e.g., `superuser123`)
   - **Email Confirm**: Check this box
4. Create the second user:
   - **Email**: `normaluser@insightshield.com`
   - **Password**: Choose a strong password (e.g., `normaluser123`)
   - **Email Confirm**: Check this box

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Create users (replace with your project reference)
supabase auth admin create-user --email superuser@insightshield.com --password SuperUser123! --email-confirm
supabase auth admin create-user --email normaluser@insightshield.com --password NormalUser123! --email-confirm
```

## Step 2: Apply Database Policies

### 2.1 Run the Authentication Setup SQL

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase/auth-setup.sql`
5. Run the query

This will:
- Enable Row Level Security (RLS) on all tables
- Create functions to determine user roles
- Set up policies for superuser and normal user access

### 2.2 Verify the Setup

Run this query to verify the policies are in place:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

## Step 3: Configure Environment Variables

### 3.1 Frontend Configuration

Ensure your `.env` file contains the correct Supabase configuration:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3.2 Backend Configuration

Update your backend API to use the service role key for database operations:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Step 4: Test the Authentication

### 4.1 Test User Login

1. Start your frontend application
2. Navigate to `/login`
3. Test both users:
   - **Superuser**: `superuser@insightshield.com` / `SuperUser123!`
   - **Normal User**: `normaluser@insightshield.com` / `NormalUser123!`

### 4.2 Verify Role-Based Access

- **Superuser** should have access to:
  - All dashboard pages
  - Create Instance page
  - Upload Vulnerabilities page
  - Access Management page

- **Normal User** should have access to:
  - All dashboard pages (read-only)
  - Cannot access Create Instance
  - Cannot access Upload Vulnerabilities
  - Cannot access Access Management

## Step 5: Security Considerations

### 5.1 Password Security

- Use strong passwords for both users
- Consider implementing password rotation policies
- Store passwords securely (not in code)

### 5.2 API Security

- The backend API now requires authentication tokens
- All database operations are performed with user context
- RLS policies ensure data isolation

### 5.3 Session Management

- Sessions are managed by Supabase
- Automatic token refresh is handled
- Logout clears all session data

## Troubleshooting

### Common Issues

1. **"Access denied" error on login**
   - Verify the user email is exactly as configured
   - Check that the user exists in Supabase
   - Ensure email confirmation is completed

2. **"No authentication token available" error**
   - User session may have expired
   - Try logging out and logging back in
   - Check browser console for authentication errors

3. **Database access denied errors**
   - Verify RLS policies are applied correctly
   - Check that the user role is being set properly
   - Ensure the backend is using the correct service role key

4. **"Invalid run ID" error during upload**
   - This may be related to RLS policies blocking backend access
   - Ensure the backend has proper authentication
   - Check that the run creation is successful

### Debug Commands

```sql
-- Check user roles
SELECT current_setting('app.user_role', true);

-- Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check if user exists
SELECT * FROM auth.users WHERE email = 'superuser@insightshield.com';
```

## User Credentials Summary

| User | Email | Role | Access Level |
|------|-------|------|--------------|
| Superuser | `superuser@insightshield.com` | `superuser` | Full access (read/write) |
| Normal User | `normaluser@insightshield.com` | `normaluser` | Read-only access |

## Next Steps

1. **Customize User Management**: If you need to add more users, modify the `allowedUsers` object in `AuthContext.tsx`
2. **Enhance Security**: Consider implementing additional security measures like IP whitelisting
3. **Audit Logging**: Add logging for user actions and access attempts
4. **Password Policies**: Implement stronger password requirements if needed

## Support

If you encounter issues during setup:

1. Check the Supabase documentation
2. Review the browser console for error messages
3. Verify all environment variables are set correctly
4. Ensure the SQL policies were applied successfully 