import { StringLang } from './auxiliary'

interface ContactInterface {
  'contact-name': string
  'person-given-names': string
  'person-family-name': string
  email: string
  'role-description': StringLang
}

class Contact {
  private contact: ContactInterface
  constructor(contact: ContactInterface) {
    this.contact = contact
  }

  public getContactPersonName = () => {
    return this.contact['contact-name']
      ? this.contact['contact-name']
      : this.contact['person-given-names'] + ' ' + this.contact['person-family-name']
  }
  public getContactPersonGivenName = () => this.contact['person-given-names']
  public getContactPersonFamilyName = () => this.contact['person-family-name']

  public getContactPersonEmail = () => this.contact.email
  public getContactPersonRoleDescription = () => this.contact['role-description']
}

export { Contact, ContactInterface }
