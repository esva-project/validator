interface MobilityInterface {
  'omobility-las-get-response': LAInterface
}

interface LAInterface {
  la?: LADetailsInterface
}

interface LADetailsInterface {
  'omobility-id': string
  'sending-hei': HEIInterface
  'receiving-hei': HEIInterface
  student: StudentInterface
  'first-version'?: FirstVersionInterface
}

interface HEIInterface {
  'hei-id': string
  'ounit-name'?: string
  'ounit-id'?: string
  'contact-person': ContactPersonInterface
  'receiving-academic-year-id': string
}

interface ContactPersonInterface {
  'given-names': string
  'family-name': string
  email: string
  'phone-number'?: PhoneNumberInterface
}

interface StudentInterface extends ContactPersonInterface {
  'birth-date': string
  citizenship: string
  gender: number
}

interface PhoneNumberInterface {
  e164: string
}

interface FirstVersionInterface {
  'student-signature': MobilitySignatureInterface
  'sending-hei-signature': MobilitySignatureInterface
  'receiving-hei-signature': MobilitySignatureInterface
}

interface MobilitySignatureInterface {
  'signer-name': string
  'signer-position': string
  'signer-email': string
  timestamp: string
  'signer-app': string
}

class Mobility {
  private mobility: MobilityInterface

  constructor(mobility: MobilityInterface) {
    this.mobility = mobility
  }

  public getOMobilityID = () => {
    if (this.mobility['omobility-las-get-response'].la) {
      return this.mobility['omobility-las-get-response'].la['omobility-id']
    }
    return ''
  }
  public getSendingHEI = () => {
    if (this.mobility['omobility-las-get-response'].la) {
      return new HEI(this.mobility['omobility-las-get-response'].la['sending-hei'])
    }
    return
  }
  public getReceivingHEI = () => {
    if (this.mobility['omobility-las-get-response'].la) {
      return new HEI(this.mobility['omobility-las-get-response'].la['receiving-hei'])
    }
    return
  }
  public getStudent = () => {
    if (this.mobility['omobility-las-get-response'].la) {
      return new Student(this.mobility['omobility-las-get-response'].la.student)
    }
    return
  }
  public getSendingSignature = () => {
    if (
      this.mobility['omobility-las-get-response'].la &&
      this.mobility['omobility-las-get-response'].la['first-version']
    ) {
      return this.mobility['omobility-las-get-response'].la['first-version'][
        'sending-hei-signature'
      ]
    }
    return ''
  }
  public getReceivingSignature = () => {
    if (
      this.mobility['omobility-las-get-response'].la &&
      this.mobility['omobility-las-get-response'].la['first-version']
    ) {
      return this.mobility['omobility-las-get-response'].la['first-version'][
        'receiving-hei-signature'
      ]
    }
    return ''
  }
}

class HEI {
  private hei: HEIInterface
  constructor(hei: HEIInterface) {
    this.hei = hei
  }
  public getHEIID = () => this.hei['hei-id']
  public getContactPersonName = () =>
    this.hei['contact-person']['given-names'] + ' ' + this.hei['contact-person']['family-name']
  public getContactPersonEmail = () => this.hei['contact-person'].email
  public getOUnitID = () => this.hei['ounit-id']
  public getOUnitName = () => this.hei['ounit-name']
}

class Student {
  private student: StudentInterface
  constructor(student: StudentInterface) {
    this.student = student
  }

  public getName = () => this.student['given-names'] + ' ' + this.student['family-name']
  public getEmail = () => this.student.email
}

export { HEI, Mobility, MobilityInterface, MobilitySignatureInterface }
