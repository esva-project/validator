/** source/routes/posts.ts */
import bodyParser from 'body-parser'
import express from 'express'
import formidableMiddleware from 'express-formidable'

import statsController from '../controller/statsController'
import validationController from '../controller/validationController'

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(
  formidableMiddleware({
    encoding: 'utf8',
    multiples: false
  })
)

router.post('/ola', validationController.validateOLA)
router.get('/stats', statsController.stats)

export default { router }
