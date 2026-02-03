import { Skeleton, Stack } from '@mui/material';

type Props = {
    lines?: number;
    maxWidth?: number;
};

export default function SkeletonParagraph({ lines = 4, maxWidth = 720 }: Props) {
    return (
        <Stack gap={1} mt={1.5}>
            {Array.from({ length: lines }).map((_, idx) => (
                <Skeleton
                    key={idx}
                    variant='text'
                    height={18}
                    width={idx === lines - 1 ? '72%' : '100%'}
                    sx={{ maxWidth }}
                />
            ))}
        </Stack>
    );
}

























