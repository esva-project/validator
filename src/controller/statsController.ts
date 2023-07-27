import { Request, Response } from 'express'

// import logs from '../services/logs'

// Use Case to Validate OLAs
const stats = async (req: Request, res: Response) => {
  console.log(req.path)
  res.send('hello')
}

export default { stats }
