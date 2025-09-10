interface IIAGetResponseInterface {
  'iias-get-response': IIAInterface
}

interface IIAInterface {
  iia: IIADetails | undefined
}

interface IIADetails {
  partner: PartnerInterface[]
}

interface PartnerInterface {
  'hei-id': string
  'ounit-id'?: string
  'ounit-name'?: string
  'iia-id': string
  'iia-code': string
  'signing-contact'?: SigningContactInterface
  contact?: ContactInterface[]
  'signing-date': string
}

interface SigningContactInterface {
  'contact-name': string
  'phone-number'?: PhoneNumberInterface
  email: string
  'role-description': RoleDescriptionInterface
}
interface ContactInterface {
  'contact-name': string
  'phone-number'?: PhoneNumberInterface
  'fax-number'?: PhoneNumberInterface
  email: string
  'role-description': string[]
}

interface RoleDescriptionInterface {
  _text: string // the actual role description
  _attributes?: {
    'xml:lang': string
  }
}

interface PhoneNumberInterface {
  'p:other-format'?: string
  e164?: string
}

class IIA {
  private iia: IIAGetResponseInterface

  constructor(iia: IIAGetResponseInterface) {
    this.iia = iia
  }

  public getSendingHEI = (sending_hei: string) => {
    if (this.iia['iias-get-response'].iia === undefined) {
      return new HEIIIA({
        contact: [],
        'hei-id': 'not.found',
        'iia-code': 'not.found',
        'iia-id': 'not.found',
        'ounit-id': 'not.found',
        'signing-date': 'not.found'
      })
    }
    return this.iia['iias-get-response'].iia.partner[0]['hei-id'] == sending_hei
      ? new HEIIIA(this.iia['iias-get-response'].iia.partner[0])
      : new HEIIIA(this.iia['iias-get-response'].iia.partner[1])
  }
  public getReceivingHEI = (sending_hei: string) => {
    if (this.iia['iias-get-response'].iia === undefined) {
      return new HEIIIA({
        contact: [],
        'hei-id': 'not.found',
        'iia-code': 'not.found',
        'iia-id': 'not.found',
        'ounit-id': 'not.found',
        'signing-date': 'not.found'
      })
    }
    return this.iia['iias-get-response'].iia.partner[0]['hei-id'] != sending_hei
      ? new HEIIIA(this.iia['iias-get-response'].iia.partner[0])
      : new HEIIIA(this.iia['iias-get-response'].iia.partner[1])
  }
}

class HEIIIA {
  private hei: PartnerInterface
  constructor(hei: PartnerInterface) {
    this.hei = hei
  }
  public getHEIID = () => this.hei['hei-id']
  public getContactPersonName = () => this.hei['signing-contact']?.['contact-name']
  public getContactPersonEmail = () => this.hei['signing-contact']?.['email']
  public getContactPersonRole = () => this.hei['signing-contact']?.['role-description']._text
  public getOtherContactPersonNames = () =>
    this.hei.contact?.map((x) => x['contact-name']).filter(Boolean) ?? ['no name']
  public getOtherContactPersonEmails = () =>
    this.hei.contact?.map((x) => x.email).filter(Boolean) ?? ['no email']

  public getOtherContactPersonRoles = () =>
    this.hei.contact?.map((x) => x['role-description'])[0] ?? ['no roles']

  public getOUnitID = () => this.hei['ounit-id']
  public getOUnitName = () => this.hei['ounit-name']
}

export { HEIIIA, IIA, IIAGetResponseInterface, IIAInterface }
