import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_RESPONSE_STATUS_CODES from '~/constants/http-status-codes'
import { ServerError } from '~/models/Errors'
import { ResponseObject } from '~/models/ResponseObject'
import Student from '~/models/schemas/student.model'
import adminService from '~/services/admin.services'
import { StudentReqBody, EditStudentReqBody } from '~/types/requests/auth.requests'

export const addStudentController = async (req: Request<ParamsDictionary, any, StudentReqBody>, res: Response) => {
  await adminService.addStudent(req.body)

  res.json(
    new ResponseObject({
      message: 'Add student successfully',
      data: {}
    })
  )
}

export const getStudentsController = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await adminService.getStudents({
    limit,
    page
  })

  res.json(
    new ResponseObject({
      message: 'Get list of students successfully',
      data: {
        students: result.students,
        limit,
        page,
        total_pages: Math.ceil(result.total / limit)
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

  const student = await adminService.updateStudent({
    student_id: id as string,
    body: req.body
  })

  console.log(student)
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
