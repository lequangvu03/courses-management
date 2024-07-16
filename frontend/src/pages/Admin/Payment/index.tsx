import TablePayment from '../../../components/TablePayment'
import payments from '../../../constants/payments'

function Payment() {
  return (
    <div className='min-h-screen bg-[#F8F8F8] px-[30px]'>
      <TablePayment payments={payments} />
    </div>
  )
}

export default Payment
