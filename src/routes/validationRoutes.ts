/** source/routes/posts.ts */
import bodyParser from 'body-parser'
import express from 'express'
import formidableMiddleware from 'express-formidable'

import controller from '../controller/validationController'

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(
  formidableMiddleware({
    encoding: 'utf8',
    multiples: false
  })
)

router.post('/ola', controller.validateOLA)

export default { router }
