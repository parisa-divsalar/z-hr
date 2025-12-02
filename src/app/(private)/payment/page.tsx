'use client';

import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import MuiBadge from '@/components/UI/MuiBadge';
import MuiButton from '@/components/UI/MuiButton';
import MuiTable from '@/components/UI/MuiTable';

import { PaymentRoot, PageTitle } from './styled';

interface PaymentData {
  amount: string;
  date: string;
  plan: string;
  paymentCode: string;
  status: 'success' | 'pending' | 'failed';
}

function createData(
  amount: string,
  date: string,
  plan: string,
  paymentCode: string,
  status: 'success' | 'pending' | 'failed',
): PaymentData {
  return { amount, date, plan, paymentCode, status };
}

const paymentData = [
  createData('$188895', '09/09/2025', '20 Coin', 'Hk59G5f7Tp', 'success'),
  createData('$98980985', '10/09/2025', '20 Coin', 'U3loOePkLg', 'pending'),
  createData('$798798710', '11/09/2025', '20 Coin', 'Vb87Jq7Nm', 'failed'),
  createData('$29088980', '12/09/2025', '50 Coin', 'Xa23Md9Klp', 'success'),
  createData('$798798710', '13/09/2025', '20 Coin', 'Qw45Rt8Yui', 'success'),
  createData('$8$7987710', '14/09/2025', '10 Coin', 'Zx67Cv3Bnm', 'pending'),
  createData('$279897105', '15/09/2025', '100 Coin', 'As89Df5Ghj', 'failed'),
  createData('$15$7998710', '16/09/2025', '20 Coin', 'Pl01Mn6Klo', 'success'),
  createData('$$798798710', '17/09/2025', '100 Coin', 'Ty12Ui9Xvb', 'success'),
  createData('$$798798710', '18/09/2025', '20 Coin', 'Fg34Hj7Klm', 'pending'),
  createData('$$798798718', '19/09/2025', '50 Coin', 'Zq56Ws8Edr', 'success'),
  createData('$$798798710', '20/09/2025', '50 Coin', 'Po78Iu6Ytr', 'failed'),
];

const PaymentPage = () => {
  const theme = useTheme();

  const handleViewClick = (paymentCode: string) => {
    console.log('View payment:', paymentCode);
  };

  const columns = [
    {
      id: 'amount',
      label: 'Amount',
      sortable: true,
    },
    {
      id: 'date',
      label: 'Date',
      sortable: true,
    },
    {
      id: 'plan',
      label: 'Plan',
      sortable: true,
    },
    {
      id: 'paymentCode',
      label: 'Payment Code',
      sortable: false,
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      render: (value: 'success' | 'pending' | 'failed') => {
        const paletteKey =
          value === 'success' ? 'success' : value === 'pending' ? 'warning' : 'error';
        const paletteColor = theme.palette[paletteKey];

        return (
          <MuiBadge
            label={value}
            color={value}
            border={`1px solid ${paletteColor.main}`}
            backgroundColor={paletteColor.light || paletteColor.main}
            textColor={paletteColor.main}
          />
        );
      },
    },
    {
      id: 'action',
      label: 'Action',
      align: 'center' as const,
      sortable: false,
      render: (_: any, row: PaymentData) => (
        <MuiButton color='secondary' variant='outlined' size='small' onClick={() => handleViewClick(row.paymentCode)}>
          View
        </MuiButton>
      ),
    },
  ];

  return (
    <PaymentRoot>
      <PageTitle>
        <Typography component='h5' fontWeight='500' color='text.primary'>
          Payment
        </Typography>
      </PageTitle>

      <MuiTable
        columns={columns}
        data={paymentData}
        pagination={true}
        defaultRowsPerPage={5}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </PaymentRoot>
  );
};

export default PaymentPage;
