/* eslint-disable node/no-unsupported-features/node-builtins */
import crypto from 'crypto'
import fs from 'fs'
import https from 'https'
import url from 'url'

import httpSignature from 'http-signature'
import { v4 as uuidv4 } from 'uuid'
import xmlparser from 'xml2js'

const get = async (get_url: string, params: any) => {
  const parser = new url.URL(get_url)

  // Defining the algorithm
  const algorithm = 'sha256'

  // Creating the digest in hex encoding
  const digest = crypto.createHash(algorithm).update('').digest('base64')

  // Printing the digests
  console.log(digest.toString())

  const options = {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      Digest: 'SHA-256=' + digest.toString(),
      'Request-Target': 'GET /' + parser.host.replace(':8443', ''),
      'X-Request-Id': uuidv4()
    },
    host: parser.host.replace(':8443', ''),
    method: 'GET',
    path: parser.pathname + '?' + new URLSearchParams(params).toString(),
    port: parser.port
  }

  console.log(options)
  console.log(params)

  const res: any = await doRequest(options)
  console.log(res)
  const par = xmlparser.parseStringPromise
  const h = res.replace(/(<\/)\s*(\w+):/g, '</').replace(/(<\s*\/?)\w+:/g, '<')

  return await par(h)
}

function doRequest(options: any) {
  return new Promise((resolve, reject) => {
    console.log('here')
    const req = https.request(options, (res) => {
      res.setEncoding('utf8')
      let responseBody = ''

      res.on('data', (chunk) => {
        responseBody += chunk
      })

      res.on('end', () => {
        resolve(responseBody)
      })
    })
    // const shasum = crypto.createHash('sha256')
    // shasum.update(fs.readFileSync(`./certificates/${process.env.CERT_DOMAIN}.pub`).toString())
    // const res = shasum.digest('hex')
    // console.log(res)

    // console.log(fs.readFileSync(`./certificates/${process.env.CERT_DOMAIN}.pub`).toString())

    // const fingerprint = httpSignature.pemToRsaSSHKey(
    //   fs.readFileSync(`./certificates/${process.env.CERT_DOMAIN}.key`).toString()
    // )
    // console.log(fingerprint)
    // const fingerprint2 = httpSignature.sshKeyFingerprint(fingerprint)
    // console.log(fingerprint2)

    httpSignature.sign(req, {
      headers: ['(request-target)', 'host', 'date', 'digest', 'x-request-id'],
      key: fs.readFileSync(`./certificates/${process.env.CERT_DOMAIN}.key`),
      keyId: process.env.EWP_KEY_ID
    })

    req.on('error', (err) => {
      console.log('errrrr')
      console.log(err)
      reject(err)
    })

    req.end()
  })
}

export default { get }
