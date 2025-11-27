'use client';

import { Typography } from '@mui/material';

import MuiTable from '@/components/UI/MuiTable';

import { PaymentRoot, StatusBadge, ViewButton, PageTitle } from './styled';

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
  createData('$15', '09/09/2025', '20 Coin', 'Hk59G5f7Tp', 'success'),
  createData('$5', '10/09/2025', '20 Coin', 'U3loOePkLg', 'pending'),
  createData('$10', '11/09/2025', '20 Coin', 'Vb87Jq7Nm', 'failed'),
  createData('$20', '12/09/2025', '50 Coin', 'Xa23Md9Klp', 'success'),
  createData('$15', '13/09/2025', '20 Coin', 'Qw45Rt8Yui', 'success'),
  createData('$8', '14/09/2025', '10 Coin', 'Zx67Cv3Bnm', 'pending'),
  createData('$25', '15/09/2025', '100 Coin', 'As89Df5Ghj', 'failed'),
  createData('$15', '16/09/2025', '20 Coin', 'Pl01Mn6Klo', 'success'),
  createData('$30', '17/09/2025', '100 Coin', 'Ty12Ui9Xvb', 'success'),
  createData('$12', '18/09/2025', '20 Coin', 'Fg34Hj7Klm', 'pending'),
  createData('$18', '19/09/2025', '50 Coin', 'Zq56Ws8Edr', 'success'),
  createData('$22', '20/09/2025', '50 Coin', 'Po78Iu6Ytr', 'failed'),
];

const PaymentPage = () => {
  const handleViewClick = (paymentCode: string) => {
    console.log('View payment:', paymentCode);
  };

  const columns = [
    {
      id: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: string) => <Typography fontWeight={600}>{value}</Typography>,
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
      render: (value: string) => (
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: 'text.secondary',
          }}
        >
          {value}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      render: (value: 'success' | 'pending' | 'failed') => <StatusBadge status={value}>{value}</StatusBadge>,
    },
    {
      id: 'action',
      label: 'Action',
      align: 'center' as const,
      sortable: false,
      render: (_: any, row: PaymentData) => (
        <ViewButton onClick={() => handleViewClick(row.paymentCode)}>View</ViewButton>
      ),
    },
  ];

  return (
    <PaymentRoot>
      <PageTitle>
        <Typography component='h1'>Payment History</Typography>
        <Typography component='p'>View and manage your payment transactions</Typography>
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
