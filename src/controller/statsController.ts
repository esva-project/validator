import { Request, Response } from 'express'

import logs from '../services/logs'

// Use Case to Validate OLAs
const stats = async (req: Request, res: Response) => {
  console.log(req.path)
  const answear = await logs.getLogs()
  console.log(answear)
  res.send(answear)
}

export default { stats }
