import { Button, DatePicker, Flex, Form, Image, message, Typography, Upload } from 'antd'
import type { RcFile, UploadProps } from 'antd/es/upload/interface'
import classNames from 'classnames/bind'
import dayjs from 'dayjs'
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
const cx = classNames.bind(styles)

function StudentUpsert() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isAddMode = location.pathname.includes('students/add')
  const [previewAvatar, setPreviewAvatar] = useState<string>('')
  const [file, setFile] = useState<RcFile | undefined>()
  const [form] = Form.useForm<IStudentUpsertFormData>()
  const addStudentMutation = useAddStudentMutation()
  const editStudentMutation = useEditStudentMutation()
  const studentResponse = useGetStudentByIdQuery({
    id: id || '',
    enabled: Boolean(id)
  })

  useEffect(() => {
    if (studentResponse.data) {
      const student = omit(studentResponse.data?.data.data, ['_id', 'created_at', 'updated_at'])
      form.setFieldsValue({
        ...student,
        date_of_admission: dayjs(student.date_of_admission),
        avatar: {
          fileList: [
            {
              uid: '-1',
              name: 'avatar.jpg',
              status: 'done',
              url: student.avatar
            }
          ]
        }
      })
      setPreviewAvatar(student.avatar)
    }
  }, [studentResponse.data])

  useEffect(() => {
    if (!file) return

    const preview = URL.createObjectURL(file)
    setPreviewAvatar(preview)

    return () => {
      if (previewAvatar) URL.revokeObjectURL(previewAvatar)
    }
  }, [file])

  const handleSubmit = async (data: IStudentUpsertFormData) => {
    try {
      const date_of_admission = dayjs(data.date_of_admission).valueOf()
      const avatar = data.avatar.file?.originFileObj

      const formData = new FormData()
      formData.append('date_of_admission', String(date_of_admission))
      formData.append('name', data.name)
      formData.append('avatar', avatar as File)
      formData.append('email', data.email)
      formData.append('enroll_number', data.enroll_number)
      formData.append('phone', data.phone)

      if (isAddMode) {
        const res = await addStudentMutation.mutateAsync(formData)

        message.success(res.data.message)
      } else {
        const res = await editStudentMutation.mutateAsync({ id: String(id), body: formData })
        message.success(res.data.message)
      }
      navigate(privateAdminRoutes.students)
    } catch (error) {
      handlerError({
        error,
        form
      })
    }
  }

  const uploadAvatarProps: UploadProps = {
    maxCount: 1,
    showUploadList: false,
    accept: '.png,.jpg,.jpeg',
    multiple: false,
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess && onSuccess('ok')
      }, 0)
    },
    beforeUpload(file) {
      const isValidType = /\.(jpg|jpeg|png)$/i.test(file.name)
      if (!isValidType) {
        message.error('You can only upload JPG/PNG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 3
      if (!isLt2M) {
        message.error('Image must smaller than 3MB!')
      }
      return isValidType && isLt2M
    },
    onChange: ({ fileList }) => {
      setFile(fileList[0].originFileObj)
    },
    onDrop: (info) => {
      console.log(info)
    }
  }

  return (
    <div className={cx('wrapper')}>
      <h2 className={cx('form__title')}>{isAddMode ? <span>Add student</span> : <span>Edit Student</span>}</h2>
      <Form requiredMark={false} layout='vertical' form={form} onFinish={handleSubmit}>
        <Flex gap={64} vertical>
          <div className={cx('fields__group')}>
            <Input rules={rules.name} label='Name' name='name' />
            <Input rules={rules.email} disabled={!isAddMode} label='Email' name='email' />
            <Input rules={rules.phone} label='Phone' name='phone' />
            <Input rules={rules.enroll_number} label='Enroll Number' name='enroll_number' />
            <Form.Item name='date_of_admission' label='Date Of Admission'>
              <DatePicker
                size='large'
                format={{
                  format: 'YYYY-MM-dd',
                  type: 'mask'
                }}
              />
            </Form.Item>
          </div>
          <Form.Item name='avatar'>
            <Upload.Dragger {...uploadAvatarProps} className={cx('field__upload')}>
              <Flex vertical align='center'>
                <Image
                  className={cx('preview__image')}
                  src={previewAvatar}
                  fallback={images.placeholder}
                  preview={false}
                />
                <Button size='large' className={cx('button__upload')}>
                  Click or drag file to upload
                </Button>
                <Typography>You can only upload JPG/PNG/JPEG file! Image must smaller than 3MB!</Typography>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
        </Flex>
        <Flex justify='end'>
          <Button
            className={cx('button__submit')}
            htmlType='submit'
            loading={editStudentMutation.isPending || addStudentMutation.isPending}
          >
            {isAddMode ? <span>Add student</span> : <span>Edit Student</span>}
          </Button>
        </Flex>
      </Form>
    </div>
  )
}

export default StudentUpsert
