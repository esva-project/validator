import { Request, Response } from 'express'

import logsService from '../services/logs'

// Use Case to Validate OLAs
const logs = async (req: Request, res: Response) => {
  console.log(req.path)

  console.log(req.fields)
  console.log(req.query)

  const logs = await logsService.getLogs()
  console.log(logs)

  res.send(logs)
}

export default { logs }
