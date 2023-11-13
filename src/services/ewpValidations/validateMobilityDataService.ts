import { MobilityLaParameters } from '../../dto/mobilityParameters'
import { ResponseDTO } from '../../dto/response/response'
import { Mobility } from '../../model/mobilityResponse'
import { logger } from '../../utils/logs'

const validateEWPMobilityResponse = async (
  mobility_response: Mobility,
  params: MobilityLaParameters,
  response: ResponseDTO
) => {
  // Add information about the mobility found
  const msg = `Found Correct Mobility with ID ${params.getOMobilityID()}`
  logger.ola.info(msg)

  if (mobility_response.getOMobilityID() == '') {
    return response
  }

  // Set the EWPResponse object in the response JSON
  response.setMobilityHEIInformation(1, mobility_response)
  const sending_signature = response.getSendingHEIInformation().getMobilitySignature()
  response.setMobilityHEIInformation(2, mobility_response)
  const receiving_signature = response.getReceivingHEIInformation().getMobilitySignature()
  response.setStudentInformation(mobility_response)
  const student_information = response.getStudentInformation()

  // Compare PDF Signatures With Sending HEI, Receiving HEI, and Student Information
  if (sending_signature && receiving_signature) {
    const location = 'Document Signatures'

    response.addHEIValidation(1, 'LA Signer Name', sending_signature.getName(), location)
    response.addHEIValidation(1, 'LA Signer Email', sending_signature.getEmail(), location)
    response.addHEIValidation(2, 'LA Signer Name', receiving_signature.getName(), location)
    response.addHEIValidation(2, 'LA Signer Email', receiving_signature.getEmail(), location)
    response.addStudentHEIValidation(
      'Student Name',
      student_information.getName().getValue(),
      location
    )
    response.addStudentHEIValidation(
      'Student Email',
      student_information.getEmail().getValue(),
      location
    )

    for (const signature of response.getSignatures()) {
      console.log(sending_signature.getName())
      console.log(receiving_signature.getName())

      if (signature.getCommonName().toLowerCase() === sending_signature.getName()) {
        response.foundSendingHEIValdiation('LA Signer Name', location)
      }
      if (signature.getEmail() === sending_signature.getEmail()) {
        response.foundSendingHEIValdiation('LA Signer Email', location)
      }
      if (signature.getCommonName().toLowerCase() === receiving_signature.getName()) {
        response.foundReceivingHEIValdiation('LA Signer Name', location)
      }
      if (signature.getEmail() === receiving_signature.getEmail()) {
        response.foundReceivingHEIValdiation('LA Signer Email', location)
      }
      if (
        signature.getCommonName().toLowerCase() ===
        student_information.getName().getValue().toLowerCase()
      ) {
        response.foundStudentValdiation('Student Name', location)
      }
      if (signature.getEmail() === student_information.getEmail().getValue()) {
        response.foundStudentValdiation('Student Email', location)
      }
    }
  }

  return response
}

export default { validateEWPMobilityResponse }
