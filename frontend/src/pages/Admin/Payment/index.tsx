import { useTranslation } from 'react-i18next'
import TablePayment from '../../../components/TablePayment'
import payments from '../../../constants/payments'

function Payment() {
  const { t } = useTranslation()
  return (
    <div className='min-h-screen bg-[#F8F8F8] px-[30px]'>
      {t('welcome')}
      <TablePayment payments={payments} />
    </div>
  )
}

export default Payment
