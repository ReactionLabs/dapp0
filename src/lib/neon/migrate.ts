import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import { users, wallets, projects } from './schema'

// Run migrations
export async function runMigrations() {
  const sql = neon(process.env.DATABASE_URL!)
  const db = drizzle(sql)
  
  try {
    await migrate(db, { migrationsFolder: './src/lib/neon/migrations' })
    console.log('Migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

// Create tables manually (alternative to migrations)
export async function createTables() {
  const sql = neon(process.env.DATABASE_URL!)
  
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        email TEXT UNIQUE,
        username TEXT UNIQUE,
        avatar_url TEXT,
        github_username TEXT,
        github_access_token TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create wallets table
    await sql`
      CREATE TABLE IF NOT EXISTS wallets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        wallet_address TEXT UNIQUE NOT NULL,
        chain_type TEXT NOT NULL CHECK (chain_type IN ('solana', 'ethereum', 'sui', 'xrp', 'polygon', 'avalanche')),
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('frontend', 'agent')),
        chain TEXT NOT NULL,
        generated_code TEXT,
        messages JSONB DEFAULT '[]'::jsonb,
        github_repo_url TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(wallet_address)`
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at)`

    // Create updated_at trigger function
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `

    // Create triggers for updated_at
    await sql`DROP TRIGGER IF EXISTS update_users_updated_at ON users`
    await sql`
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `

    await sql`DROP TRIGGER IF EXISTS update_projects_updated_at ON projects`
    await sql`
      CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `
    
    console.log('Tables created successfully')
  } catch (error) {
    console.error('Table creation failed:', error)
    throw error
  }
}
