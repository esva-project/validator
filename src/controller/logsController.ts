import { Request, Response } from 'express'

import logsService from '../services/logs'

// Use Case to Validate OLAs
const logs = async (req: Request, res: Response) => {
  console.log(req.path)

  console.log(req.fields)
  console.log(req.query)

  res.send(await logsService.getLogs())
}

export default { logs }
