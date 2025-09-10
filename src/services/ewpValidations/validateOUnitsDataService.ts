import { ResponseDTO } from '../../dto/response/response'
import { OUnits } from '../../model/ounitResponse'
import { logger } from '../../utils/logs'
import { partialPresentInFull } from '../../utils/strings'

const validateEWPOUnitsResponse = async (
  flow: number,
  ounits_response: OUnits,
  institutionsAndMobilityValidation: ResponseDTO
) => {
  // Add information about the institution found
  const msg = `Fetched Information from ${ounits_response.getOUnitName()} organizational unit`
  logger.ola.info(msg)

  const ounit_information =
    flow == 1
      ? institutionsAndMobilityValidation.getSendingHEIInformation()
      : institutionsAndMobilityValidation.getReceivingHEIInformation()

  institutionsAndMobilityValidation.setOUnitHEIInformation(flow, ounits_response)

  const location = 'Institution or Organizational Unit Contact List'
  console.log('OUnit_information')
  console.log(JSON.stringify(ounit_information))

  let contacts = ounit_information.getMobilityContacts()
  let l = 'LA Contact Person'
  if (contacts.length > 0) {
    contacts = ounit_information.geIIAContacts()
    l = 'IIA Contact Person'
  }

  console.log('Obtained Contacts')
  console.log(contacts)

  if (contacts.length > 0) {
    for (const c of contacts) {
      institutionsAndMobilityValidation.addHEIValidation(
        flow,
        l + ' Name',
        c.getName() as string,
        location
      )
      institutionsAndMobilityValidation.addHEIValidation(
        flow,
        l + ' Email',
        c.getEmail() as string,
        location
      )
    }
  }

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
    if (contact.getContactPersonName() === ounit_information.getMobilitySignature()?.getName()) {
      institutionsAndMobilityValidation.foundSendingHEIValdiation('LA Signer Name', location)
    }
    if (contact.getContactPersonEmail() === ounit_information.getMobilitySignature()?.getEmail()) {
      institutionsAndMobilityValidation.foundSendingHEIValdiation('LA Signer Email', location)
    }

    if (l == 'IIA Contact Person') {
      if (contacts.some((x) => x.email == contact.getContactPersonEmail())) {
        institutionsAndMobilityValidation.foundSendingHEIValdiation(l, location)
      }
    } else {
      for (const c of contacts) {
        if (contact.getContactPersonName() === c.getName()) {
          institutionsAndMobilityValidation.foundSendingHEIValdiation(l + ' Name', location)
        } else if (
          contact.getContactPersonEmail() === c.getEmail() &&
          partialPresentInFull(contact.getContactPersonEmail(), c.getEmail() as string)
        ) {
          institutionsAndMobilityValidation.foundSendingHEIValdiation(l + ' Name', location)
        }
        if (contact.getContactPersonEmail() === c.getEmail()) {
          institutionsAndMobilityValidation.foundSendingHEIValdiation(l + ' Email', location)
        }
      }
    }
  }

  return institutionsAndMobilityValidation
}

export default { validateEWPOUnitsResponse }
