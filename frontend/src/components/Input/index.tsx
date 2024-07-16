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
}

function Input({ placeholder, name, label, initialValue, rules, className, dependencies }: InputProps) {
  return (
    <Form.Item initialValue={initialValue || ''} name={name} label={label} rules={rules} dependencies={dependencies}>
      <AntInput className={cx('field__input', className)} placeholder={placeholder} />
    </Form.Item>
  )
}

export default Input
