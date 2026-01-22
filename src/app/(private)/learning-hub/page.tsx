'use client';

import React, { useEffect, useRef, useState } from 'react';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Checkbox, Stack, Typography } from '@mui/material';

import MuiCheckbox from '@/components/UI/MuiCheckbox';

import LearningHubContent, { mockLearningHubData } from './LearningHubContent';
import {
  HeaderDivider,
  LearningHubControls,
  LearningHubHeader,
  LearningHubRoot,
  LearningHubTabButton,
  LearningHubTabGroup,
  MenuItemStack,
  PopupMenu,
  RelativeStack,
  SortMenuContentStack,
} from './styled';

const AllLearningHubSection = () => <LearningHubContent items={mockLearningHubData} />;

const FreeLearningHubSection = () => <LearningHubContent items={mockLearningHubData.filter((item) => item.isFree)} />;

const PaidLearningHubSection = () => <LearningHubContent items={mockLearningHubData.filter((item) => !item.isFree)} />;

const LearningHubPage = () => {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('new-to-old');
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'paid'>('all');
  const sortButtonRef = useRef<HTMLDivElement | null>(null);
  const sortMenuRef = useRef<HTMLDivElement | null>(null);

  const handleSortClick = () => {
    setIsSortMenuOpen((prev) => !prev);
  };

  const handleSortOption = (sortType: string) => {
    setSelectedOption(sortType);
    setIsSortMenuOpen(false);
  };

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

  return (
    <LearningHubRoot>
      <Stack gap={2} mt={1}>
        <LearningHubHeader>
          <Typography variant='h5' fontWeight='500' color='text.primary'>
            Learning Hub
          </Typography>
          <LearningHubControls>
            <MuiCheckbox
              label={
                <Typography variant='body2' fontWeight='400' color='text.primary'>
                  Bookmarks
                </Typography>
              }
            />

            <HeaderDivider orientation='vertical' flexItem />

            <RelativeStack ref={sortButtonRef}>
              <LearningHubTabButton
                text='Select resume'
                color='secondary'
                variant='text'
                onClick={handleSortClick}
                endIcon={<KeyboardArrowDownRoundedIcon fontSize='small' />}
              />
              <PopupMenu ref={sortMenuRef} isOpen={isSortMenuOpen}>
                <SortMenuContentStack>
                  <MenuItemStack
                    direction='row'
                    alignItems='center'
                    gap={1}
                    onClick={() => handleSortOption('new-to-old')}
                  >
                    <Checkbox size='small' checked={selectedOption === 'new-to-old'} />
                    <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                      Newest
                    </Typography>
                  </MenuItemStack>
                  <MenuItemStack
                    direction='row'
                    alignItems='center'
                    gap={1}
                    onClick={() => handleSortOption('old-to-new')}
                  >
                    <Checkbox size='small' checked={selectedOption === 'old-to-new'} />
                    <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                      Oldest
                    </Typography>
                  </MenuItemStack>
                  <MenuItemStack
                    direction='row'
                    alignItems='center'
                    gap={1}
                    onClick={() => handleSortOption('free-first')}
                  >
                    <Checkbox size='small' checked={selectedOption === 'free-first'} />
                    <Typography variant='subtitle2' fontWeight='400' color='text.primary'>
                      Free first
                    </Typography>
                  </MenuItemStack>
                </SortMenuContentStack>
              </PopupMenu>
            </RelativeStack>
          </LearningHubControls>
        </LearningHubHeader>

        <LearningHubTabGroup direction='row' sx={{ flexWrap: 'nowrap' }}>
          <LearningHubTabButton
            text='All'
            variant={activeTab === 'all' ? 'contained' : 'outlined'}
            color='primary'
            onClick={() => setActiveTab('all')}
          />
          <LearningHubTabButton
            text='Free'
            variant={activeTab === 'free' ? 'contained' : 'outlined'}
            color='primary'
            onClick={() => setActiveTab('free')}
          />
          <LearningHubTabButton
            text='Paid'
            variant={activeTab === 'paid' ? 'contained' : 'outlined'}
            color='primary'
            onClick={() => setActiveTab('paid')}
          />
        </LearningHubTabGroup>

        {activeTab === 'all' && <AllLearningHubSection />}
        {activeTab === 'free' && <FreeLearningHubSection />}
        {activeTab === 'paid' && <PaidLearningHubSection />}
      </Stack>
    </LearningHubRoot>
  );
};

export default LearningHubPage;
