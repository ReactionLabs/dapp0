import { pgTable, uuid, timestamp, text, boolean, json, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const chainTypeEnum = pgEnum('chain_type', [
  'solana',
  'ethereum', 
  'sui',
  'xrp',
  'polygon',
  'avalanche'
])

export const projectTypeEnum = pgEnum('project_type', [
  'frontend',
  'agent'
])

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  email: text('email').unique(),
  username: text('username').unique(),
  avatar_url: text('avatar_url'),
  github_username: text('github_username'),
  github_access_token: text('github_access_token'),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

// Wallets table
export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  wallet_address: text('wallet_address').unique().notNull(),
  chain_type: chainTypeEnum('chain_type').notNull(),
  is_primary: boolean('is_primary').default(false),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
})

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  type: projectTypeEnum('type').notNull(),
  chain: text('chain').notNull(),
  generated_code: text('generated_code'),
  messages: json('messages').default([]),
  github_repo_url: text('github_repo_url'),
  is_public: boolean('is_public').default(false),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

// Types for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Wallet = typeof wallets.$inferSelect
export type NewWallet = typeof wallets.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
