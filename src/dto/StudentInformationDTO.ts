interface StudentInformationDTO {
  contactPersonName: string
  contactPersonEmail: string
}

class StudentInformationDTOConstructor {
  public response: StudentInformationDTO

  constructor(contactPersonName: string, contactPersonEmail: string) {
    this.response = {
      contactPersonEmail,
      contactPersonName
    }
  }

  public getResponse = () => this.response

  public getContactPersonName = () => this.response.contactPersonName

  public getContactPersonEmail = () => this.response.contactPersonEmail
}

export { StudentInformationDTO, StudentInformationDTOConstructor }
