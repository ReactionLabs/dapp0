import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq, and, desc } from 'drizzle-orm'
import { users, wallets, projects } from './schema'

// Initialize Neon client
function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL not found in environment variables')
    console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('DATABASE')))
    throw new Error('DATABASE_URL environment variable is required')
  }
  return databaseUrl
}

const sql = neon(getDatabaseUrl())
export const db = drizzle(sql)

// Database operations
export class DatabaseService {
  // User operations
  async createUser(userData: { email?: string; username?: string; avatar_url?: string; github_username?: string }) {
    const [user] = await db.insert(users).values(userData).returning()
    return user
  }

  async getUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id))
    return user
  }

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    return user
  }

  async updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning()
    return user
  }

  // Wallet operations
  async createWallet(walletData: {
    user_id: string
    wallet_address: string
    chain_type: string
    is_primary?: boolean
  }) {
    const [wallet] = await db.insert(wallets).values(walletData).returning()
    return wallet
  }

  async getWalletByAddress(address: string) {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.wallet_address, address))
    return wallet
  }

  async getWalletsByUserId(userId: string) {
    return await db.select().from(wallets).where(eq(wallets.user_id, userId))
  }

  async getUserWithWallets(userId: string) {
    const [user] = await db.select().from(users).where(eq(users.id, userId))
    if (!user) return null

    const userWallets = await this.getWalletsByUserId(userId)
    return { ...user, wallets: userWallets }
  }

  async getUserByWalletAddress(address: string) {
    const [wallet] = await db
      .select()
      .from(wallets)
      .innerJoin(users, eq(wallets.user_id, users.id))
      .where(eq(wallets.wallet_address, address))
    
    if (!wallet) return null

    const userWallets = await this.getWalletsByUserId(wallet.users.id)
    return { ...wallet.users, wallets: userWallets }
  }

  // Project operations
  async createProject(projectData: {
    user_id: string
    name: string
    type: string
    chain: string
    generated_code?: string
    messages?: any[]
    is_public?: boolean
    github_repo_url?: string
  }) {
    const [project] = await db.insert(projects).values(projectData).returning()
    return project
  }

  async getProjectById(id: string, userId: string) {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.user_id, userId)))
    return project
  }

  async getProjectsByUserId(userId: string) {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.user_id, userId))
      .orderBy(desc(projects.updated_at))
  }

  async updateProject(id: string, userId: string, data: Partial<typeof projects.$inferInsert>) {
    const [project] = await db
      .update(projects)
      .set(data)
      .where(and(eq(projects.id, id), eq(projects.user_id, userId)))
      .returning()
    return project
  }

  async deleteProject(id: string, userId: string) {
    await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.user_id, userId)))
  }

  async getPublicProjects() {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.is_public, true))
      .orderBy(desc(projects.created_at))
  }
}

export const databaseService = new DatabaseService()