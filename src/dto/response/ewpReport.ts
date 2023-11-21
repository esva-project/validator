interface EWPReportInterface {
  validValidations: number
  totalValidations: number
  sendingHeiValidations: Validation[]
  receivingHeiValidations: Validation[]
  studentValidations: Validation[]
}
interface ValidationInterface {
  label: string
  status: string
}

class EWPReport implements EWPReportInterface {
  sendingHeiValidations: Validation[]
  receivingHeiValidations: Validation[]
  studentValidations: Validation[]
  validValidations: number
  totalValidations: number

  constructor() {
    this.validValidations = 0
    this.totalValidations = 0
    this.receivingHeiValidations = []
    this.sendingHeiValidations = []
    this.studentValidations = []
  }

  public getSendingHeiValidations = () => this.sendingHeiValidations
  public getReceivingHeiValidations = () => this.receivingHeiValidations
  public getStudentValidations = () => this.studentValidations

  public addSendingHEIValidation = (
    nameAttribute: string,
    valueAttribute: string,
    location: string
  ) => {
    this.sendingHeiValidations.push(new Validation(nameAttribute, valueAttribute, location))
    this.incrementValidation()
  }
  public addReceivingHEIValidation = (
    nameAttribute: string,
    valueAttribute: string,
    location: string
  ) => {
    this.receivingHeiValidations.push(new Validation(nameAttribute, valueAttribute, location))
    this.incrementValidation()
  }
  public addStudentValidation = (
    nameAttribute: string,
    valueAttribute: string,
    location: string
  ) => {
    this.incrementValidation()
    this.studentValidations.push(new Validation(nameAttribute, valueAttribute, location))
  }

  public foundSendingHEIValidation = (nameAttribute: string, location: string) => {
    const obj = this.sendingHeiValidations.find(
      (f) =>
        f.getLabel().includes(nameAttribute) &&
        f.getLabel().includes(location) &&
        f.getStatus() != 'FOUND'
    )
    if (obj) {
      obj.setStatus('FOUND')
      this.incrementValidValidation()
    }
  }
  public foundReceivingHEIValidation = (nameAttribute: string, location: string) => {
    const obj = this.receivingHeiValidations.find(
      (f) =>
        f.getLabel().includes(nameAttribute) &&
        f.getLabel().includes(location) &&
        f.getStatus() != 'FOUND'
    )
    if (obj) {
      obj.setStatus('FOUND')
      this.incrementValidValidation()
    }
  }
  public foundStudentValidation = (nameAttribute: string, location: string) => {
    const obj = this.studentValidations.find(
      (f) =>
        f.getLabel().includes(nameAttribute) &&
        f.getLabel().includes(location) &&
        f.getStatus() != 'FOUND'
    )
    if (obj) {
      obj.setStatus('FOUND')
      this.incrementValidValidation()
    }
  }

  public getResponse = () => {
    return {
      receivingHeiValidations: this.receivingHeiValidations,
      sendingHeiValidations: this.sendingHeiValidations,
      studentValidations: this.studentValidations
    }
  }

  public incrementValidValidation = () => this.validValidations++
  public incrementValidation = () => this.totalValidations++

  public getTotalValidations = () => this.totalValidations
  public getValidValidations = () => this.validValidations
}

class Validation implements ValidationInterface {
  label: string
  status: string

  constructor(nameAttribute: string, valueAttribute: string, location: string) {
    this.label =
      valueAttribute == '' && location == ''
        ? nameAttribute
        : `Is the ${nameAttribute} (${valueAttribute}) present in (${location})`
    this.status = 'NOT FOUND'
  }

  public getLabel = () => this.label
  public getStatus = () => this.status

  public setStatus = (s: string) => (this.status = s)
}

export { EWPReport }
