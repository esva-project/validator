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
  const sending_signature = response.getSendingHEIInformation().geIIAContacts()
  response.setIIAHEIInformation(2, iia_response, sending)
  const receiving_signature = response.getReceivingHEIInformation().geIIAContacts()

  // Compare PDF Signatures With Sending HEI, Receiving HEI, and Student Information
  if (sending_signature && receiving_signature) {
    const location = 'Document Signatures'
    if (sending_signature.getName() == undefined && sending_signature.getEmail() == undefined) {
      response.addHEIValidation(
        1,
        'No IIA Contact information was found to perform validations',
        '',
        ''
      )
    } else {
      response.addHEIValidation(
        1,
        'IIA Contact Name',
        sending_signature.getName() as string,
        location
      )
      response.addHEIValidation(
        1,
        'IIA Contact Email',
        sending_signature.getEmail() as string,
        location
      )
    }

    if (receiving_signature.getName() == undefined && receiving_signature.getEmail() == undefined) {
      response.addHEIValidation(
        2,
        'No IIA Contact information was found to perform validations',
        '',
        ''
      )
    } else {
      response.addHEIValidation(
        2,
        'IIA Contact Name',
        receiving_signature.getName() as string,
        location
      )
      response.addHEIValidation(
        2,
        'IIA Contact Email',
        receiving_signature.getEmail() as string,
        location
      )
    }

    for (const signature of response.getSignatures()) {
      if (signature.getCommonName().toLowerCase() === sending_signature.getName()) {
        response.foundSendingHEIValdiation('IIA Contact Name', location)
      }
      if (signature.getEmail() === sending_signature.getEmail()) {
        response.foundSendingHEIValdiation('IIA Contact Email', location)
      }
      if (signature.getCommonName().toLowerCase() === receiving_signature.getName()) {
        response.foundReceivingHEIValdiation('IIA Contact Name', location)
      }
      if (signature.getEmail() === receiving_signature.getEmail()) {
        response.foundReceivingHEIValdiation('IIA Contact Email', location)
      }
    }

    response.getSendingHEIInformation().removeEmptyInstitutionContact()
    response.getReceivingHEIInformation().removeEmptyInstitutionContact()
  }

  return response
}

export default { validateEWPIIAResponse }
