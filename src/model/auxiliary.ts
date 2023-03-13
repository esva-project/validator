class StringLang {
  language: string
  value: string

  constructor(c: any) {
    this.language = c['$']['xml:lang']
    this.value = c['_']
  }
  public getStringLang = () => {
    return { language: this.language, value: this.value }
  }
  public getValue = () => this.value
  public getLang = () => this.language
}

export { StringLang }
