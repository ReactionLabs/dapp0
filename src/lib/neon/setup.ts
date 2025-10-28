import { createTables } from './migrate'

// Setup script to initialize the database
export async function setupDatabase() {
  try {
    console.log('Setting up Neon database...')
    await createTables()
    console.log('Database setup completed successfully!')
  } catch (error) {
    console.error('Database setup failed:', error)
    throw error
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
