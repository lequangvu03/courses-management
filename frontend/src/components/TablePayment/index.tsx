import classNames from 'classnames/bind'
import { TPayment } from '../../types/payments'
import icons from '../../assets/icons'
import styles from './style.module.scss'
const cx = classNames.bind(styles)
import { Table } from 'antd'
type TablePaymentProps = {
  payments: TPayment[]
}

function TablePayment({ payments }: TablePaymentProps) {
  return (
    <div>
      {/* <div className='flex items-center justify-between border-b py-[12px]'>
        <h2 className='text-[22px] font-bold'>Payment Details</h2>
        <div className='flex items-center'>
          <button>
            <img src={icons.sort} alt='' />
          </button>
        </div>
      </div>
      <table className='w-full border-collapse border-spacing-y-[10px] border-t border-none text-left'>
        <tr className='text-xs font-semibold text-[#ACACAC]'>
          <th>
            <div className='block py-[17px]'>Name</div>
          </th>
          <th>
            <span className='block py-[17px]'>Payment Schedule</span>
          </th>
          <th>
            <span className='block py-[17px]'>Bill Number </span>
          </th>
          <th>
            <span className='block py-[17px]'>Amount Paid</span>
          </th>
          <th>
            <span className='block py-[17px]'>Balance amount</span>
          </th>
          <th>
            <span className='block py-[17px]'>Da te</span>
          </th>
          <th></th>
        </tr>
        {payments.map((payment, index) => (
          <tr
            key={payment.id}
            className={cn('mb-[10px] rounded-lg text-sm', {
              'bg-white': index % 2 === 0
            })}
          >
            <td>
              <div className='py-[15px] pl-[13px]'>{payment.name}</div>
            </td>
            <td>{payment.paymentSchedule}</td>
            <td>{payment.billNumber}</td>
            <td>{payment.amountPaid}</td>
            <td>{payment.balanceAmount}</td>
            <td>{payment.date}</td>
            <td>
              <div className='flex items-center'>
                <button>
                  <img src={icons.eye} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </table> */}
    </div>
  )
}

export default TablePayment
