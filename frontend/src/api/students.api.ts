import request from './axios'

const studentsApi = {
  getStudentList: ({ page, page_size }: { page: number; page_size: number }) => {
    return request.get('students', {
      params: {
        page: page || 1,
        page_size: page_size || 10
      }
    })
  }
}
export default studentsApi
