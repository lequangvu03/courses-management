import useQueryParams from './useQueryParams'
import { isUndefined, omitBy } from 'lodash'
import { IQueryParams } from '../types/types'

function useQueryConfig(): IQueryParams {
  const { limit, page } = useQueryParams()

  return omitBy(
    {
      page: (page && Number(page)) || 1,
      limit: (limit && Number(limit)) || 10
    },
    isUndefined
  )
}

export default useQueryConfig
