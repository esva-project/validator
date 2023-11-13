import { ResponseDTO } from '../../dto/response/response'
import { OUnits } from '../../model/ounitResponse'
import { logger } from '../../utils/logs'

const validateEWPOUnitsResponse = async (
  flow: number,
  ounits_response: OUnits,
  institutionsAndMobilityValidation: ResponseDTO
) => {
  // Add information about the institution found
  const msg = `Fetched Information from ${ounits_response
    .getOUnitName()
    .getValue()} organizational unit`
  logger.ola.info(msg)

  const ounit_information =
    flow == 1
      ? institutionsAndMobilityValidation.getSendingHEIInformation()
      : institutionsAndMobilityValidation.getReceivingHEIInformation()

  institutionsAndMobilityValidation.setOUnitHEIInformation(flow, ounits_response)

  const location = 'Institution or Organizational Unit Contact List'

  institutionsAndMobilityValidation.addHEIValidation(
    flow,
    'LA Contact Person Name',
    ounit_information.getMobilityContacts()?.getName() as string,
    location
  )
  institutionsAndMobilityValidation.addHEIValidation(
    flow,
    'LA Contact Person Email',
    ounit_information.getMobilityContacts()?.getEmail() as string,
    location
  )

  const existing_ounit_names = []
  for (const val of ounit_information.getOUnitNames())
    existing_ounit_names.push(Object.assign({}, val))

  for (const name of existing_ounit_names) {
    for (const name2 of ounits_response.getOUnitNames()) {
      name2.getValue() === name.getValue()
        ? name.addAPI('OUnits')
        : ounit_information.setOUnitName('OUnits', true, name2.getValue())
    }
  }

  // Compare Institution and Mobility Informations
  for (const contact of ounits_response.getContacts()) {
    console.log('validatiing ounits')
    console.log(contact.getContactPersonName())
    console.log(ounit_information.getMobilityContacts())
    if (contact.getContactPersonName() === ounit_information.getMobilitySignature()?.getName()) {
      institutionsAndMobilityValidation.foundSendingHEIValdiation('LA Signer Name', location)
    }
    if (contact.getContactPersonEmail() === ounit_information.getMobilitySignature()?.getEmail()) {
      institutionsAndMobilityValidation.foundSendingHEIValdiation('LA Signer Email', location)
    }

    if (contact.getContactPersonName() === ounit_information.getMobilityContacts()?.getName()) {
      institutionsAndMobilityValidation.foundSendingHEIValdiation(
        'LA Contact Person Name',
        location
      )
    }
    if (contact.getContactPersonEmail() === ounit_information.getMobilityContacts()?.getEmail()) {
      institutionsAndMobilityValidation.foundSendingHEIValdiation(
        'LA Contact Person Email',
        location
      )
    }
  }
  return institutionsAndMobilityValidation
}

export default { validateEWPOUnitsResponse }
