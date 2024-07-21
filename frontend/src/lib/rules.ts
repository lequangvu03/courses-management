import { IRegisterFormData, IStudentUpsertFormData } from './../types/types.d'
import { Rule } from 'antd/es/form'

type Keys = keyof IStudentUpsertFormData | keyof IRegisterFormData

const rules: Record<Keys, Rule[]> = {
  email: [
    {
      required: true,
      whitespace: true,
      message: 'Email is required'
    },
    {
      pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: 'Email is invalid'
    }
  ],
  password: [
    {
      required: true,
      whitespace: true,
      message: 'Password is required'
    },
    {
      max: 50,
      message: "The password's length cannot exceed 50 letters"
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/,
      message:
        'Password must be at least 6 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.'
    }
  ],
  confirm_password: [
    {
      required: true,
      whitespace: true,
      message: 'Confirm password is required'
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve()
        }
        return Promise.reject(new Error('Confirm password does not match'))
      }
    })
  ],
  avatar: [
    {
      required: true,
      whitespace: true,
      message: 'Avatar is required'
    }
  ],
  name: [
    {
      required: true,
      whitespace: true,
      message: 'Name is required'
    }
  ],
  phone: [
    {
      required: true,
      whitespace: true,
      message: 'Phone number is required'
    },
    {
      pattern: /^0[3|5|7|8|9]+[0-9]{8}$/,
      message: 'Phone number is invalid'
    }
  ],
  date_of_admission: [
    {
      required: true,
      whitespace: true,
      message: 'Date of admission is required'
    }
  ],
  enroll_number: [
    {
      required: true,
      whitespace: true,
      message: 'Enroll number is required'
    }
  ]
}

export default rules
