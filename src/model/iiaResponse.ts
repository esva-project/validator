interface IIAGetResponse {
  iia: IIAInterface | IIAInterface[]
}

interface IIAInterface {
  partner: PartnerInterface[]
}

interface PartnerInterface {
  'hei-id': string
  'ounit-id'?: string
  'ounit-name'?: string
  'iia-id': string
  'iia-code': string
  'signing-contact'?: SigningContactInterface
  'signing-date': string
}

interface SigningContactInterface {
  'c:contact-name': string
  'p:phone-number'?: PhoneNumberInterface
  'c:email': string
  'c:role-description': RoleDescriptionInterface
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
  private iia: IIAInterface

  constructor(iia: IIAInterface) {
    this.iia = iia
  }

  public getSendingHEI = (sending_hei: string) => {
    return this.iia.partner[0]['hei-id'] == sending_hei
      ? new HEIIIA(this.iia.partner[0])
      : new HEIIIA(this.iia.partner[1])
  }
  public getReceivingHEI = (sending_hei: string) => {
    return this.iia.partner[0]['hei-id'] != sending_hei
      ? new HEIIIA(this.iia.partner[0])
      : new HEIIIA(this.iia.partner[1])
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
  public getOUnitID = () => this.hei['ounit-id']
  public getOUnitName = () => this.hei['ounit-name']
}

export { HEIIIA, IIA, IIAGetResponse, IIAInterface }
