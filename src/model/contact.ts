import { StringLang } from './auxiliary'

interface ContactInterface {
  'contact-name': string
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
    if (this.contact['contact-name']) {
      return typeof this.contact['contact-name'] == 'object'
        ? this.contact['contact-name']['_']
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
