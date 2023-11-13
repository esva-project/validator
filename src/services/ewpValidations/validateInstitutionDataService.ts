import { ResponseDTO } from '../../dto/response/response'
import { Institutions } from '../../model/institutionResponse'
import { logger } from '../../utils/logs'

const validateEWPInstitutionsResponse = async (
  flow: number,
  institutions_response: Institutions,
  mobilityValidation: ResponseDTO
) => {
  // Add information about the institution found
  const msg = `Fetched Information from ${institutions_response.getHEIID()} institution`
  logger.ola.info(msg)
  console.log(msg)

  const hei_information =
    flow == 1
      ? mobilityValidation.getSendingHEIInformation()
      : mobilityValidation.getReceivingHEIInformation()

  mobilityValidation.setInstitutionHEIInformation(flow, institutions_response)

  const locationBothAPIs = 'Institution or Organizational Unit Contact List'
  const locationInstitution = 'Institution Contact List'

  mobilityValidation.addHEIValidation(
    flow,
    'LA Signer Name',
    hei_information.getMobilitySignature()?.getName() as string,
    locationBothAPIs
  )
  mobilityValidation.addHEIValidation(
    flow,
    'LA Signer Email',
    hei_information.getMobilitySignature()?.getEmail() as string,
    locationBothAPIs
  )
  mobilityValidation.addHEIValidation(
    flow,
    'LA Signer Position',
    hei_information.getMobilitySignature()?.getRole() as string,
    locationInstitution
  )

  // Compare Institution and Mobility Informations
  for (const contact of institutions_response.getContacts()) {
    if (contact.getContactPersonName() === hei_information.getMobilitySignature()?.getName()) {
      mobilityValidation.foundSendingHEIValdiation('LA Signer Name', locationBothAPIs)
    }
    if (contact.getContactPersonEmail() === hei_information.getMobilitySignature()?.getEmail()) {
      console.log('here?')
      mobilityValidation.foundSendingHEIValdiation('LA Signer Email', locationBothAPIs)
    }
    if (
      contact.getContactPersonRoleDescription().getValue() ===
      hei_information.getMobilitySignature()?.getRole()
    ) {
      mobilityValidation.foundSendingHEIValdiation('LA Signer Position', locationInstitution)
    }
  }

  return mobilityValidation
}

export default { validateEWPInstitutionsResponse }
