import { GetStudentListResponse, SuccessResponse } from '../types/responses'
import { IQueryParams, IStudent, IStudentUpsertFormData } from '../types/types'
import request from './axios'

const studentsApi = {
  getStudentList: ({ page, limit }: IQueryParams) => {
    return request.get<GetStudentListResponse>('students', {
      params: {
        page: page || 1,
        limit: limit || 10
      }
    })
  },
  getStudentById: (id: string) => {
    return request.get<SuccessResponse<IStudent>>(`student/${id}`)
  },
  editStudent: ({ id, body }: { id: string; body: Partial<IStudentUpsertFormData> }) => {
    return request.patch<SuccessResponse<object>>(`student/edit/${id}`, body)
  },
  addStudent: (body: IStudentUpsertFormData) => {
    return request.post<SuccessResponse<object>>('students/add', body)
  },
  deleteStudent: (id: string) => {
    return request.delete(`student/${id}`)
  }
}
export default studentsApi
