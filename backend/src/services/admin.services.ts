import { EditStudentReqBody, StudentQueryParamsReqQuery, StudentReqBody } from '~/types/requests/requests'
import databaseService from './database.services'
import Student from '~/models/schemas/student.model'
import { ObjectId } from 'mongodb'

class AdminService {
  async addStudent(body: StudentReqBody) {
    await databaseService.students.insertOne(
      new Student({
        ...body
      })
    )
  }

  async getStudents(params: StudentQueryParamsReqQuery) {
    const { limit = 10, page = 1, search, sort_by = 'created_at', sort_order } = params
    const query = search
      ? {
          $or: [
            { name: { $regex: new RegExp(search, 'i') } },
            { phone: { $regex: new RegExp(search, 'i') } },
            { email: { $regex: new RegExp(search, 'i') } },
            { enroll_number: { $regex: new RegExp(search, 'i') } }
          ]
        }
      : {}
    const students = await databaseService.students
      .find(query)
      .sort({ [sort_by]: sort_order === 'ascend' ? 1 : -1 })
      .skip(+limit * (+page - 1))
      .limit(+limit)
      .toArray()

    const total = await databaseService.students.countDocuments()
    return {
      total,
      students
    }
  }

  async getStudentById(student_id: string) {
    return await databaseService.students.findOne({
      _id: new ObjectId(student_id)
    })
  }

  async updateStudent({ body, student_id }: { student_id: string; body: EditStudentReqBody }) {
    return await databaseService.students.findOneAndUpdate(
      { _id: new ObjectId(student_id) },
      {
        $set: {
          ...body,
          updated_at: Date.now()
        }
      },
      { returnDocument: 'after' }
    )
  }

  async deleteStudent(student_id: string) {
    return await databaseService.students.findOneAndDelete({
      _id: new ObjectId(student_id)
    })
  }
}

const adminService = new AdminService()

export default adminService
