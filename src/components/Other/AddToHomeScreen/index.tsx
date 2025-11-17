'use client';
import { Stack, Typography } from '@mui/material';

import AddBoxIcon from '@/assets/images/design/add-box.svg';
import ShareIcon from '@/assets/images/design/ios-share.svg';
import logo from '@/assets/images/nextjs.png';
import { AppImage } from '@/components/AppImage';
import { DialogContainer, RowContainer, StackContainer, StackContent } from '@/components/Other/AddToHomeScreen/styled';
import MuiButton from '@/components/UI/MuiButton';
import { useInstallApp } from '@/store/common';

const AddToHomeScreen = () => {
  const { open, setOpen } = useInstallApp();

  return (
    <DialogContainer onClose={() => setOpen(false)} open={open} maxWidth='xs'>
      <StackContainer>
        <StackContent>
          <AppImage src={logo} alt='' width={96} height={96} />

          <RowContainer>
            <Typography color='text.primary' variant='subtitle2'>
              وب اپلیکیشن{' '}
              را به صفحه اصلی موبایل خود اضافه کنید.
            </Typography>
          </RowContainer>

          <RowContainer>
            <ShareIcon />
            <Typography color='text.primary' variant='subtitle2' mt={0.5}>
              1. در نوار پایین روی دکمه{' '}
              <Typography component='span' fontWeight='bold' variant='subtitle2' color='text.primary' mx={0.5}>
                Share
              </Typography>{' '}
              بزنید.
            </Typography>
          </RowContainer>

          <RowContainer>
            <AddBoxIcon />
            <Typography color='text.primary' variant='subtitle2' mt={0.5}>
              2. در منوی باز شده، در قسمت پایین، گزینه{' '}
              <Typography component='span' fontWeight='bold' color='text.primary' variant='subtitle2' mx={0.5}>
                Add to Home Screen
              </Typography>{' '}
              را انتخاب کنید.
            </Typography>
          </RowContainer>

          <RowContainer>
            <Typography color='primary.main' variant='subtitle1'>
              Add
            </Typography>

            <Typography color='text.primary' variant='subtitle2' mt={0.5}>
              3. در مرحله بعد در قسمت بالا روی{' '}
              <Typography component='span' color='text.primary' fontWeight='bold' variant='subtitle2' mx={0.5}>
                Add
              </Typography>{' '}
              بزنید.
            </Typography>
          </RowContainer>
        </StackContent>

        <Stack width='100%' pt={1} px={2} mt={1}>
          <MuiButton fullWidth onClick={() => setOpen(false)}>
            متوجه شدم
          </MuiButton>
        </Stack>
      </StackContainer>
    </DialogContainer>
  );
};

export default AddToHomeScreen;
