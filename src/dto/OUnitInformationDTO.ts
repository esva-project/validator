interface OUnitInformationInterface {
  contactPersonName: string
  contactPersonEmail: string
  roleDescription?: string
}

class OUnitInformationDTO {
  private response: OUnitInformationInterface

  constructor(contactPersonName: string, contactPersonEmail: string, role: string) {
    this.response = {
      contactPersonEmail,
      contactPersonName,
      roleDescription: role
    }
  }

  public getResponse = () => this.response

  public getContactPersonName = () => this.response.contactPersonName

  public getContactPersonEmail = () => this.response.contactPersonEmail

  public getRole = () => this.response.roleDescription
}

export { OUnitInformationDTO }
