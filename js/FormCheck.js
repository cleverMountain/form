export default class FormCheck {
  constructor(el, elClass, formData, validators, pass, noPass, handSubmit) {
    this.oFormElements = document.querySelector(el).querySelectorAll(elClass)
    // 在赋值的时候需要进行验证
    this.formData = this.proxyFormData(formData)
    console.log(this.formData)
  }
  proxyFormData (data) {
    return new Proxy(data, {
      get(obj, key) {
        return Reflect.get(obj, key)
      },
      set(obj, key, value) {
        // 验证
        return Reflect.set(obj, key, value)
      }
    })
  }
  static create(el, elClass, options) {
    const { formData, validators, pass, noPass, handSubmit } = options
    new FormCheck(el, elClass, formData, validators, pass, noPass, handSubmit)
  }
}