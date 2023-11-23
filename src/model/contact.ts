import { StringLang } from './auxiliary'

interface ContactInterface {
  'contact-name': string | StringLang
  'person-given-names': string
  'person-family-name': string
  email: string
  'role-description': StringLang | undefined
}

class Contact {
  private contact: ContactInterface
  constructor(contact: ContactInterface) {
    this.contact = contact
  }

  public getContactPersonName = () => {
    console.log('another log')
    console.log(this.contact['contact-name'])
    console.log(typeof this.contact['contact-name'])
    console.log(typeof this.contact['contact-name'] == 'object')
    console.log(this.contact['contact-name'] instanceof StringLang)
    if (this.contact['contact-name']) {
      return this.contact['contact-name'] instanceof StringLang
        ? this.contact['contact-name'].getValue()
        : this.contact['contact-name']
    } else {
      return this.contact['person-given-names'] + ' ' + this.contact['person-family-name']
    }
  }
  public getContactPersonGivenName = () => this.contact['person-given-names']
  public getContactPersonFamilyName = () => this.contact['person-family-name']

  public getContactPersonEmail = () => this.contact.email
  public getContactPersonRoleDescription = () => this.contact['role-description']
}

export { Contact, ContactInterface }
