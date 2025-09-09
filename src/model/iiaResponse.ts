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
  'c:contact-name': string
  'p:phone-number'?: PhoneNumberInterface
  'c:email': string
  'c:role-description': RoleDescriptionInterface
}
interface ContactInterface {
  'contact-name': string
  'phone-number'?: PhoneNumberInterface
  'fax-number'?: PhoneNumberInterface
  email: string
  'role-description'?: string[]
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
  public getContactPersonName = () => this.hei['signing-contact']?.['c:contact-name']
  public getContactPersonEmail = () => this.hei['signing-contact']?.['c:email']
  public getContactPersonRole = () => this.hei['signing-contact']?.['c:role-description']._text
  public getOtherContactPersonName() {
    console.log('contact-name')

    console.log(JSON.stringify(this.hei.contact))

    if (this.hei.contact != undefined) {
      if (this.hei.contact.length === 0) {
        return 'no name'
      } else {
        console.log(this.hei.contact[0]['contact-name'])
      }
    }
    return this.hei.contact?.[0]?.['contact-name'] ?? undefined
  }

  public getOtherContactPersonEmail = () => {
    console.log('contact-email')

    this.hei.contact?.[0]?.email ?? undefined
  }
  public getOtherContactPersonRole = () => {
    console.log('contact-role')

    const roles = this.hei.contact?.[0]?.['role-description']
    return roles?.join(', ')
  }
  public getOUnitID = () => this.hei['ounit-id']
  public getOUnitName = () => this.hei['ounit-name']
}

export { HEIIIA, IIA, IIAGetResponseInterface, IIAInterface }
