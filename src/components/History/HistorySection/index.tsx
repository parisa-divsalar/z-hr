import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { CircularProgress, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import Dotsvertical from '@/assets/images/dashboard/dots-vertical.svg';
import FrameFaw from '@/assets/images/dashboard/FrameFaw.svg';
import ImageIcon from '@/assets/images/dashboard/image.svg';
import Position from '@/assets/images/dashboard/position.svg';
import ResumeIcon from '@/assets/images/dashboard/resume.svg?url';
import TrashIcon from '@/assets/images/dashboard/trash-01.svg';
import VideoIcon from '@/assets/images/dashboard/video.svg';
import VoiceIcon from '@/assets/images/dashboard/voice.svg';
import {
    HeaderDivider,
    HistoryCommunityCardRoot,
    HistoryImage,
    MenuContentStack,
    MenuItemStack,
    MoreButton,
    PopupMenu,
    TagPill,
    RelativeStack,
    SectionHeader,
    SortMenuContentStack,
    StyledDivider,
} from '@/components/History/styled';
import { THistoryChannel } from '@/components/History/type';
import MuiAlert from '@/components/UI/MuiAlert';
import MuiButton from '@/components/UI/MuiButton';
import MuiCheckbox from '@/components/UI/MuiCheckbox';
import { getMainTranslations } from '@/locales/main';
import { useAuthStore } from '@/store/auth';
import { useLocaleStore } from '@/store/common';

type THistorySortOption = 'NEW_TO_OLD' | 'OLD_TO_NEW' | 'SIZE' | 'FIT_SCORE';

const SORT_OPTION_KEYS: THistorySortOption[] = ['NEW_TO_OLD', 'OLD_TO_NEW', 'SIZE', 'FIT_SCORE'];

function getSortOptions(t: Record<string, string>): { value: THistorySortOption; label: string }[] {
    return [
        { value: 'NEW_TO_OLD', label: t.sortNewToOld },
        { value: 'OLD_TO_NEW', label: t.sortOldToNew },
        { value: 'SIZE', label: t.sortSize },
        { value: 'FIT_SCORE', label: t.sortFitScore },
    ];
}

function translateHistoryField(value: string, t: Record<string, string>): string {
    if (!value || typeof value !== 'string') return value;
    const v = value.trim();
    const upper = v.toUpperCase();
    const levelMap: Record<string, string> = {
        MID: t.levelMid,
        'MID-SENIOR': t.levelMidSenior,
        JUNIOR: t.levelJunior,
        SENIOR: t.levelSenior,
        ENTRY: t.levelEntry,
    };
    if (levelMap[upper]) return levelMap[upper];
    const positionMap: Record<string, string> = {
        'PROGRAMMING LANGUAGES': t.positionProgrammingLanguages,
        'WEB FRAMEWORKS': t.positionWebFrameworks,
    };
    if (positionMap[upper]) return positionMap[upper];
    if (upper === 'RESUME') return t.labelResume;
    if (upper === 'VOICE') return t.labelVoice;
    if (upper === 'PHOTO') return t.labelPhoto;
    if (upper === 'VIDEO') return t.labelVideo;
    return v;
}

function translateSizeDisplay(value: string, t: Record<string, string>): string {
    if (!value || typeof value !== 'string') return value;
    return value.replace(/\bMB\b/gi, t.sizeUnitMb);
}

function translateDisplayName(name: string, t: Record<string, string>): string {
    if (!name || typeof name !== 'string') return name;
    return name.replace(/\bResume\b/gi, t.labelResume);
}

type HistoryCardProps = THistoryChannel & {
    onToggleBookmark: (id: string, next: boolean) => void;
    onDelete: (id: string) => void;
    t: Record<string, string>;
};

const HistoryCard = ({
    name,
    date,
    Percentage,
    position,
    level,
    size,
    Voice,
    Photo,
    Video,
    description,
    id,
    is_bookmarked,
    onToggleBookmark,
    onDelete,
    t,
}: HistoryCardProps) => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [downloadError, _setDownloadError] = useState<string | null>(null);
    const moreButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMoreClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleEditClick = () => {
        // `id` here is the requestId of the CV (see /api/history route materializing from cvs.json)
        // First go to history-edite preview so user can see the selected history card,
        // then the Edit button on that page will open the ResumeEditor.
        router.push(`/history-edite?id=${encodeURIComponent(id)}`);
    };

    const handleFavorite = () => {
        setIsMenuOpen(false);
        onToggleBookmark(id, !Boolean(is_bookmarked));
    };

    const handleDelete = () => {
        setIsMenuOpen(false);
        onDelete(id);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isMenuOpen &&
                menuRef.current &&
                moreButtonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !moreButtonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <HistoryCommunityCardRoot ref={cardRef}>
            {downloadError && <MuiAlert severity='error' message={downloadError} sx={{ mx: 2, mt: 2, mb: 0 }} />}
            <Grid
                container
                spacing={2}
                alignItems='center'
                sx={(theme) => ({
                    [theme.breakpoints.down('sm')]: {
                        flexDirection: 'column',
                        alignItems: 'stretch',
                    },
                })}
            >
                <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                    <HistoryImage m={1}>
                        <Image src={ResumeIcon} alt={t.resumePreviewAlt} fill />
                    </HistoryImage>
                </Grid>

                <Grid
                    size={{ xs: 12, sm: 5, md: 7 }}
                    p={2}
                    sx={(theme) => ({
                        paddingInlineStart: theme.spacing(4),
                        paddingInlineEnd: theme.spacing(2),
                        [theme.breakpoints.down('sm')]: {
                            paddingInlineStart: theme.spacing(2),
                            paddingInlineEnd: theme.spacing(2),
                        },
                    })}
                >
                    <Stack direction='row' gap={2}>
                        <Typography variant='subtitle1' fontWeight='500' color='text.primary'>
                            {translateDisplayName(name, t)}
                        </Typography>

                        <TagPill>{Percentage}</TagPill>
                    </Stack>

                    <Stack direction='row' gap={1} mt={1} alignItems='center'>
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            {date}
                        </Typography>
                        <StyledDivider orientation='vertical' flexItem />
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            {translateSizeDisplay(size, t)}
                        </Typography>
                        <StyledDivider orientation='vertical' flexItem />
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            {translateHistoryField(position, t)}
                        </Typography>
                        <StyledDivider orientation='vertical' flexItem />
                        <Typography variant='subtitle2' fontWeight='400' color='text.secondary'>
                            {translateHistoryField(level, t)}
                        </Typography>
                    </Stack>

                    <Stack
                        direction='row'
                        gap={3}
                        alignItems='center'
                        mt={2}
                        sx={(theme) => ({
                            flexWrap: 'wrap',
                            [theme.breakpoints.down('sm')]: {
                                gap: theme.spacing(1.5),
                            },
                        })}
                    >
                        <Stack direction='row' gap={0.5} alignItems='center'>
                            <VoiceIcon />
                            <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                                {translateHistoryField(Voice, t)}
                            </Typography>
                        </Stack>
                        <Stack direction='row' gap={0.5} alignItems='center'>
                            <ImageIcon />
                            <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                                {translateHistoryField(Photo, t)}
                            </Typography>
                        </Stack>
                        <Stack direction='row' gap={0.5} alignItems='center'>
                            <VideoIcon />
                            <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                                {translateHistoryField(Video, t)}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack
                        direction='row'
                        gap={1}
                        mt={4}
                        sx={(theme) => ({
                            flexWrap: 'wrap',
                            [theme.breakpoints.down('sm')]: {
                                gap: theme.spacing(1),
                            },
                        })}
                    >
                        <Position />

                        <Typography variant='subtitle2' fontWeight='500' color='text.primary'>
                            {description}
                        </Typography>
                    </Stack>
                </Grid>

                <Grid
                    size={{ xs: 12, sm: 3, md: 3 }}
                    sx={(theme) => ({
                        [theme.breakpoints.down('sm')]: {
                            width: '100%',
                        },
                    })}
                >
                    <Stack
                        gap={11}
                        alignItems='flex-end'
                        sx={(theme) => ({
                            [theme.breakpoints.down('sm')]: {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: theme.spacing(1.5),
                            },
                        })}
                    >
                        <RelativeStack direction='row' gap={3}>
                            <MoreButton ref={moreButtonRef} onClick={handleMoreClick} aria-label={t.moreOptionsAria}>
                                <Dotsvertical />
                            </MoreButton>

                            <PopupMenu ref={menuRef} isOpen={isMenuOpen}>
                                <MenuContentStack>
                                    <MenuItemStack direction='row' alignItems='center' gap={1} onClick={handleFavorite}>
                                        <FrameFaw />
                                        <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                                            {t.favorite}
                                        </Typography>
                                    </MenuItemStack>
                                    <MenuItemStack direction='row' alignItems='center' gap={1} onClick={handleDelete}>
                                        <TrashIcon />
                                        <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                                            {t.delete}
                                        </Typography>
                                    </MenuItemStack>
                                </MenuContentStack>
                            </PopupMenu>
                        </RelativeStack>
                        <Stack
                            direction='row'
                            gap={2}
                            sx={(theme) => ({
                                [theme.breakpoints.down('sm')]: {
                                    flexWrap: 'wrap',
                                    justifyContent: 'flex-start',
                                    width: 'auto',
                                },
                            })}
                        >
                            <MuiButton variant='outlined' color='secondary' onClick={handleEditClick}>
                                {t.edit}
                            </MuiButton>
                            {/*<MuiButton*/}
                            {/*    variant='contained'*/}
                            {/*    color='secondary'*/}
                            {/*    loading={isDownloading}*/}
                            {/*    onClick={handleDownload}*/}
                            {/*>*/}
                            {/*    {isDownloading*/}
                            {/*        ? `Preparing PDF… ${Math.round(downloadProgress * 100)}%`*/}
                            {/*        : 'Download PDF'}*/}
                            {/*</MuiButton>*/}
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </HistoryCommunityCardRoot>
    );
};

const HistorySection = () => {
    const locale = useLocaleStore((s) => s.locale);
    const t = getMainTranslations(locale).history as Record<string, string>;
    const sortOptions = useMemo(() => getSortOptions(t), [t]);
    const [allItems, setAllItems] = useState<THistoryChannel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [bookmarksOnly, setBookmarksOnly] = useState(false);
    const [visibleCount, setVisibleCount] = useState(0);
    const observerTarget = useRef<HTMLDivElement>(null);
    const sortButtonRef = useRef<HTMLDivElement>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Show all items by default (up to a safe cap); keep infinite-scroll behavior for very large lists.
    const ITEMS_PER_PAGE = 50;

    const sortFromUrl = useMemo<THistorySortOption>(() => {
        const v = String(searchParams.get('sort') ?? '').trim().toUpperCase();
        return SORT_OPTION_KEYS.includes(v as THistorySortOption) ? (v as THistorySortOption) : 'NEW_TO_OLD';
    }, [searchParams]);

    const [sortOption, setSortOption] = useState<THistorySortOption>(sortFromUrl);
    const accessToken = useAuthStore((s) => s.accessToken);

    useEffect(() => {
        setSortOption((prev) => (prev === sortFromUrl ? prev : sortFromUrl));
    }, [sortFromUrl]);

    const selectedSortLabel = useMemo(
        () => sortOptions.find((o) => o.value === sortOption)?.label ?? t.sort,
        [sortOption, sortOptions, t.sort],
    );

    const parseDateToTimestamp = (value: string) => {
        const s = String(value ?? '').trim();
        if (!s) return 0;

        const parts = s.split('/');
        if (parts.length === 3) {
            const mm = Number(parts[0]);
            const dd = Number(parts[1]);
            const yyyy = Number(parts[2]);
            if (mm && dd && yyyy) {
                const t = new Date(yyyy, mm - 1, dd).getTime();
                if (Number.isFinite(t)) return t;
            }
        }

        const t = Date.parse(s);
        return Number.isFinite(t) ? t : 0;
    };

    const parseSizeMB = (value: string) => {
        // Expected format: "2.85 MB"
        const n = Number.parseFloat(String(value ?? '').replace(/mb/i, '').trim());
        return Number.isFinite(n) ? n : 0;
    };

    const parseFitScore = (value: string) => {
        // Expected format: "89%"
        const n = Number.parseFloat(String(value ?? '').replace('%', '').trim());
        return Number.isFinite(n) ? n : 0;
    };

    const sortedAllItems = useMemo(() => {
        const items = [...allItems];
        switch (sortOption) {
            case 'NEW_TO_OLD':
                return items.sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date));
            case 'OLD_TO_NEW':
                return items.sort((a, b) => parseDateToTimestamp(a.date) - parseDateToTimestamp(b.date));
            case 'SIZE':
                return items.sort((a, b) => parseSizeMB(b.size) - parseSizeMB(a.size));
            case 'FIT_SCORE':
                return items.sort((a, b) => parseFitScore(b.Percentage) - parseFitScore(a.Percentage));
            default:
                return items;
        }
    }, [allItems, sortOption]);

    const displayedItems = useMemo(() => {
        return sortedAllItems.slice(0, visibleCount);
    }, [sortedAllItems, visibleCount]);

    const handleSortClick = () => {
        setIsSortMenuOpen((prev) => !prev);
    };

    const handleSortSelect = (option: THistorySortOption) => {
        setSortOption(option);
        setIsSortMenuOpen(false);

        const next = new URLSearchParams(searchParams.toString());
        next.set('sort', option);
        router.replace(`?${next.toString()}`);
    };

    const loadMoreItems = useCallback(() => {
        if (isLoading) return;
        setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, sortedAllItems.length));
    }, [isLoading, sortedAllItems.length]);

    useEffect(() => {
        // Fetch initial history from DB (API)
        setIsLoading(true);
        const qs = new URLSearchParams();
        if (bookmarksOnly) qs.set('bookmarked', '1');
        // keep server ordering consistent with UI default; client sorting still applies immediately.
        qs.set('sort', sortOption);

        fetch(`/api/history?${qs.toString()}`, {
            cache: 'no-store',
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        })
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
            .then((json) => {
                const rows = Array.isArray(json?.data) ? (json.data as THistoryChannel[]) : [];
                setAllItems(rows);
                setVisibleCount(Math.min(ITEMS_PER_PAGE, rows.length));
            })
            .catch(() => {
                setAllItems([]);
                setVisibleCount(0);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [bookmarksOnly, accessToken, sortOption]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isSortMenuOpen &&
                sortMenuRef.current &&
                sortButtonRef.current &&
                !sortMenuRef.current.contains(event.target as Node) &&
                !sortButtonRef.current.contains(event.target as Node)
            ) {
                setIsSortMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSortMenuOpen]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && visibleCount < sortedAllItems.length) {
                    loadMoreItems();
                }
            },
            { threshold: 0.1 },
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [isLoading, loadMoreItems, sortedAllItems.length, visibleCount]);

    const handleToggleBookmark = (id: string, next: boolean) => {
        setAllItems((prev) => prev.map((r) => (r.id === id ? { ...r, is_bookmarked: next } : r)));
        fetch(`/api/history`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
            body: JSON.stringify({ id, is_bookmarked: next }),
        }).catch(() => {
            setAllItems((prev) => prev.map((r) => (r.id === id ? { ...r, is_bookmarked: !next } : r)));
        });
    };

    const handleDelete = (id: string) => {
        const snapshot = allItems;
        setAllItems((prev) => prev.filter((r) => r.id !== id));
        setVisibleCount((prev) => Math.min(prev, Math.max(0, sortedAllItems.length - 1)));
        fetch(`/api/history?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        }).catch(() => {
            setAllItems(snapshot);
        });
    };

    return (
        <Stack gap={1}>
            <SectionHeader>
                <Typography variant='h5' fontWeight='500' color='text.primary'>
                    {t.title}
                </Typography>
                <Stack direction='row' alignItems='center'>
                    <MuiCheckbox
                        checked={bookmarksOnly}
                        onChange={() => setBookmarksOnly((p) => !p)}
                        label={
                            <Typography variant='body2' fontWeight='400' color='text.primary'>
                                {t.bookmarks}
                            </Typography>
                        }
                    />

                    <HeaderDivider orientation='vertical' flexItem sx={{ ml: 2 }} />

                    <RelativeStack ref={sortButtonRef}>
                        <MuiButton
                            text={selectedSortLabel}
                            color='secondary'
                            variant='text'
                            sx={{
                                gap: '0.4rem',
                                backgroundColor: 'transparent',
                                '&:hover': { backgroundColor: 'transparent' },
                            }}
                            onClick={handleSortClick}
                            endIcon={<KeyboardArrowDownRoundedIcon fontSize='small' />}
                        />

                        <PopupMenu ref={sortMenuRef} isOpen={isSortMenuOpen}>
                            <SortMenuContentStack>
                                {sortOptions.map((opt) => {
                                    const isSelected = sortOption === opt.value;
                                    return (
                                        <MenuItemStack
                                            key={opt.value}
                                            direction='row'
                                            alignItems='center'
                                            gap={1}
                                            onClick={() => handleSortSelect(opt.value)}
                                            sx={{
                                                px: 1,
                                                py: 0.75,
                                                borderRadius: 1,
                                                width: '100%',
                                                backgroundColor: isSelected ? 'action.selected' : 'transparent',
                                            }}
                                        >
                                            <Typography
                                                variant='subtitle2'
                                                fontWeight={isSelected ? 600 : 400}
                                                color='text.primary'
                                            >
                                                {opt.label}
                                            </Typography>
                                        </MenuItemStack>
                                    );
                                })}
                            </SortMenuContentStack>
                        </PopupMenu>
                    </RelativeStack>
                </Stack>
            </SectionHeader>

            {displayedItems.map((channel) => (
                <HistoryCard
                    key={channel.id}
                    {...channel}
                    onToggleBookmark={handleToggleBookmark}
                    onDelete={handleDelete}
                    t={t}
                />
            ))}

            <Stack ref={observerTarget} alignItems='center' justifyContent='center' py={2}>
                {isLoading && <CircularProgress size={30} />}
                {visibleCount >= sortedAllItems.length && displayedItems.length > 0 && (
                    <Typography variant='body2' color='text.secondary'>
                        {t.noMoreItems}
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
};

export default HistorySection;
