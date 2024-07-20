import { Button, Flex, Form } from 'antd'
import { useLocation } from 'react-router-dom'
import Input from '../../../components/Input'
import styles from './style.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

function StudentUpsert() {
  const [form] = Form.useForm()
  const location = useLocation()
  const isAddMode = location.pathname.includes('students/add')

  const handleSubmit = (data: any) => {
    console.log(data)
  }
  return (
    <div className={cx('wrapper')}>
      <h2 className={cx('form__title')}>{isAddMode ? <span>Add student</span> : <span>Edit Student</span>}</h2>
      <Form layout='vertical' form={form} onFinish={handleSubmit}>
        <Input name='_id' hidden />
        <Input label='Avatar' name='avatar' />
        <Input label='Name' name='name' />
        <Input label='Email' name='email' />
        <Input label='Phone' name='phone' />
        <Input label='Enroll Number' name='enrollNumber' />
        <Input label='Date Of Admission' name='dateOfAdmission' />
        <Flex justify='end'>
          <Button htmlType='submit'>{isAddMode ? <span>Add student</span> : <span>Edit Student</span>}</Button>
        </Flex>
      </Form>
    </div>
  )
}

export default StudentUpsert
