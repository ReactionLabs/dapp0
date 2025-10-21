# Database Setup Guide for dApp0

This guide will help you set up the database integration with Supabase for dApp0.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **GitHub Account**: For OAuth integration
3. **Node.js v20+**: Already installed

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `dapp0-database`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)
   - **service_role** key (starts with `eyJ`)

## Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" to execute the migration
5. Verify the tables were created in **Table Editor**

## Step 4: Create GitHub OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `dApp0`
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

## Step 5: Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# v0 API (existing)
V0_API_KEY=your_v0_api_key

# Solana Configuration (existing)
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

## Step 6: Install Dependencies

```bash
pnpm install
```

## Step 7: Test the Setup

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Open `http://localhost:3000`

3. Connect your Solana wallet (Phantom, Solflare, etc.)

4. You should see the profile setup modal

5. Complete your profile with email and username

6. Try creating a new project

## Step 8: Deploy to Vercel

1. Push your code to GitHub

2. Connect your repository to Vercel

3. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all the variables from `.env.local`

4. Update GitHub OAuth callback URL:
   - Go to GitHub OAuth App settings
   - Update "Authorization callback URL" to your Vercel domain
   - Example: `https://your-app.vercel.app/api/auth/github/callback`

5. Deploy!

## Database Schema

The following tables are created:

### `users`
- `id` (UUID, primary key)
- `email` (text, unique)
- `username` (text, unique)
- `avatar_url` (text, nullable)
- `github_username` (text, nullable)
- `github_access_token` (text, nullable, encrypted)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `wallets`
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `wallet_address` (text, unique)
- `chain_type` (text: 'solana', 'ethereum', 'sui', 'xrp', 'polygon', 'avalanche')
- `is_primary` (boolean)
- `created_at` (timestamp)

### `projects`
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `name` (text)
- `type` (text: 'frontend', 'agent')
- `chain` (text)
- `generated_code` (text)
- `messages` (jsonb)
- `github_repo_url` (text, nullable)
- `is_public` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Wallet Signature Verification**: Cryptographic proof of wallet ownership
- **Encrypted GitHub Tokens**: Secure storage of OAuth tokens
- **Input Validation**: Zod schemas for all API endpoints

## Troubleshooting

### Common Issues

1. **"Not authenticated" errors**
   - Check if Supabase credentials are correct
   - Verify the user is properly signed in

2. **Database connection errors**
   - Ensure Supabase project is active
   - Check if the migration was run successfully

3. **GitHub OAuth not working**
   - Verify callback URL matches exactly
   - Check if GitHub OAuth app is properly configured

4. **Wallet signature verification fails**
   - Ensure you're using the correct wallet
   - Check if the message format matches

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test database connection in Supabase dashboard
4. Check API responses in Network tab

## Next Steps

Once the database is set up, you can:

1. **Test wallet authentication** - Connect different wallets
2. **Create projects** - Generate and save projects
3. **Connect GitHub** - Export projects to repositories
4. **Deploy to production** - Use Vercel with Supabase

## Support

If you encounter issues:

1. Check the Supabase logs in your dashboard
2. Review the browser console for client-side errors
3. Verify all environment variables are set correctly
4. Ensure the database schema was created properly

Happy building! 🚀
