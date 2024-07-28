import { File } from 'formidable'
import fs from 'fs'
import { ObjectId } from 'mongodb'
import sharp from 'sharp'
import Student from '~/models/schemas/student.model'
import { EditStudentReqBody, StudentQueryParamsReqQuery, StudentReqBody } from '~/types/requests/requests'
import { getFileExtenstion, UPLOAD_IMAGES_DIR } from '~/utils/file'
import databaseService from './database.services'
import envs from '~/constants/env-variables'

class AdminService {
  async addStudent(body: StudentReqBody) {
    await databaseService.students.insertOne(
      new Student({
        ...body
      })
    )
  }

  async uploadImage(files?: File[]) {
    if (files && files[0]) {
      const file = files[0]
      const { newFilename } = file
      const ext = getFileExtenstion(file.originalFilename as string)
      const filePath = `${UPLOAD_IMAGES_DIR}/${newFilename}.jpg`
      const oldFilePath = `${file.filepath}.${ext}`
      await sharp(oldFilePath).jpeg().toFile(filePath)
      fs.unlinkSync(oldFilePath)
      return `http://localhost:${envs.port}/images/${newFilename}.jpg`
    }
    return ''
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
