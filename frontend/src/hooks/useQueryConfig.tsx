import useQueryParams from './useQueryParams'
import { isEmpty, isUndefined, omitBy } from 'lodash'
import { IQueryParams } from '../types/types'
import useDebounce from './useDebounce'

function useQueryConfig(): IQueryParams {
  const { search, ...rest } = useQueryParams()
  const debouncedValue = useDebounce(search)

  return omitBy(
    {
      ...rest,
      search: debouncedValue
    },
    (value) => isUndefined(value) || isEmpty(value)
  )
}

export default useQueryConfig
