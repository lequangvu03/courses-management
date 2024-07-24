import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import studentsApi from '../../api/students.api'
import { IQueryParams } from '../../types/types'

export const useGetStudentListQuery = ({ enabled = true, params }: { params: IQueryParams; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentsApi.getStudentList(params),
    enabled,
    staleTime: 5 * 1000,
    placeholderData: keepPreviousData
  })
}

export const useGetStudentByIdQuery = ({ enabled = true, id }: { id: string; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentsApi.getStudentById(id),
    enabled
  })
}

export const useAddStudentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: studentsApi.addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students']
      })
    }
  })
}

export const useEditStudentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studentsApi.editStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students']
      })
    }
  })
}

export const useDeleteStudentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studentsApi.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students']
      })
    }
  })
}
