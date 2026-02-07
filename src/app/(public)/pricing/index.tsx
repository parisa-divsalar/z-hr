'use client';

import { useMemo, useState } from 'react';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Divider, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';

import PricingComparison from '@/app/main/Pricing/PricingComparison';
import MuiButton from '@/components/UI/MuiButton';

type PlanLineItem = {
    id: string;
    label: string;
    qty: number;
    unitPriceAed: number;
};

const OUTER_BORDER = '#EAEAEA';

const ITEM_PRICES_AED: Record<string, number> = {
    'Job Description Match': 20,
    'Wizard Edit': 12,
    'Cover Letter': 15,
};

function CustomPlanSection() {
    const [coinOrItem, setCoinOrItem] = useState('');
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [qty, setQty] = useState<string>('');

    const [items, setItems] = useState<PlanLineItem[]>([
        { id: 'job-description-match', label: 'Job Description Match', qty: 2, unitPriceAed: 20 },
        { id: 'wizard-edit', label: 'Wizard Edit', qty: 5, unitPriceAed: 12 },
    ]);

    const totalAed = useMemo(() => items.reduce((sum, it) => sum + it.qty * it.unitPriceAed, 0), [items]);

    const canAdd = useMemo(() => {
        const label = (selectedItem || coinOrItem).trim();
        const n = Number(qty);
        return Boolean(label) && Number.isFinite(n) && n > 0;
    }, [coinOrItem, qty, selectedItem]);

    const handleDelete = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));

    const handleAdd = () => {
        const label = (selectedItem || coinOrItem).trim();
        const n = Number(qty);
        if (!label || !Number.isFinite(n) || n <= 0) return;

        const unitPriceAed = ITEM_PRICES_AED[label] ?? 0;
        const newId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

        setItems((prev) => {
            const existingIdx = prev.findIndex((x) => x.label === label);
            if (existingIdx === -1) return [...prev, { id: newId, label, qty: n, unitPriceAed }];

            const next = [...prev];
            const existing = next[existingIdx];
            next[existingIdx] = { ...existing, qty: existing.qty + n };
            return next;
        });

        setCoinOrItem('');
        setSelectedItem('');
        setQty('');
    };

    return (
        <Box sx={{ width: '100%', mt: { xs: 4, md: 6 }, px: { xs: 2, md: 0 } }}>
            <Box sx={{ width: '100%', maxWidth: 920, mx: 'auto' }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2, textAlign: 'center' }}>
                    Do you want to create your own plan?
                </Typography>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    gap={2}
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    sx={{ width: '100%' }}
                >
                    <TextField
                        size='large'
                        placeholder='Coin or item'
                        value={coinOrItem}
                        onChange={(e) => setCoinOrItem(e.target.value)}
                        sx={{ flex: 1 }}
                    />

                    <TextField
                        size='large'
                        select
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(String(e.target.value))}
                        sx={{ flex: 1 }}
                        SelectProps={{
                            displayEmpty: true,
                            renderValue: (value) => (value ? String(value) : 'Choose an item...'),
                        }}
                    >
                        <MenuItem value='' disabled>
                            Choose an item...
                        </MenuItem>
                        <MenuItem value='Job Description Match'>Job Description Match</MenuItem>
                        <MenuItem value='Wizard Edit'>Wizard Edit</MenuItem>
                        <MenuItem value='Cover Letter'>Cover Letter</MenuItem>
                    </TextField>

                    <TextField
                        size='large'
                        placeholder='Number'
                        value={qty}
                        onChange={(e) => {
                            const next = e.target.value;
                            if (next === '' || /^\d+$/.test(next)) setQty(next);
                        }}
                        inputMode='numeric'
                        sx={{ width: { xs: '100%', md: 180 } }}
                    />

                    <IconButton
                        aria-label='add item'
                        disabled={!canAdd}
                        sx={{
                            border: `1px solid ${OUTER_BORDER}`,
                            borderRadius: 2,
                            width: 52,
                            height: 52,
                            flex: '0 0 auto',
                            bgcolor: '#fff',
                            '&:hover': { bgcolor: 'grey.50' },
                            '&.Mui-disabled': { opacity: 0.5, borderColor: OUTER_BORDER },
                        }}
                        onClick={handleAdd}
                    >
                        <AddRoundedIcon />
                    </IconButton>
                </Stack>

                <Box
                    sx={{
                        mt: 2.5,
                        bgcolor: '#fff',
                        border: `1px solid ${OUTER_BORDER}`,
                        borderRadius: 3,
                        overflow: 'hidden',
                        textAlign: 'left',
                    }}
                >
                    <Box sx={{ px: { xs: 1.5, md: 2 }, py: 1 }}>
                        {items.map((it, idx) => (
                            <Box key={it.id}>
                                <Stack
                                    direction='row'
                                    alignItems='center'
                                    gap={1.5}
                                    sx={{ py: 1.25, px: 0.5 }}
                                >
                                    <Typography variant='body2' color='text.primary' fontWeight={492} sx={{ flex: 1, minWidth: 0 }}>
                                        {it.label}
                                    </Typography>

                                    <Box sx={{ width: 56, flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
                                        <Typography variant='body2' color='text.primary' fontWeight={600} sx={{ textAlign: 'center' }}>
                                            {it.qty}
                                        </Typography>
                                    </Box>

                                    <Stack direction='row' gap={1} sx={{ flex: '0 0 auto' }}>
                                        <IconButton
                                            aria-label='edit'
                                            size='small'
                                            sx={{
                                                border: `1px solid ${OUTER_BORDER}`,
                                                borderRadius: 2,
                                                width: 34,
                                                height: 34,
                                            }}
                                            onClick={() => {
                                                // UI-only section for now
                                            }}
                                        >
                                            <EditOutlinedIcon fontSize='small' />
                                        </IconButton>
                                        <IconButton
                                            aria-label='delete'
                                            size='small'
                                            sx={{
                                                border: `1px solid ${OUTER_BORDER}`,
                                                borderRadius: 2,
                                                width: 34,
                                                height: 34,
                                            }}
                                            onClick={() => handleDelete(it.id)}
                                        >
                                            <DeleteOutlineRoundedIcon fontSize='small' />
                                        </IconButton>
                                    </Stack>
                                </Stack>
                                {idx !== items.length - 1 ? <Divider /> : null}
                            </Box>
                        ))}
                    </Box>

                    <Divider />

                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems={{ xs: 'stretch', md: 'center' }}
                        justifyContent='space-between'
                        gap={2}
                        sx={{ px: { xs: 2, md: 2 }, py: 2 }}
                    >
                        <Typography variant='body2' color='text.primary' fontWeight={600} sx={{ flex: { xs: '0 0 auto', md: '0 0 auto' } }}>
                            Total price
                        </Typography>

                        <Stack
                            direction='column'
                            alignItems='center'
                            justifyContent='center'
                            sx={{ flex: 1, textAlign: 'center' }}
                        >
                            <Typography variant='h5' fontWeight={700} color='info.main' sx={{ whiteSpace: 'nowrap' }}>
                                {totalAed} AED
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                                With 9% Tax
                            </Typography>
                        </Stack>

                        <MuiButton color='secondary' variant='contained' sx={{ px: 3, borderRadius: 2, width: { xs: '100%', md: 'auto' } }}>
                            Upgrade Now
                        </MuiButton>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

const Pricing = () => {
    return (
        <Stack
            sx={(theme) => ({
                pt: { xs: 4, md: 6 },
                backgroundColor: theme.palette.secondary.contrastText,
            })}
            justifyContent='center'
            alignItems='center'
            width='100%'
            textAlign='center'
            gap={2}
            mt={5}
        >
            <Typography variant='h2' color='secondary.main' fontWeight={'700'}>
                Our Plans
            </Typography>

            <Typography variant='body1' color='secondary.main' fontWeight={'492'} textAlign={'center'}>
                Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
            </Typography>
            <Typography variant='body1' color='secondary.main' fontWeight={'492'} textAlign={'center'}>
                Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                intelligence.
            </Typography>

            <PricingComparison />

            <CustomPlanSection />
        </Stack>
    );
};

export default Pricing;
