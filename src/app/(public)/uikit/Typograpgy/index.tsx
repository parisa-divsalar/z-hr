import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';

const AllTypography = () => {
  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2, mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }} colSpan={3} align='center'>
                Typography - Regular
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant='overline' color='text.secondary' fontWeight='400'>
                  Overline-Regular
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='overline' color='text.primary' fontWeight='400'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='caption' color='text.secondary' fontWeight='400'>
                  Caption-Regular
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='caption' color='text.primary' fontWeight='400'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='body2' color='text.secondary' fontWeight='400'>
                  Body2-Regular
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body2' color='text.primary' fontWeight='400'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='body1' color='text.secondary' fontWeight='400'>
                  Body1-Regular
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body1' color='text.primary' fontWeight='400'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h6' color='text.secondary' fontWeight='400'>
                  H6-Regular
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h6' color='text.primary' fontWeight='400'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h5' color='text.secondary' fontWeight='400'>
                  H5-Regular
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h5' color='text.primary' fontWeight='400'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h4' color='text.secondary' fontWeight='400'>
                  H4-Regular
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h4' color='text.primary' fontWeight='400'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h3' color='text.secondary' fontWeight='400'>
                  H3-Regular
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h3' color='text.primary' fontWeight='400'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h2' color='text.secondary' fontWeight='400'>
                  H2-Regular
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h2' color='text.primary' fontWeight='400'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h1' color='text.secondary' fontWeight='400'>
                  H1-Regular
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h1' color='text.primary' fontWeight='400'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} sx={{ mt: 2, mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }} colSpan={3} align='center'>
                Typography - Medium
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant='overline' color='text.secondary' fontWeight='500'>
                  Overline-Medium
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='overline' color='text.primary' fontWeight='500'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='caption' color='text.secondary' fontWeight='500'>
                  Caption-Medium
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='caption' color='text.primary' fontWeight='500'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='body2' color='text.secondary' fontWeight='500'>
                  Body2-Medium
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body2' color='text.primary' fontWeight='500'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='body1' color='text.secondary' fontWeight='500'>
                  Body1-Medium
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body1' color='text.primary' fontWeight='500'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h6' color='text.secondary' fontWeight='500'>
                  H6-Medium
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h6' color='text.primary' fontWeight='500'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h5' color='text.secondary' fontWeight='500'>
                  H5-Medium
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h5' color='text.primary' fontWeight='500'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h4' color='text.secondary' fontWeight='500'>
                  H4-Medium
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h4' color='text.primary' fontWeight='500'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h3' color='text.secondary' fontWeight='500'>
                  H3-Medium
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h3' color='text.primary' fontWeight='500'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h2' color='text.secondary' fontWeight='500'>
                  H2-Medium
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h2' color='text.primary' fontWeight='500'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h1' color='text.secondary' fontWeight='500'>
                  H1-Medium
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h1' color='text.primary' fontWeight='500'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }} colSpan={3} align='center'>
                Typography - Bold
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant='overline' color='text.secondary' fontWeight='700'>
                  Overline-Bold
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='overline' color='text.primary' fontWeight='700'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='caption' color='text.secondary' fontWeight='700'>
                  Caption-Bold
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='caption' color='text.primary' fontWeight='700'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='body2' color='text.secondary' fontWeight='700'>
                  Body2-Bold
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body2' color='text.primary' fontWeight='700'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='body1' color='text.secondary' fontWeight='700'>
                  Body1-Bold
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body1' color='text.primary' fontWeight='700'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h6' color='text.secondary' fontWeight='700'>
                  H6-Bold
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h6' color='text.primary' fontWeight='700'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h5' color='text.secondary' fontWeight='700'>
                  H5-Bold
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h5' color='text.primary' fontWeight='700'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h4' color='text.secondary' fontWeight='700'>
                  H4-Bold
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h4' color='text.primary' fontWeight='700'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h3' color='text.secondary' fontWeight='700'>
                  H3-Bold
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h3' color='text.primary' fontWeight='700'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h2' color='text.secondary' fontWeight='700'>
                  H2-Bold
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h2' color='text.primary' fontWeight='700'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant='h1' color='text.secondary' fontWeight='700'>
                  H1-Bold
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h1' color='text.primary' fontWeight='700'>
                  Almost before we knew it, we had left the ground.
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AllTypography;
