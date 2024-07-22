import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import studentsApi from '../../api/students.api'

export const useGetStudentListQuery = ({
  enabled = true,
  page,
  limit
}: {
  page?: number
  limit?: number
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['students', page, limit],
    queryFn: () =>
      studentsApi.getStudentList({
        page,
        limit
      }),
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
