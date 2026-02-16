'use client';

import { useCallback, useMemo, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Divider, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';

import DeleteIcon from '@/assets/images/icons/clean.svg';
import EditIcon from '@/assets/images/icons/edit.svg';
import MuiButton from '@/components/UI/MuiButton';

type CatalogItem = {
  id: string;
  label: string;
  unitPriceAedCents: number; // integer cents
};

type PlanRow = {
  id: string;
  itemId: string;
  label: string;
  qty: number;
};

const TAX_RATE = 0.09;
const BORDER = '#F0F0F2';
const TEXT_MUTED = '#9CA3AF';
const TEXT_DARK = '#111827';
const BRAND = '#4D49FC';

// NOTE: These defaults are chosen so the screenshot example (2 + 5)
// shows ~100 AED with 9% tax when rounded to 2 decimals.
const CATALOG: CatalogItem[] = [
  { id: 'job_description_match', label: 'Job Description Match', unitPriceAedCents: 837 }, // 8.37 AED
  { id: 'wizard_edit', label: 'Wizard Edit', unitPriceAedCents: 1500 }, // 15.00 AED
];

function formatAed(amountAedCents: number): string {
  const safe = Number.isFinite(amountAedCents) ? amountAedCents : 0;
  const aed = Math.round(safe) / 100;
  // keep as: "100 AED" (as in screenshot)
  const label = aed % 1 === 0 ? String(aed.toFixed(0)) : String(aed.toFixed(2));
  return `${label} AED`;
}

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

export default function CustomPlanBuilderCard() {
  const catalogById = useMemo(() => Object.fromEntries(CATALOG.map((x) => [x.id, x])), []);

  const [kindInput, setKindInput] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [qtyInput, setQtyInput] = useState<string>('');

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [rows, setRows] = useState<PlanRow[]>([
    { id: 'r1', itemId: 'job_description_match', label: 'Job Description Match', qty: 2 },
    { id: 'r2', itemId: 'wizard_edit', label: 'Wizard Edit', qty: 5 },
  ]);

  const subtotalAedCents = useMemo(() => {
    let sum = 0;
    for (const r of rows) {
      const item = catalogById[r.itemId] as CatalogItem | undefined;
      const unit = item?.unitPriceAedCents ?? 0;
      sum += clampInt(r.qty, 0, 9999) * unit;
    }
    return Math.max(0, Math.round(sum));
  }, [catalogById, rows]);

  const totalWithTaxAedCents = useMemo(() => {
    const total = subtotalAedCents * (1 + TAX_RATE);
    return Math.max(0, Math.round(total));
  }, [subtotalAedCents]);

  const canSubmit = useMemo(() => {
    const qty = Number(qtyInput);
    return Boolean(selectedItemId) && Number.isFinite(qty) && qty > 0;
  }, [qtyInput, selectedItemId]);

  const resetInputs = useCallback(() => {
    setKindInput('');
    setSelectedItemId('');
    setQtyInput('');
    setEditingRowId(null);
  }, []);

  const handleAddOrSave = useCallback(() => {
    const qty = clampInt(Number(qtyInput), 1, 9999);
    const item = catalogById[selectedItemId] as CatalogItem | undefined;
    if (!item) return;

    setRows((prev) => {
      if (editingRowId) {
        return prev.map((r) =>
          r.id === editingRowId ? { ...r, itemId: item.id, label: item.label, qty } : r,
        );
      }

      // Merge if item already exists; keeps UI tidy like screenshot.
      const existing = prev.find((r) => r.itemId === item.id);
      if (existing) {
        return prev.map((r) => (r.id === existing.id ? { ...r, qty: clampInt(r.qty + qty, 1, 9999) } : r));
      }

      return [...prev, { id: `r-${Date.now()}`, itemId: item.id, label: item.label, qty }];
    });

    resetInputs();
  }, [catalogById, editingRowId, qtyInput, resetInputs, selectedItemId]);

  const handleEditRow = useCallback(
    (row: PlanRow) => {
      setEditingRowId(row.id);
      setSelectedItemId(row.itemId);
      setQtyInput(String(row.qty));
      // Keep the first input as-is; it's just a UI affordance in the screenshot.
      setKindInput((v) => v || 'Item');
    },
    [],
  );

  const handleDeleteRow = useCallback((rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
    setEditingRowId((prev) => (prev === rowId ? null : prev));
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        mt: { xs: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          width: 'min(100%, 706px)',
          textAlign: 'center',
        }}
      >
        <Typography sx={{  mb:4 ,fontSize:'12px'}} fontWeight={400} color='text.secondary' >
          Do you want to create your own plan ?
        </Typography>

        {/* Inputs row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr auto' },
            gap: 1.25,
            alignItems: 'center',
            justifyItems: 'stretch',
            mb: 2,
          }}
        >
          <TextField
            value={kindInput}
            onChange={(e) => setKindInput(e.target.value)}
            placeholder='Coin or item'
            size='small'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 44,
                borderRadius:'16px',
                backgroundColor: '#fff',
                fontSize: 13.5,
                color: TEXT_DARK,
                '& fieldset': { borderColor: BORDER },
                '&:hover fieldset': { borderColor: BORDER },
                '&.Mui-focused fieldset': { borderColor: BORDER, borderWidth: 1 },
                '& input::placeholder': { color: TEXT_MUTED, opacity: 1 },
              },
            }}
          />

          <TextField
            select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(String(e.target.value))}
            size='small'
            fullWidth
            SelectProps={{
              displayEmpty: true,
              renderValue: (v) => {
                const id = String(v ?? '');
                if (!id) return <Box sx={{ color: TEXT_MUTED }}>Choose an item...</Box>;
                return catalogById[id]?.label ?? id;
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 44,
                  borderRadius:'16px',
                backgroundColor: '#fff',
                fontSize: 13.5,
                color: TEXT_DARK,
                '& fieldset': { borderColor: BORDER },
                '&:hover fieldset': { borderColor: BORDER },
                '&.Mui-focused fieldset': { borderColor: BORDER, borderWidth: 1 },
                '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
              },
            }}
          >
            <MenuItem value='' disabled>
              Choose an item...
            </MenuItem>
            {CATALOG.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            value={qtyInput}
            onChange={(e) => setQtyInput(e.target.value)}
            placeholder='Number of item...'
            size='small'
            fullWidth
            inputMode='numeric'
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 44,
                  borderRadius:'16px',
                backgroundColor: '#fff',
                fontSize: 13.5,
                color: TEXT_DARK,
                '& fieldset': { borderColor: BORDER },
                '&:hover fieldset': { borderColor: BORDER },
                '&.Mui-focused fieldset': { borderColor: BORDER, borderWidth: 1 },
                '& input::placeholder': { color: TEXT_MUTED, opacity: 1 },
              },
            }}
          />

          <IconButton
            aria-label={editingRowId ? 'Save item' : 'Add item'}
            onClick={handleAddOrSave}
            disabled={!canSubmit}
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              border: `1px solid ${BORDER}`,
              backgroundColor: '#fff',
              color: '#6B7280',
              justifySelf: { xs: 'end', sm: 'auto' },
              '&:hover': { backgroundColor: '#fff' },
            }}
          >
            {editingRowId ? <CheckIcon sx={{ fontSize: 20 }} /> : <AddIcon sx={{ fontSize: 20 }} />}
          </IconButton>
        </Box>

        {/* List card */}
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#fff',
            border: `1px solid ${BORDER}`,
            borderRadius: '12px',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          {rows.map((row, idx) => (
            <Box key={row.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                    justifyContent: 'center',

                    px: 2,
                  py: 1.25,
                }}
              >
                <Typography
                    fontSize='h6'
                  sx={{
                    fontWeight: 400,
                    color: TEXT_DARK,
                    minWidth: 0,
                    flex: '1 1 auto',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {row.label}
                </Typography>

                <Box
                  sx={{
                    width: 448,
                    flex: '0 0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                      fontSize='h6'
                      sx={{
                      fontWeight: 400,
                      color: TEXT_DARK,
                      textAlign: 'center',
                        justifyContent: 'center',

                        lineHeight: 1,
                    }}
                  >
                    {row.qty}
                  </Typography>
                </Box>

                <Stack direction='row' spacing={1} justifyContent='flex-end' sx={{ flex: '0 0 auto' }}>
                  <IconButton
                    size='small'
                    aria-label='Edit'
                    onClick={() => handleEditRow(row)}
                    sx={{
                      width: 32,
                      height: 32,
                      p: 0,
                      backgroundColor: 'transparent',
                      '&:hover': { backgroundColor: 'transparent' },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size='small'
                    aria-label='Delete'
                    onClick={() => handleDeleteRow(row.id)}
                    sx={{
                      width: 32,
                      height: 32,
                      p: 0,
                      backgroundColor: 'transparent',
                      '&:hover': { backgroundColor: 'transparent' },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>

              {idx < rows.length - 1 ? <Divider sx={{ borderColor: BORDER }} /> : null}
            </Box>
          ))}

          <Divider sx={{ borderColor: BORDER }} />

          <Box sx={{ px: 2, py: 1.6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ minWidth: 0, textAlign: 'center' }}>
              <Typography sx={{  textAlign: 'center' }} fontSize='h6' color='text.primary' fontWeight='400'>
                Total price
              </Typography>

            </Box>
<Box pl={18}>
    <Stack direction='row' alignItems='baseline' justifyContent='center' spacing={1} sx={{ mt: 0.1 }}>
        <Typography variant='h5' color='primary.main' fontWeight='584' sx={{  textAlign: 'center' }} >
            {formatAed(totalWithTaxAedCents)}
        </Typography>
    </Stack>
    <Typography sx={{ fontSize: 11.5, color: TEXT_MUTED, fontWeight: 600, mt: -0.25, textAlign: 'center' }}>
        With 9% Tax
    </Typography>
</Box>
            <MuiButton
              text='Upgrade Now'
              variant='contained'
              color='inherit'
              sx={{
                height: 40,
                px: 2.2,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 800,
                bgcolor: '#111827',
                color: '#fff',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#0B1220', boxShadow: 'none' },
                flex: '0 0 auto',
              }}
              onClick={() => {
                // no-op for now; pricing flow handled by plans comparison / gateway.
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

