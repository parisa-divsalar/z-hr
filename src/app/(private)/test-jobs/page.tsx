'use client';

import { useEffect, useState } from 'react';

import { Stack, Typography, Card, CardContent, Chip, Button, CircularProgress, TextField, Box } from '@mui/material';
import Grid from '@mui/material/Grid';

interface JobPosition {
  id?: string;
  title: string;
  company: string;
  location?: string;
  locationType?: 'remote' | 'hybrid' | 'onsite';
  description?: string;
  requirements?: string;
  techStack?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  employmentType?: string;
  experienceLevel?: string;
  postedDate?: string;
  applicationUrl?: string;
  source: string;
  sourceUrl?: string;
}

export default function TestJobsPage() {
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('developer');
  const [location, setLocation] = useState('New York'); // Changed from Dubai since UAE is not supported by Adzuna

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/jobs/test?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&limit=20`
      );
      const data = await response.json();
      
      if (data.success && data.jobs && data.jobs.length > 0) {
        setJobs(data.jobs);
        setError(null);
      } else {
        // Show helpful error message with instructions
        if (data.instructions) {
          setError('API keys not configured');
          // Store instructions for display
          (window as any).apiInstructions = data.instructions;
        } else {
          setError(data.error || data.message || 'No jobs found');
        }
        setJobs([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <Stack spacing={3} sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant='h4' fontWeight='600'>
        🧪 Test Job Positions Data
      </Typography>

      <Typography variant='body2' color='text.secondary'>
        این صفحه برای تست و مشاهده job positions data است. داده‌ها از API های واقعی (Adzuna, JSearch, JobData) fetch می‌شوند و نمایش داده می‌شوند (بدون ذخیره در database).
      </Typography>
      
      {jobs.length > 0 && (
        <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText', p: 1.5 }}>
          <Typography variant='body2' fontWeight='600'>
            ✅ داده‌های واقعی از Adzuna API دریافت شد! ({jobs.length} شغل)
          </Typography>
        </Card>
      )}

      {/* Search Controls */}
      <Stack direction='row' spacing={2} alignItems='center'>
        <TextField
          label='Job Title'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size='small'
          sx={{ flex: 1 }}
        />
        <TextField
          label='Location'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          size='small'
          sx={{ flex: 1 }}
          placeholder='New York, London, remote, etc.'
          helperText='برای Dubai/UAE از "remote" استفاده کنید'
        />
        <Button variant='contained' onClick={fetchJobs} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Fetch Jobs'}
        </Button>
      </Stack>

      {/* Error Message */}
      {error && (
        <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText', p: 2 }}>
          <Typography variant='h6' gutterBottom>
            ⚠️ {error}
          </Typography>
          {error.includes('API key') && (
            <Typography variant='body2' sx={{ mt: 1 }}>
              لطفاً راهنمای زیر را برای دریافت API key دنبال کنید.
            </Typography>
          )}
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Stack alignItems='center' spacing={2}>
          <CircularProgress />
          <Typography variant='body2' color='text.secondary'>
            Fetching job data...
          </Typography>
        </Stack>
      )}

      {/* Jobs List */}
      {!loading && jobs.length > 0 && (
        <>
          <Typography variant='h6'>
            Found {jobs.length} jobs
          </Typography>
          <Grid container spacing={2}>
            {jobs.map((job, index) => (
              <Grid key={job.id || index} size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={2}>
                      {/* Title & Company */}
                      <Stack>
                        <Typography variant='h6' fontWeight='600'>
                          {job.title}
                        </Typography>
                        <Typography variant='subtitle1' color='text.secondary'>
                          {job.company}
                        </Typography>
                      </Stack>

                      {/* Location & Type */}
                      <Stack direction='row' spacing={1} flexWrap='wrap'>
                        {job.location && (
                          <Chip label={job.location} size='small' variant='outlined' />
                        )}
                        {job.locationType && (
                          <Chip 
                            label={job.locationType} 
                            size='small' 
                            color={job.locationType === 'remote' ? 'primary' : 'default'} 
                          />
                        )}
                        {job.employmentType && (
                          <Chip label={job.employmentType} size='small' variant='outlined' />
                        )}
                        {job.experienceLevel && (
                          <Chip label={job.experienceLevel} size='small' />
                        )}
                      </Stack>

                      {/* Salary */}
                      {(job.salaryMin || job.salaryMax) && (
                        <Typography variant='body2' color='text.secondary'>
                          💰 Salary: {job.salaryMin && job.salaryMax 
                            ? `${job.salaryMin} - ${job.salaryMax} ${job.salaryCurrency || 'USD'}`
                            : job.salaryMin 
                              ? `From ${job.salaryMin} ${job.salaryCurrency || 'USD'}`
                              : `Up to ${job.salaryMax} ${job.salaryCurrency || 'USD'}`
                          }
                        </Typography>
                      )}

                      {/* Description */}
                      {job.description && (
                        <Typography variant='body2' color='text.secondary' sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {job.description}
                        </Typography>
                      )}

                      {/* Tech Stack */}
                      {job.techStack && job.techStack.length > 0 && (
                        <Stack spacing={1}>
                          <Typography variant='caption' color='text.secondary'>
                            Tech Stack:
                          </Typography>
                          <Stack direction='row' spacing={1} flexWrap='wrap'>
                            {job.techStack.map((tech, idx) => (
                              <Chip key={idx} label={tech} size='small' color='primary' variant='outlined' />
                            ))}
                          </Stack>
                        </Stack>
                      )}

                      {/* Requirements */}
                      {job.requirements && (
                        <Box>
                          <Typography variant='caption' fontWeight='600' color='text.secondary'>
                            Requirements:
                          </Typography>
                          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                            {job.requirements}
                          </Typography>
                        </Box>
                      )}

                      {/* Source & Date */}
                      <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant='caption' color='text.secondary'>
                          Source: {job.source}
                        </Typography>
                        {job.postedDate && (
                          <Typography variant='caption' color='text.secondary'>
                            {new Date(job.postedDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </Stack>

                      {/* Action Button */}
                      {job.applicationUrl && (
                        <Button
                          variant='contained'
                          fullWidth
                          href={job.applicationUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Apply Now
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Empty State / API Key Instructions */}
      {!loading && jobs.length === 0 && (
        <Card sx={{ mt: 2, border: '2px solid', borderColor: 'warning.main' }}>
          <CardContent>
            <Typography variant='h6' color='warning.main' gutterBottom>
              ⚠️ برای مشاهده داده‌های واقعی، API Key لازم است
            </Typography>
            <Typography variant='body2' color='text.secondary' paragraph>
              این صفحه <strong>فقط داده‌های واقعی</strong> از job boards نمایش می‌دهد. هیچ mock data استفاده نمی‌شود.
            </Typography>
            
            <Typography variant='subtitle1' fontWeight='600' gutterBottom sx={{ mt: 2 }}>
              راه‌اندازی سریع (5 دقیقه):
            </Typography>
            
            <Stack spacing={2} sx={{ mt: 2 }}>
              {/* Adzuna */}
              <Card variant='outlined'>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant='subtitle1' fontWeight='600'>
                      1️⃣ Adzuna API (پیشنهادی - رایگان)
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      بهترین گزینه برای شروع - کاملاً رایگان
                    </Typography>
                    <Button
                      variant='outlined'
                      size='small'
                      href='https://developer.adzuna.com/signup'
                      target='_blank'
                      rel='noopener noreferrer'
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      ثبت نام و دریافت API Key →
                    </Button>
                    <Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>
                      بعد از ثبت نام، در فایل <code>.env.local</code> اضافه کنید:
                    </Typography>
                    <Box component='pre' sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 1, fontSize: '0.75rem', overflow: 'auto' }}>
{`ADZUNA_APP_ID=your-app-id-here
ADZUNA_APP_KEY=your-app-key-here`}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* JSearch */}
              <Card variant='outlined'>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant='subtitle1' fontWeight='600'>
                      2️⃣ JSearch API (از طریق RapidAPI)
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      دسترسی به Indeed, LinkedIn, Glassdoor و...
                    </Typography>
                    <Button
                      variant='outlined'
                      size='small'
                      href='https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch'
                      target='_blank'
                      rel='noopener noreferrer'
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Subscribe در RapidAPI →
                    </Button>
                    <Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>
                      در فایل <code>.env.local</code>:
                    </Typography>
                    <Box component='pre' sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 1, fontSize: '0.75rem' }}>
{`RAPIDAPI_KEY=your-rapidapi-key-here`}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* JobData */}
              <Card variant='outlined'>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant='subtitle1' fontWeight='600'>
                      3️⃣ JobData API
                    </Typography>
                    <Button
                      variant='outlined'
                      size='small'
                      href='https://jobdataapi.com/'
                      target='_blank'
                      rel='noopener noreferrer'
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      ثبت نام →
                    </Button>
                    <Box component='pre' sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 1, fontSize: '0.75rem' }}>
{`JOB_DATA_API_KEY=your-key-here`}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>

            <Typography variant='body2' color='text.secondary' sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              💡 <strong>نکته:</strong> بعد از اضافه کردن API key، server را restart کنید (<code>npm run dev</code>)
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Data Preview (for backend team) */}
      {jobs.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              📋 Raw Data Preview (برای تیم Backend)
            </Typography>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              این داده‌ها از API دریافت شده‌اند و می‌توانند در database ذخیره شوند:
            </Typography>
            <Box
              component='pre'
              sx={{
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 400,
                fontSize: '0.75rem',
              }}
            >
              {JSON.stringify(jobs.slice(0, 2), null, 2)}
            </Box>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
