import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { File } from 'formidable'
import { isEmpty, isUndefined, omitBy } from 'lodash'
import HTTP_RESPONSE_STATUS_CODES from '~/constants/http-status-codes'
import { ServerError } from '~/models/Errors'
import { ResponseObject } from '~/models/ResponseObject'
import Student from '~/models/schemas/student.model'
import adminService from '~/services/admin.services'
import { StudentReqBody, EditStudentReqBody, StudentQueryParamsReqQuery } from '~/types/requests/requests'

export const addStudentController = async (req: Request<ParamsDictionary, any, StudentReqBody>, res: Response) => {
  const url = await adminService.uploadImage(req.files as File[])

  await adminService.addStudent({
    ...req.body,
    avatar: url,
    date_of_admission: +req.body.date_of_admission
  })

  res.json(
    new ResponseObject({
      message: 'Add student successfully',
      data: {}
    })
  )
}

export const getStudentsController = async (req: Request, res: Response) => {
  const { limit = 10, page = 1 } = req.query as StudentQueryParamsReqQuery

  const result = await adminService.getStudents(req.query)

  res.json(
    new ResponseObject({
      message: 'Get list of students successfully',
      data: {
        students: result.students,
        limit: +limit,
        page: +page,
        total_pages: Math.ceil(result.total / +limit)
      }
    })
  )
}

export const getStudentByIdController = async (req: Request, res: Response) => {
  const student = req.student as Student

  res.json(
    new ResponseObject({
      message: 'Get student successfully',
      data: student
    })
  )
}
export const editStudentController = async (req: Request<ParamsDictionary, any, EditStudentReqBody>, res: Response) => {
  const { id } = req.params
  const url = await adminService.uploadImage(req.files)

  const student = await adminService.updateStudent({
    student_id: id as string,
    body: omitBy(
      {
        ...req.body,
        avatar: url,
        date_of_admission: req.body.date_of_admission && +req.body.date_of_admission
      },
      (value) => isEmpty(value) || isUndefined(value)
    )
  })

  if (!student) {
    throw new ServerError({
      message: 'Student does not exist',
      status: HTTP_RESPONSE_STATUS_CODES.NOT_FOUND
    })
  }

  res.json(
    new ResponseObject({
      message: 'Update student successfully',
      data: {}
    })
  )
}

export const deleteStudentController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const student = await adminService.deleteStudent(id)

  if (!student) {
    return next(
      new ServerError({
        message: 'Student does not exist',
        status: HTTP_RESPONSE_STATUS_CODES.NOT_FOUND
      })
    )
  }

  res.json(
    new ResponseObject({
      message: 'Delete student successfully',
      data: {}
    })
  )
}
