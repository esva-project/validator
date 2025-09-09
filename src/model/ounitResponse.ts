import { StringLang } from './auxiliary'
import { Contact, ContactInterface } from './contact'

interface OUnitsInterface {
  'ounits-response': OUnitInterface
}

interface OUnitInterface {
  ounit?: OUnitDetailsInterface
}

interface OUnitDetailsInterface {
  'ounit-id': string
  'ounit-code': string
  name: StringLang[]
  contact?: ContactInterface[]
}

class OUnits {
  private ounit: OUnitsInterface

  constructor(ounit: OUnitsInterface) {
    this.ounit = ounit
    console.log('Ounit')
    console.log(JSON.stringify(this.ounit['ounits-response'].ounit))
    console.log(JSON.stringify(ounit))

    if (this.ounit['ounits-response'].ounit != undefined) {
      if (this.ounit['ounits-response'].ounit.contact == undefined) {
        this.ounit['ounits-response'].ounit.contact = []
      } else {
        if (!Array.isArray(this.ounit['ounits-response'].ounit.contact)) {
          this.ounit['ounits-response'].ounit.contact = [
            this.ounit['ounits-response'].ounit.contact
          ]
        }
      }

      if (!Array.isArray(this.ounit['ounits-response'].ounit.name)) {
        this.ounit['ounits-response'].ounit.name = [this.ounit['ounits-response'].ounit.name]
      }
      for (const c of this.ounit['ounits-response'].ounit.contact) {
        c['role-description'] = new StringLang(c['role-description'])
      }
      const nameList = []
      for (const n of this.ounit['ounits-response'].ounit.name) {
        nameList.push(new StringLang(n))
      }
      this.ounit['ounits-response'].ounit.name = nameList
    }
  }

  public getOUnitID = () => {
    if (this.ounit['ounits-response'].ounit != undefined) {
      return this.ounit['ounits-response'].ounit['ounit-id']
    }
    return ''
  }
  public getOUnitName = () => {
    if (this.ounit['ounits-response'].ounit != undefined) {
      const nameArray = this.ounit['ounits-response'].ounit.name
      return nameArray.some((e) => e.getLang() == 'en')
        ? (nameArray.find((e) => e.getLang() == 'en') as StringLang)
        : nameArray[0]
    }
    return ''
  }
  public getOUnitNames = () => {
    if (this.ounit['ounits-response'].ounit != undefined) {
      return this.ounit['ounits-response'].ounit.name
    }
    return ''
  }
  public getContacts = () => {
    const list: Contact[] = []
    if (
      this.ounit['ounits-response'].ounit != undefined &&
      this.ounit['ounits-response'].ounit.contact != undefined &&
      this.ounit['ounits-response'].ounit.contact.length > 0
    ) {
      for (const c of this.ounit['ounits-response'].ounit.contact) {
        list.push(new Contact(c))
      }
    }

    return list
  }
}

export { OUnits, OUnitsInterface }
