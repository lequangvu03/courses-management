import {
  deleteStudentController,
  editStudentController,
  getStudentByIdController
} from './../controllers/admin.controllers'
import { Router } from 'express'
import { addStudentController } from '~/controllers/admin.controllers'
import { getStudentsController } from '~/controllers/admin.controllers'
import {
  addStudentValidator,
  adminValidator,
  deleteStudentValidator,
  editStudentValidator,
  getStudentByIdValidator
} from '~/middlewares/admin.middlewares'
import { filterMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import { EditStudentReqBody } from '~/types/requests/auth.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const adminRouter = Router()

/**
 * path: /students
 * method: GET
 * headers: { Authorization: Bearer <access_token> }
 */

adminRouter.get('/students', adminValidator, paginationValidator, wrapRequestHandler(getStudentsController))

/**
 * path: /students/:id
 * method: GET
 * headers: { Authorization: Bearer <access_token> }
 * params: { id: string }
 */

adminRouter.get('/student/:id', adminValidator, getStudentByIdValidator, wrapRequestHandler(getStudentByIdController))

/**
 * path: /students/add
 * method: POST
 * headers: { Authorization: Bearer <access_token> }
 * body: { 
           avatar: string
           name: string
           email: string
           phone: string
           enrollNumber: string
           dateOfAdmission: string  
         }
 */

adminRouter.post('/students/add', adminValidator, addStudentValidator, wrapRequestHandler(addStudentController))

/**
 * path: /student/edit/:id
 * method: POST
 * headers: { Authorization: Bearer <access_token> }
 * body: { 
           _id: string
           avatar?: string
           name?: string
           email?: string
           phone?: string
           enrollNumber?: string
           dateOfAdmission?: string
         }
 */

adminRouter.patch(
  '/student/edit/:id',
  adminValidator,
  editStudentValidator,
  filterMiddleware<EditStudentReqBody>(['avatar', 'date_of_admission', 'enroll_number', 'name', 'email', 'phone']),
  wrapRequestHandler(editStudentController)
)

/**
 * path: /student/:id
 * method: DELETE
 * headers: { Authorization: Bearer <access_token> }
 */
adminRouter.delete('/student/:id', adminValidator, deleteStudentValidator, wrapRequestHandler(deleteStudentController))

export default adminRouter
