import FormCheck from "./FormCheck"

const formData = {
  realname: '',
  age: 0,
  username: '',
  password: '',
  gender: 'male',
  occupation: '',
  hobbies: [],
  intro: ''
}


// 策略
// strategy
// strat -> 展开  提升层级   // 打仗 冲锋  eg -> 领导
// 验证规则
const validators = {
  realname: (value) => {
    return {
      reg: value.length >= 2 && value.length < 10,
      msg: 'realname mus between 2-10'
    }
  },
  age: (value) => ({
    reg: !isNaN(Number(value)) && Number(value) <= 100,
    msg: 'Type: number and max 100'
  }),
  username: (value) => ({
    reg: value.length >= 6,
    msg: 'username min 6'
  }),
  password: (value) => ({
    reg: value.length >= 6,
    msg: 'password min 6'
  }),
  gender: null,
  occupation: (value) => ({
    reg: value.length > 0,
    msg: 'occupation one must be selected'
  }),
  hobbies: (value) => ({
    reg: value.length > 0,
    msg: 'hobbies one must be selected'
  }),
  intro: (value) => ({
    reg: value.length >= 10,
    msg: 'intro min 10'
  }),
}

// 需要一个FormCheck来处理
FormCheck.create('#userForm', '.user-form', {
  formData,
  validators,
  pass(key, value) {
    console.log(key, value)
  },
  noPass(key, value, error) {
    console.warn(key, value, error)
  },
  handSubmit(formData) {
    console.log(formData)
  }
})