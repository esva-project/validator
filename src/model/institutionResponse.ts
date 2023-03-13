import { StringLang } from './auxiliary'
import { Contact, ContactInterface } from './contact'

interface InstitutionsInterface {
  'institutions-response': HEIInterface
}

interface HEIInterface {
  hei: HEIDetailsInterface
}

interface HEIDetailsInterface {
  'hei-id': string
  name: string
  contact?: ContactInterface[]
}

class Institutions {
  private institutions: InstitutionsInterface

  constructor(institutions: InstitutionsInterface) {
    this.institutions = institutions
    if (this.institutions['institutions-response'].hei.contact == undefined) {
      this.institutions['institutions-response'].hei.contact = []
    } else {
      if (!Array.isArray(this.institutions['institutions-response'].hei.contact)) {
        this.institutions['institutions-response'].hei.contact = [
          this.institutions['institutions-response'].hei.contact
        ]
      }
    }
    for (const c of this.institutions['institutions-response'].hei.contact) {
      c['role-description'] = new StringLang(c['role-description'])
    }
  }

  public getHEIID = () => this.institutions['institutions-response'].hei['hei-id']
  public getHEIName = () => this.institutions['institutions-response'].hei.name
  public getContacts = () => {
    const list: Contact[] = []
    if (
      this.institutions['institutions-response'].hei.contact != undefined &&
      this.institutions['institutions-response'].hei.contact.length > 0
    ) {
      for (const c of this.institutions['institutions-response'].hei.contact) {
        list.push(new Contact(c))
      }
    }

    return list
  }
}

export { Institutions, InstitutionsInterface }
