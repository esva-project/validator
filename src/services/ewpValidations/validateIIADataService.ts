import { ResponseDTO } from '../../dto/response/response'
import { IIA } from '../../model/iiaResponse'
import { logger } from '../../utils/logs'

const validateEWPIIAResponse = async (
  iia_response: IIA,
  response: ResponseDTO,
  sending: string
) => {
  // Add information about the mobility found
  const msg = `Found Correct IIA`
  logger.ola.info(msg)

  // Set the EWPResponse object in the response JSON
  response.setIIAHEIInformation(1, iia_response, sending)
  const sending_signature = response.getSendingHEIInformation().getMobilitySignature()
  response.setIIAHEIInformation(2, iia_response, sending)
  const receiving_signature = response.getReceivingHEIInformation().getMobilitySignature()

  // Compare PDF Signatures With Sending HEI, Receiving HEI, and Student Information
  if (sending_signature && receiving_signature) {
    const location = 'Document Signatures'
    console.log('printing sending stuff')
    console.log(sending_signature.getName())
    console.log(sending_signature.getEmail())

    console.log('printing receiving stuff')
    console.log(receiving_signature.getName())
    console.log(receiving_signature.getName())
    if (sending_signature.getName() == undefined && sending_signature.getEmail() == undefined) {
      response.addHEIValidation(
        1,
        'No IIA Signer information was found to perform validations',
        '',
        ''
      )
    } else {
      response.addHEIValidation(
        1,
        'IIA Signer Name',
        sending_signature.getName() as string,
        location
      )
      response.addHEIValidation(
        1,
        'IIA Signer Email',
        sending_signature.getEmail() as string,
        location
      )
    }

    if (receiving_signature.getName() == undefined && receiving_signature.getEmail() == undefined) {
      response.addHEIValidation(
        2,
        'No IIA Signer information was found to perform validations',
        '',
        ''
      )
    } else {
      response.addHEIValidation(
        2,
        'IIA Signer Name',
        receiving_signature.getName() as string,
        location
      )
      response.addHEIValidation(
        2,
        'IIA Signer Email',
        receiving_signature.getEmail() as string,
        location
      )
    }

    for (const signature of response.getSignatures()) {
      if (signature.getCommonName().toLowerCase() === sending_signature.getName()) {
        response.foundSendingHEIValdiation('IIA Signer Name', location)
      }
      if (signature.getEmail() === sending_signature.getEmail()) {
        response.foundSendingHEIValdiation('IIA Signer Email', location)
      }
      if (signature.getCommonName().toLowerCase() === receiving_signature.getName()) {
        response.foundReceivingHEIValdiation('IIA Signer Name', location)
      }
      if (signature.getEmail() === receiving_signature.getEmail()) {
        response.foundReceivingHEIValdiation('IIA Signer Email', location)
      }
    }

    response.getSendingHEIInformation().removeEmptyInstitutionContact()
    response.getReceivingHEIInformation().removeEmptyInstitutionContact()
  }

  return response
}

export default { validateEWPIIAResponse }
