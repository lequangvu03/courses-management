import classNames from 'classnames/bind'
import styles from './style.module.scss'
import { Form, Input as AntInput } from 'antd'
import { Rule } from 'antd/es/form'

const cx = classNames.bind(styles)

interface InputProps {
  name: string
  placeholder?: string
  label?: string
  rules?: Rule[]
  className?: string
  dependencies?: string[]
  initialValue?: string | null
  type?: 'password' | 'text'
}

function Input({ placeholder, name, label, initialValue, rules, className, dependencies, type = 'text' }: InputProps) {
  const InputComponent = type === 'password' ? AntInput.Password : AntInput
  return (
    <Form.Item initialValue={initialValue || ''} name={name} label={label} rules={rules} dependencies={dependencies}>
      <InputComponent className={cx('field__input', className)} placeholder={placeholder} />
    </Form.Item>
  )
}

export default Input
