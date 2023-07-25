/** source/controllers/posts.ts */
import { Request, Response } from 'express'

import logs from '../services/logs'

// Use Case to Validate OLAs
const stats = async (_req: Request, res: Response) => {
  res.send(logs.getLogs())
}

export default { stats }
