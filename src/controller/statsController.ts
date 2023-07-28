import { Request, Response } from 'express'

import logs from '../services/logs'

// Use Case to Validate OLAs
const stats = async (req: Request, res: Response) => {
  console.log(req.path)
  console.log(await logs.getLogs())
  res.send(await logs.getLogs())
}

export default { stats }
