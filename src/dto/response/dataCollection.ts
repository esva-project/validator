import { Institutions } from '../../model/institutionResponse'
import { HEI, Mobility, MobilitySignatureInterface } from '../../model/mobilityResponse'
import { OUnits } from '../../model/ounitResponse'
import {
  SignerCertificateInformationDTO,
  SubjectDistinguishedName
} from '../signerCertificateInformationDTO'

interface DataCollectionInterface {
  ewpData: EWPData
  signature: SignerCertificateInformationDTO[]
}

interface EWPDataInterface {
  sending_hei: EWPDataHEI
  receiving_hei: EWPDataHEI
  student: EWPDataStudent
}

interface EWPDataHEIInterface {
  institution_contacts: EWPDataContact[]
  ounit_contacts: EWPDataContact[]
  ounit_name: ValueAPIFetched[]
  ounit_id: string
  schac_code: string
}

interface EWPDataContactInterface {
  'contact-name': string
  email: string
  'role-description': string
  api_fetched: string[]
}

interface ValueAPIFetchedInterface {
  api_fetched: string[]
  value: string
}

interface EWPDataStudentInterface {
  contact_person_name: ValueAPIFetched
  contact_person_email: ValueAPIFetched
}

class DataCollectionDTO implements DataCollectionInterface {
  ewpData: EWPData
  signature: SignerCertificateInformationDTO[]

  constructor() {
    this.ewpData = new EWPData()
    this.signature = []
  }

  public getSignatures = () => this.signature

  public addSignature = (signer: string, level: string) => {
    this.signature.push(new SignerCertificateInformationDTO(signer, level))
  }
  public setSignersCertificateInformation = (
    name: string,
    country: string,
    email: string,
    orgID: string,
    orgName: string,
    subjDist: SubjectDistinguishedName[]
  ) => {
    for (const element of this.signature) {
      if (element.getCommonName() == name) {
        element.setCountry(country)
        element.setEmail(email)
        element.setOrganizationId(orgID)
        element.setOrganizationName(orgName)
        element.setSubjectDistinguishedName(subjDist)
      }
    }
  }

  public getEWPDataSendingHEI = () => this.ewpData.getSendingHEI()
  public getEWPDataReceivingHEI = () => this.ewpData.getReceivingHEI()
  public getEWPDataStudent = () => this.ewpData.student

  public setMobilityHEI = (flow: number, _info: Mobility) => {
    const editiESEng_hei = flow == 1 ? this.getEWPDataSendingHEI() : this.getEWPDataReceivingHEI()

    const hei = flow == 1 ? (_info.getSendingHEI() as HEI) : (_info.getReceivingHEI() as HEI)
    const hei_signature =
      flow == 1
        ? (_info.getSendingSignature() as MobilitySignatureInterface)
        : (_info.getReceivingSignature() as MobilitySignatureInterface)
    const sign_contact_to_add = new EWPDataContact(
      hei_signature['signer-name'],
      hei_signature['signer-email'],
      hei_signature['signer-position'],
      'Mobility LA Signer'
    )
    const ounit_contact_to_add = new EWPDataContact(
      hei.getContactPersonName(),
      hei.getContactPersonEmail(),
      '',
      'Mobility LA Contact'
    )

    const ounit_id = hei.getOUnitID()
    const ounit_name = hei.getOUnitName()

    editing_hei.setSchacCode(hei.getHEIID())
    editing_hei.setOUnitID(ounit_id as string)
    ounit_name == undefined || ounit_name == ''
      ? editing_hei.setOUnitName('OMobility LA', false, 'No Organizational Unit Name Found')
      : editing_hei.setOUnitName('OMobility LA', true, ounit_name)
    if (!editing_hei.contactExistsInInstitutionContacts(sign_contact_to_add, 'Mobility LA Signer'))
      editing_hei.addInstitutionContact(sign_contact_to_add)
    if (!editing_hei.contactExistsInOUnitContacts(ounit_contact_to_add, 'Mobility LA Contact'))
      editing_hei.addOUnitContact(ounit_contact_to_add)
  }

  public setMobilityStudent = (_info: Mobility) => {
    this.getEWPDataStudent().setName(_info.getStudent().getName() as string)
    this.getEWPDataStudent().setEmail(_info.getStudent().getEmail() as string)
  }

  public setInstitutionContacts = (flow: number, _info: Institutions) => {
    const editing_hei = flow == 1 ? this.getEWPDataSendingHEI() : this.getEWPDataReceivingHEI()

    const contacts = _info.getContacts()

    for (const contact of contacts) {
      editing_hei.addInstitutionContact(
        new EWPDataContact(
          contact.getContactPersonName(),
          contact.getContactPersonEmail(),
          contact.getContactPersonRoleDescription().getValue(),
          'Institution Contact List'
        )
      )
    }
  }

  public setOUnitsContacts = (flow: number, _info: OUnits) => {
    const editing_hei = flow == 1 ? this.getEWPDataSendingHEI() : this.getEWPDataReceivingHEI()

    const contacts = _info.getContacts()

    for (const contact of contacts) {
      editing_hei.addOUnitContact(
        new EWPDataContact(
          contact.getContactPersonName(),
          contact.getContactPersonEmail(),
          contact.getContactPersonRoleDescription().getValue(),
          'OUnit Contact List'
        )
      )
    }
  }
}

class EWPData implements EWPDataInterface {
  sending_hei: EWPDataHEI
  receiving_hei: EWPDataHEI
  student: EWPDataStudent

  constructor() {
    this.sending_hei = new EWPDataHEI()
    this.receiving_hei = new EWPDataHEI()
    this.student = new EWPDataStudent()
  }

  public getSendingHEI = () => this.sending_hei
  public getReceivingHEI = () => this.receiving_hei
  public getStudent = () => this.student
}

class EWPDataHEI implements EWPDataHEIInterface {
  institution_contacts: EWPDataContact[]
  ounit_contacts: EWPDataContact[]
  ounit_id: string
  ounit_name: ValueAPIFetched[]
  schac_code: string

  constructor() {
    this.institution_contacts = []
    this.ounit_contacts = []
    this.ounit_name = []
    this.schac_code = ''
    this.ounit_id = ''
  }

  public getSchacCode = () => this.schac_code
  public getOUnitID = () => this.ounit_id
  public getOUnitNames = () => this.ounit_name

  public setSchacCode = (s: string) => (this.schac_code = s)
  public setOUnitName = (api: string, found: boolean, o: string) => {
    const name = new ValueAPIFetched()
    if (found) name.addAPI(api)
    name.setValue(o)
    this.ounit_name.push(name)
  }
  public setOUnitID = (o: string) => (this.ounit_id = o)

  public addInstitutionContact = (c: EWPDataContact) => this.institution_contacts.push(c)
  public contactExistsInInstitutionContacts = (c: EWPDataContact, api: string) => {
    for (const contact of this.institution_contacts) {
      if (contact.checkSimilarContact(c)) {
        contact.addAPI(api)
        return true
      }
    }
    return false
  }

  public addOUnitContact = (c: EWPDataContact) => this.ounit_contacts.push(c)
  public contactExistsInOUnitContacts = (c: EWPDataContact, api: string) => {
    for (const contact of this.ounit_contacts) {
      if (contact.checkSimilarContact(c)) {
        contact.addAPI(api)
        return true
      }
    }
    return false
  }

  public getMobilitySignature = () =>
    this.institution_contacts.find((c: EWPDataContact) =>
      c.api_fetched.find((x) => x.includes('LA Signer'))
    )
  public getMobilityContacts = () =>
    this.ounit_contacts.find((c: EWPDataContact) =>
      c.api_fetched.find((x) => x.includes('LA Contact'))
    )
}

class ValueAPIFetched implements ValueAPIFetchedInterface {
  api_fetched: string[]
  value: string

  constructor() {
    this.api_fetched = []
    this.value = ''
  }

  public getValue = () => this.value

  public addAPI = (api: string) => this.api_fetched.push(api)
  public setValue = (v: string) => (this.value = v)
}

class EWPDataContact implements EWPDataContactInterface {
  'contact-name': string
  email: string
  'role-description': string
  api_fetched: string[]

  constructor(name: string, email: string, role: string, api: string) {
    this['contact-name'] = name
    this.email = email
    if (role != '') this['role-description'] = role
    this.api_fetched = [api]
  }

  public getName = () => this['contact-name']
  public getEmail = () => this.email
  public getRole = () => this['role-description']
  public getApis = () => this.api_fetched

  public checkSimilarContact = (c: EWPDataContact) =>
    c['contact-name'] === this['contact-name'] && c.email === this.email
  public addAPI = (api: string) => this.api_fetched.push(api)
}

class EWPDataStudent implements EWPDataStudentInterface {
  contact_person_name: ValueAPIFetched
  contact_person_email: ValueAPIFetched

  constructor() {
    this.contact_person_name = new ValueAPIFetched()
    this.contact_person_email = new ValueAPIFetched()
  }

  public getName = () => this.contact_person_name
  public getEmail = () => this.contact_person_email

  public setName = (n: string) => {
    this.contact_person_name.addAPI('Mobility LA Student')
    this.contact_person_name.setValue(n)
  }
  public setEmail = (n: string) => {
    this.contact_person_email.addAPI('Mobility LA Student')
    this.contact_person_email.setValue(n)
  }
}

export { DataCollectionDTO }
