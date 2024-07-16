import { createHash } from 'crypto'
import env from '~/constants/env-variables'

const sha256 = (content: string) => createHash('sha256').update(content).digest('hex')

export const hashPassword = (password: string) => {
  return sha256(password + env.passwordSecret)
}
