const { Client } = require('pg')

async function run() {
  const client = new Client({
    host: 'localhost',
    user: 'postgres',
    database: 'postgres',
    password: 'test',
    port: 5432
  })
  await client.connect()
  const res = await client.query('SELECT * FROM Persons')
  const data = res.rows[0]
  if (data.personid != 1) {
    throw new Error("Unexpected PersonId")
  }
  await client.end()
}

async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
