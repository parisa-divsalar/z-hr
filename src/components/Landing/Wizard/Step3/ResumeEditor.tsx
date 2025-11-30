import React, { FunctionComponent, useState } from 'react';

import { Check, Close } from '@mui/icons-material';
import { Box, CardContent, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';

import EditIcon from '@/assets/images/icons/edit.svg';
import ArrowBackIcon from '@/assets/images/icons/Icon-back.svg';
import RefreshIcon from '@/assets/images/icons/refresh.svg';
import StarIcon from '@/assets/images/icons/star.svg';
import MuiButton from '@/components/UI/MuiButton';
import { PublicRoutes } from '@/config/routes';

import ProfileHeader from './ResumeEditor/ProfileHeader';
import SectionHeader from './ResumeEditor/SectionHeader';
import {
  MainCardContainer,
  FooterContainer,
  ResumeContainer,
  SectionContainer,
  SummaryContainer,
  SummaryText,
  SkillsContainer,
  SkillItem,
  ExperienceContainer,
  ExperienceItem,
  ExperienceItemSmall,
  ExperienceHeader,
  CompanyName,
  JobDetails,
  ExperienceActions,
  ExperienceDescription,
  SkillTextField,
  CompanyTextField,
  PositionTextField,
  StyledTextareaAutosize,
  ExperienceTextareaAutosize,
} from './ResumeEditor/styled';

interface ResumeEditorProps {
  setActiveStep: (activeStep: number) => void;
}

const ResumeEditor: FunctionComponent<ResumeEditorProps> = (props) => {
  const { setActiveStep } = props;
  const router = useRouter();
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const [summary, setSummary] = useState(
    "I'm a highly skilled front-end developer with 12 years of experience based in Dubai. Over the years, I've worked on numerous projects, honing my skills in HTML, CSS, and JavaScript. My passion lies in creating responsive and user-friendly interfaces that enhance the overall user experience.",
  );
  const [skills, setSkills] = useState(['React', 'JavaScript', 'HTML', 'CSS', 'UI/UX Design', 'Problem-solving']);
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      company: 'Tech Solutions Inc.',
      position: 'Front-end Developer • 09-09-2020 — 12-12-2023 • Dubai',
      description:
        'Led development of responsive web applications using React and modern JavaScript frameworks. Collaborated with cross-functional teams to deliver high-quality user experiences and implemented best practices for code quality and performance optimization.',
    },
    {
      id: 2,
      company: 'Digital Innovations Ltd.',
      position: 'Front-end Developer • 01-01-2018 — 08-08-2020 • Dubai',
      description:
        'Developed and maintained multiple client projects focusing on user interface design and front-end development. Worked closely with designers to implement pixel-perfect interfaces and ensured cross-browser compatibility.',
    },
  ]);

  const handleEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleSave = () => {
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditingSection(null);
  };

  const handleSkillsChange = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const handleExperienceChange = (id: number, field: string, value: string) => {
    setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)));
  };

  const handleSubmit = () => {
    router.push(PublicRoutes.moreFeatures);
  };

  return (
    <ResumeContainer>
      <MainCardContainer>
        <CardContent>
          <ProfileHeader />

          <SectionContainer>
            <SectionHeader
              title='Summary'
              onEdit={() => handleEdit('summary')}
              isEditing={editingSection === 'summary'}
              onSave={handleSave}
              onCancel={handleCancel}
            />
            <SummaryContainer>
              {editingSection === 'summary' ? (
                <StyledTextareaAutosize value={summary} onChange={(e) => setSummary(e.target.value)} />
              ) : (
                <SummaryText>{summary}</SummaryText>
              )}
            </SummaryContainer>
          </SectionContainer>

          <SectionContainer>
            <SectionHeader
              title='Skills'
              onEdit={() => handleEdit('skills')}
              isEditing={editingSection === 'skills'}
              onSave={handleSave}
              onCancel={handleCancel}
            />
            <SkillsContainer>
              {editingSection === 'skills'
                ? skills.map((skill, index) => (
                    <SkillTextField
                      key={index}
                      value={skill}
                      onChange={(e) => handleSkillsChange(index, e.target.value)}
                      size='small'
                    />
                  ))
                : skills.map((skill, index) => <SkillItem key={index}>{skill}</SkillItem>)}
            </SkillsContainer>
          </SectionContainer>

          <ExperienceContainer>
            <SectionHeader title='Experience' />

            <ExperienceItem>
              <ExperienceHeader>
                <Box>
                  {editingSection === 'experience-1' ? (
                    <>
                      <CompanyTextField
                        value={experiences[0].company}
                        onChange={(e) => handleExperienceChange(1, 'company', e.target.value)}
                        variant='standard'
                        fullWidth
                      />
                      <PositionTextField
                        value={experiences[0].position}
                        onChange={(e) => handleExperienceChange(1, 'position', e.target.value)}
                        variant='standard'
                        size='small'
                        fullWidth
                      />
                    </>
                  ) : (
                    <>
                      <CompanyName variant='h6'>{experiences[0].company}</CompanyName>
                      <JobDetails variant='body2'>{experiences[0].position}</JobDetails>
                    </>
                  )}
                </Box>
                <ExperienceActions>
                  {editingSection === 'experience-1' ? (
                    <>
                      <IconButton size='small' onClick={handleSave} color='success'>
                        <Check fontSize='small' />
                      </IconButton>
                      <IconButton size='small' onClick={handleCancel} color='error'>
                        <Close fontSize='small' />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton size='small' onClick={() => handleEdit('experience-1')}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size='small'>
                        <RefreshIcon />
                      </IconButton>
                      <IconButton size='small'>
                        <StarIcon />
                      </IconButton>
                    </>
                  )}
                </ExperienceActions>
              </ExperienceHeader>
              {editingSection === 'experience-1' ? (
                <ExperienceTextareaAutosize
                  value={experiences[0].description}
                  onChange={(e) => handleExperienceChange(1, 'description', e.target.value)}
                />
              ) : (
                <ExperienceDescription variant='body2'>{experiences[0].description}</ExperienceDescription>
              )}
            </ExperienceItem>

            <ExperienceItemSmall>
              <ExperienceHeader>
                <Box>
                  {editingSection === 'experience-2' ? (
                    <>
                      <CompanyTextField
                        value={experiences[1].company}
                        onChange={(e) => handleExperienceChange(2, 'company', e.target.value)}
                        variant='standard'
                        fullWidth
                      />
                      <PositionTextField
                        value={experiences[1].position}
                        onChange={(e) => handleExperienceChange(2, 'position', e.target.value)}
                        variant='standard'
                        size='small'
                        fullWidth
                      />
                    </>
                  ) : (
                    <>
                      <CompanyName variant='h6'>{experiences[1].company}</CompanyName>
                      <JobDetails variant='body2'>{experiences[1].position}</JobDetails>
                    </>
                  )}
                </Box>
                <ExperienceActions>
                  {editingSection === 'experience-2' ? (
                    <>
                      <IconButton size='small' onClick={handleSave} color='success'>
                        <Check fontSize='small' />
                      </IconButton>
                      <IconButton size='small' onClick={handleCancel} color='error'>
                        <Close fontSize='small' />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton size='small' onClick={() => handleEdit('experience-2')}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size='small'>
                        <RefreshIcon />
                      </IconButton>
                      <IconButton size='small'>
                        <StarIcon />
                      </IconButton>
                    </>
                  )}
                </ExperienceActions>
              </ExperienceHeader>
              {editingSection === 'experience-2' ? (
                <ExperienceTextareaAutosize
                  value={experiences[1].description}
                  onChange={(e) => handleExperienceChange(2, 'description', e.target.value)}
                />
              ) : (
                <ExperienceDescription variant='body2'>{experiences[1].description}</ExperienceDescription>
              )}
            </ExperienceItemSmall>
          </ExperienceContainer>
        </CardContent>
      </MainCardContainer>

      <FooterContainer>
        <MuiButton
          text='Back'
          variant='outlined'
          color='secondary'
          size='large'
          startIcon={<ArrowBackIcon />}
          onClick={() => setActiveStep(2)}
        />

        <MuiButton
          color='secondary'
          size='large'
          variant='contained'
          text='Submit'
          onClick={handleSubmit}
          sx={{ width: '188px' }}
        />
      </FooterContainer>
    </ResumeContainer>
  );
};

export default ResumeEditor;
