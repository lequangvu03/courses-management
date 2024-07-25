import { Button, DatePicker, Flex, Form, Image, Typography, Upload } from 'antd'
import type { UploadProps } from 'antd/es/upload/interface'
import classNames from 'classnames/bind'
import { omit } from 'lodash'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import images from '../../../assets/images'
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
import dayjs from 'dayjs'
const cx = classNames.bind(styles)

function StudentUpsert() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isAddMode = location.pathname.includes('students/add')
  const [previewAvatar, setPreviewAvatar] = useState<string>('')
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
      form.setFieldsValue(student)
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
  const uploadAvatarProps: UploadProps = {
    maxCount: 1,
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess && onSuccess('ok')
      }, 0)
    },
    beforeUpload(file, fileList) {
      console.log(file, fileList)
    },
    onChange: (info) => {
      setPreviewAvatar(info.file.preview as string)
      console.log(info.file.preview)
      console.log('Drop: ', info)
    },
    onDrop: (info) => {
      console.log('Drop: ', info)
    }
  }

  return (
    <div className={cx('wrapper')}>
      <h2 className={cx('form__title')}>{isAddMode ? <span>Add student</span> : <span>Edit Student</span>}</h2>
      <Form requiredMark={false} layout='vertical' form={form} onFinish={handleSubmit}>
        <Flex gap={64} vertical>
          <div className={cx('fields__group')}>
            <Input rules={rules.avatar} label='Avatar' name='avatar' />
            <Input rules={rules.name} label='Name' name='name' />
            <Input rules={rules.email} label='Email' name='email' />
            <Input rules={rules.phone} label='Phone' name='phone' />
            <Input rules={rules.enroll_number} label='Enroll Number' name='enroll_number' />
            <Input label='Date Of Admission' rules={rules.date_of_admission} name='date_of_admission' />
            {/* <Form.Item name='date_of_admission' label='Date Of Admission'>
              <DatePicker
                value={dayjs(new Date())}
                size='large'
                format={{
                  format: 'YYYY-MM-dd',
                  type: 'mask'
                }}
              />
            </Form.Item> */}
          </div>
          {/* <Form.Item name='avatar'>
            <Upload.Dragger {...uploadAvatarProps} className={cx('field__upload')}>
              <Flex vertical align='center'>
                <Image
                  className={cx('preview__image')}
                  src={previewAvatar || images.placeholder}
                  fallback={images.placeholder}
                  preview={false}
                />
                <Button size='large' className={cx('button__upload')}>
                  Click or drag file to upload
                </Button>
                <Typography>You can only upload JPG/PNG file! Image must smaller than 2MB!</Typography>
              </Flex>
            </Upload.Dragger>
          </Form.Item> */}
        </Flex>
        <Flex justify='end'>
          <Button className={cx('button__submit')} htmlType='submit'>
            {isAddMode ? <span>Add student</span> : <span>Edit Student</span>}
          </Button>
        </Flex>
      </Form>
    </div>
  )
}

export default StudentUpsert
