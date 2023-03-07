// 事件集合 type[input] => 事件触发类型 
const EVENR_MAP = {
  text: 'input',
  password: 'input',
  number: 'input',
  radio: 'click',
  checkbox: 'click',
  'select-one': 'change',
  textarea: 'input',
  submit: 'click'
}

export default class FormCheck {
  constructor(el, elClass, formData, validators, pass, noPass, handSubmit) {
    this.oFormElements = document.querySelector(el).querySelectorAll(elClass)
    // 在赋值的时候需要进行验证
    this.formData = this.proxyFormData(formData)
    this.validators = validators,
      this.pass = pass
    this.noPass = noPass
    this.handSubmit = handSubmit
    // 验证状态
    /**
     * result {
     *  realname: false
     * }
     */
    this.result = {}
    this.init()
  }
  init() {
    this.addResult(this.formData)
    this.bindEvent()
  }
  bindEvent() {
    // 绑定事件函数，根据EVENR_MAP与el的事件类型绑定事件
    this.oFormElements.forEach(el => {
      // 绑定函数拿到对应的值
      el.addEventListener(EVENR_MAP[el.type], this.setValue.bind(this, el), false)
    })
  }
  setValue(el) {
    const { type, name, value } = el
    switch (type) {
      // 根据事件类型判断对应操作
      case 'submit':
        this.handSubmitCkeck()
        break
      case 'checkbox':
        // 有hobby就删除，没有就添加
        if (this.formData[name].includes(value)) {

          this.formData[name] = this.formData[name].filter(hobby => hobby !== value)
        } else {

          this.formData[name] = [...this.formData[name], value]
        }
        break
      default:
        // text就直接赋值
        this.formData[name] = value
        break
    }
    // console.log(this.formData[name])
  }
  proxyFormData(data) {
    return new Proxy(data, {
      get(obj, key) {
        return Reflect.get(obj, key)
      },
      set: (obj, key, value) => {
        // 验证
        // console.log(obj, key, value)
        this.validate(key, value)
        return Reflect.set(obj, key, value)
      }
    })
  }
  validate(key, value) {
    // 验证
    const keyValidate = this.validators[key]
    if (keyValidate) {
      const { reg, msg } = keyValidate(value)
      if (reg) {
        this.setResult(key, true)
        this.pass(key, value)
      } else {
        this.setResult(key, false)
        this.noPass(key, value, msg)
        return
      }
    }
  }
  addResult(formData) {
    for (let k in formData) {
      if (this.validators[k]) {
        this.result[k] = false
      }
    }
  }
  setResult(k, boolean) {
    this.result[k] = boolean
  }
  handSubmitCkeck() {
    const flaseIndex = Object.values(this.result).findIndex(item => !item)
    if (flaseIndex !== -1) {
      const falseKey = Object.keys(this.result)[flaseIndex]
      const falseValue = this.formData[falseKey]
      const { msg } = this.validators[falseKey](falseValue)
      this.noPass(falseKey, falseValue, msg)
    } else {
      this.handSubmit(JSON.parse(JSON.stringify(this.formData)))
    }
  }
  static create(el, elClass, options) {
    const { formData, validators, pass, noPass, handSubmit } = options
    new FormCheck(el, elClass, formData, validators, pass, noPass, handSubmit)
  }
}