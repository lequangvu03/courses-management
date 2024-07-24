import { Button, Flex, Form } from 'antd'
import classNames from 'classnames/bind'
import { omit } from 'lodash'
import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Input from '../../../components/Input'
import { privateAdminRoutes } from '../../../config/admin.routes'
import {
  useAddStudentMutation,
  useEditStudentMutation,
  useGetStudentByIdQuery
} from '../../../hooks/data/students.data'
import { handlerError } from '../../../lib/handlers'
import rules from '../../../lib/rules'
import { IStudentUpsertFormData } from '../../../types/types'
import styles from './style.module.scss'

const cx = classNames.bind(styles)

function StudentUpsert() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isAddMode = location.pathname.includes('students/add')
  const [form] = Form.useForm<IStudentUpsertFormData>()
  const addStudentMutation = useAddStudentMutation()
  const editStudentMutation = useEditStudentMutation()
  const studentResponse = useGetStudentByIdQuery({
    id: id || '',
    enabled: Boolean(id)
  })

  useEffect(() => {
    if (studentResponse) {
      const student = omit(studentResponse.data?.data.data, ['_id', 'created_at', 'updated_at'])
      form.setFieldsValue({
        ...student
      })
    }
  }, [studentResponse])

  const handleSubmit = async (data: IStudentUpsertFormData) => {
    try {
      if (isAddMode) {
        await addStudentMutation.mutateAsync(data)
      } else {
        await editStudentMutation.mutateAsync({
          id: id as string,
          body: data
        })
        navigate(privateAdminRoutes.students)
      }
    } catch (error) {
      handlerError({
        error,
        form
      })
    }
  }

  return (
    <div className={cx('wrapper')}>
      <h2 className={cx('form__title')}>{isAddMode ? <span>Add student</span> : <span>Edit Student</span>}</h2>
      <Form requiredMark={false} layout='vertical' form={form} onFinish={handleSubmit}>
        <Input rules={rules.avatar} label='Avatar' name='avatar' />
        <Input rules={rules.name} label='Name' name='name' />
        <Input rules={rules.email} label='Email' name='email' />
        <Input rules={rules.phone} label='Phone' name='phone' />
        <Input rules={rules.enroll_number} label='Enroll Number' name='enroll_number' />
        <Input label='Date Of Admission' rules={rules.date_of_admission} name='date_of_admission' />
        {/* <Form.Item name='date_of_admission' label='Date Of Admission'>
          <DatePicker
            size='large'
            format={{
              format: 'yyyy-MM-dd',
              type: 'mask'
            }}
          />
        </Form.Item> */}
        <Flex justify='end'>
          <Button htmlType='submit'>{isAddMode ? <span>Add student</span> : <span>Edit Student</span>}</Button>
        </Flex>
      </Form>
    </div>
  )
}

export default StudentUpsert
