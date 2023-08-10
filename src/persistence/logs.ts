import * as cron from 'node-cron'
import pgPromise from 'pg-promise'

import { LogDTOParameters } from '../dto/logsDTO'
import { LogGetDTOParameters } from '../dto/logsGetDTO'
const pg = pgPromise({})

const db = pg(`postgres://postgres:"${process.env.DB_PASS}"@db:5432/esva_db`)

const checkTableExists = async () => {
  console.log(Number.parseInt(process.env.TIME_STORAGE_LOGS as string) * 30 * 24 * 60 * 60 * 1000)
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS logs (
        time VARCHAR DEFAULT NOW(),
        ip VARCHAR,
        browser VARCHAR,
        operating_system VARCHAR,
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

const getLogs = async (logsDTO: LogGetDTOParameters) => {
  let query = 'SELECT * FROM logs'

  console.log(logsDTO)

  const conditions: string[] = []

  if (logsDTO.getSince()) {
    conditions.push(`time >= '${logsDTO.getSince()}'`)
  }
  if (logsDTO.getUntil()) {
    conditions.push(`time <= '${logsDTO.getUntil()}'`)
  }
  if (logsDTO.getIP()) {
    conditions.push(`ip LIKE '%${logsDTO.getIP()}%'`)
  }
  if (logsDTO.getBrowser()) {
    conditions.push(`browser LIKE '%${logsDTO.getBrowser()}%'`)
  }
  if (logsDTO.getOS()) {
    conditions.push(`operating_system LIKE '%${logsDTO.getOS()}%'`)
  }
  if (logsDTO.getReceivingEndpoint()) {
    conditions.push(
      `(receivingEndpoint = '/${logsDTO.getReceivingEndpoint()}' OR receivingEndpoint = '${logsDTO.getReceivingEndpoint()}')`
    )
  }
  if (logsDTO.getReceivingParametersContains()) {
    conditions.push(`receivingParameters LIKE '%${logsDTO.getReceivingParametersContains()}%'`)
  }
  console.log(logsDTO.getRequestsPerformedContains())
  if (logsDTO.getRequestsPerformedContains().length > 0) {
    const requests = logsDTO
      .getRequestsPerformedContains()
      .map((request) => `'${request}'`)
      .join(',')
    conditions.push(`'${requests}' = ANY(requestsPerformed)`)
  }
  if (logsDTO.getResponseStatus()) {
    if (logsDTO.getResponseStatus() == 'true') {
      conditions.push(`responseStatus = 200`)
    } else {
      conditions.push(`responseStatus <> 200`)
    }
  }
  if (logsDTO.getResponseMessageContains()) {
    conditions.push(`responseMessage LIKE '%${logsDTO.getResponseMessageContains()}%'`)
  }

  console.log(conditions)

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`
  }

  query += ` ORDER BY time DESC LIMIT 10 OFFSET ${(logsDTO.getSelectedPage() - 1) * 10}`

  console.log(query)

  return JSON.stringify(await db.query(query))
}

const insertLogs = async (logsDTO: LogDTOParameters) => {
  return await db.query(
    `insert into "logs" 
  ("ip", "browser", "operating_system", "receivingendpoint", "receivingparameters", "requestsperformed", "responsestatus", "responsemessage") 
  values
  ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      logsDTO.getIP(),
      logsDTO.getBrowser(),
      logsDTO.getOS(),
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
      Date.now() -
        Number.parseInt(process.env.TIME_STORAGE_LOGS as string) * 30 * 24 * 60 * 60 * 1000
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
