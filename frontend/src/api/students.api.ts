import { GetStudentListResponse, SuccessResponse } from '../types/responses'
import { IQueryParams, IStudent } from '../types/types'
import request from './axios'

const studentsApi = {
  getStudentList: (params: IQueryParams) => {
    return request.get<GetStudentListResponse>('students', {
      params: {
        ...params,
        page: (params.page && +params.page) || 1,
        limit: (params.limit && +params.limit) || 10
      }
    })
  },
  getStudentById: (id: string) => {
    return request.get<SuccessResponse<IStudent>>(`student/${id}`)
  },
  editStudent: ({ id, body }: { id: string; body: FormData }) => {
    console.log('Edit student: ', id)
    return request.patch<SuccessResponse<object>>(`student/edit/${id}`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  addStudent: (body: FormData) => {
    return request.post<SuccessResponse<object>>('students/add', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteStudent: (id: string) => {
    return request.delete(`student/${id}`)
  }
}
export default studentsApi
