#!/usr/bin/env node

/**
 * Migration script to help transition from Supabase to Neon
 * This script provides guidance and checks for the migration
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 Neon Database Migration Helper')
console.log('================================\n')

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL environment variable not set')
  console.log('   Please set your Neon database connection string:')
  console.log('   DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require\n')
  process.exit(1)
}

console.log('✅ DATABASE_URL is configured')

// Check if required files exist
const requiredFiles = [
  'src/lib/neon/client.ts',
  'src/lib/neon/schema.ts',
  'src/lib/neon/migrate.ts',
  'src/lib/neon/setup.ts'
]

let allFilesExist = true
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`)
  } else {
    console.log(`❌ ${file} missing`)
    allFilesExist = false
  }
}

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please ensure the migration is complete.')
  process.exit(1)
}

console.log('\n✅ All required files are present')

// Check package.json for Drizzle
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
if (packageJson.dependencies['drizzle-orm']) {
  console.log('✅ Drizzle ORM dependency found')
} else {
  console.log('❌ Drizzle ORM dependency missing')
  console.log('   Run: pnpm add drizzle-orm')
}

console.log('\n🎉 Migration setup looks good!')
console.log('\nNext steps:')
console.log('1. Run: pnpm install')
console.log('2. Set up your Neon database')
console.log('3. Run: npx tsx src/lib/neon/setup.ts')
console.log('4. Test your application')
console.log('\nFor detailed instructions, see NEON_MIGRATION.md')
