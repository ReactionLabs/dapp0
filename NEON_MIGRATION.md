# Migration from Supabase to Neon Database

This document outlines the migration from Supabase to Neon database for the dapp0 project.

## What Changed

### Database Layer
- **Replaced**: Supabase client with Neon database using Drizzle ORM
- **New files**:
  - `src/lib/neon/client.ts` - Neon database client with Drizzle ORM
  - `src/lib/neon/schema.ts` - Database schema definitions
  - `src/lib/neon/migrate.ts` - Database migration utilities
  - `src/lib/neon/setup.ts` - Database setup script

### Updated Files
- `src/lib/auth/wallet-auth.ts` - Updated to use Neon database service
- `src/app/api/auth/verify/route.ts` - Updated to use Neon database
- `src/app/api/projects/route.ts` - Updated to use Neon database
- `src/app/api/projects/[id]/route.ts` - Updated to use Neon database
- `package.json` - Added Drizzle ORM dependency

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file with your Neon database connection string:

```env
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Database Setup
Run the database setup script to create tables:

```bash
npx tsx src/lib/neon/setup.ts
```

Or programmatically:
```typescript
import { setupDatabase } from '@/lib/neon/setup'
await setupDatabase()
```

## Database Schema

The Neon database uses the same schema as the original Supabase setup:

### Tables
- **users** - User profiles and authentication data
- **wallets** - Wallet addresses linked to users
- **projects** - User projects and generated code

### Key Features
- UUID primary keys
- Automatic timestamps (created_at, updated_at)
- JSONB support for messages
- Proper foreign key relationships
- Indexes for performance

## API Changes

### Authentication
- Wallet-based authentication remains the same
- Session management unchanged
- All authentication flows preserved

### Database Operations
- All CRUD operations now use Drizzle ORM
- Type-safe database queries
- Better error handling
- Consistent API responses

## Benefits of Migration

1. **Cost**: Neon offers more generous free tier
2. **Performance**: Better query performance with Drizzle ORM
3. **Type Safety**: Full TypeScript support with Drizzle
4. **Flexibility**: More control over database operations
5. **Scalability**: Better suited for production workloads

## Rollback Plan

If you need to rollback to Supabase:

1. Revert the changed files to their original state
2. Restore Supabase dependencies in package.json
3. Update environment variables to use Supabase
4. Run database migrations in Supabase

## Testing

After migration, test the following:

1. User authentication with wallet
2. Project creation and management
3. Database queries and updates
4. Error handling and edge cases

## Support

For issues with the migration:
1. Check the Neon database connection
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check database schema matches expectations
