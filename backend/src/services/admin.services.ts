import { EditStudentReqBody, StudentReqBody } from '~/types/requests/auth.requests'
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

  async getStudents() {
    return await databaseService.students.find({}).toArray()
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
