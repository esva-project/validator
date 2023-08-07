import * as cron from 'node-cron'
import pgPromise from 'pg-promise'

import { LogDTOParameters } from '../dto/logsDTO'
const pg = pgPromise({})

const db = pg(`postgres://postgres:"${process.env.DB_PASS}"@db:5432/esva_db`)

console.log(db)
console.log(`postgres://postgres:"${process.env.DB_PASS}"@db:5432/esva_db`)

const checkTableExists = async () => {
  console.log(db)
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS logs (
        time VARCHAR DEFAULT NOW(),
        ip VARCHAR,
        receivingEndpoint VARCHAR,
        receivingParameters VARCHAR,
        requestsPerformed VARCHAR[],
        responseStatus SMALLINT,
        responseMessage VARCHAR
      );
    `
    await db.query(query)
    console.log('Table logs created (if it did not exist).')
  } catch (error) {
    console.error('Error creating table:', error)
  }
}

const getLogs = async () => {
  console.log(db)
  return JSON.stringify(await db.query('SELECT * FROM logs'))
}

const insertLogs = async (logsDTO: LogDTOParameters) => {
  console.log(db)
  return await db.query(
    `insert into "logs" 
  ("ip", "receivingendpoint", "receivingparameters", "requestsperformed", "responsestatus", "responsemessage") 
  values
  ($1, $2, $3, $4, $5, $6)`,
    [
      logsDTO.getIP(),
      logsDTO.getReceivingEndpoint(),
      logsDTO.getReceivingParameters(),
      logsDTO.getRequestsPerformed(),
      logsDTO.getResponseStatus(),
      logsDTO.getResponseMessage()
    ]
  )
}

async function deleteOldLogs(): Promise<void> {
  try {
    const currentTimeMinusOneMinute = new Date(
      Date.now() - 6 * 30 * 24 * 60 * 60 * 1000
    ).toISOString()
    const timeParts = currentTimeMinusOneMinute.split('.')
    const timeQuery = timeParts[0].replace('T', ' ')

    console.log(timeQuery)
    const query = `
      DELETE FROM logs
      WHERE time < '${timeQuery}';
    `
    await db.query(query)
    console.log(`Deleted old logs.`)
  } catch (error) {
    console.error('Error deleting old logs:', error)
  }
}

// Schedule the cron job to run every day at midnight (0 0 * * *)
cron.schedule('0 0 * * *', async () => {
  console.log('Running cron job to delete old logs...')
  await deleteOldLogs()
})

console.log('Cron job scheduled.')

export default { checkTableExists, getLogs, insertLogs }
