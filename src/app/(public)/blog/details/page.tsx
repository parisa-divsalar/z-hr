'use client';

import { useState } from 'react';

import { Stack, Typography } from '@mui/material';

import AddIcon from '@/assets/images/icons/add.svg';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';

import styles from './page.module.css';

const resumeTips = [
    'Lead with a Dubai-ready summary that mirrors the role.',
    'Mirror the job description keywords to pass ATS scans.',
    'Highlight measurable impact to build instant trust.',
    'Organize experience in reverse chronological order with clear dates.',
    'Keep formatting crisp with consistent spacing and section headers.',
];

const sidebarTopics = ['Resume Tips', 'ATS Insights', 'Format Choices', 'Collaboration Tools', 'Trial Options'];

const comments = [
    {
        name: 'Sara Al Farsi',
        timestamp: 'Yesterday',
        text: 'These tips helped me restructure my CV into a Dubai-friendly version. Thank you!',
    },
    {
        name: 'Omar Sayed',
        timestamp: '2 days ago',
        text: 'The ATS insights are clutch. The CTA made it easy to upgrade my resume.',
    },
    {
        name: 'Lina Haddad',
        timestamp: 'Last week',
        text: 'Love the clear layout. Shared it with my colleagues!',
    },
];

const faqItems = [
    {
        question: 'Is it possible to create a resume for Dubai?',
        answer: 'Absolutely. We tune the layout, wording, and details to Dubai hiring expectations while keeping your story authentic.',
    },
    {
        question: 'Are your resumes ATS-friendly?',
        answer: 'Yes. Every template is rebuilt for ATS compatibility with keyword-rich sections, consistent font sizes, and clean markup.',
    },
    {
        question: 'Can I get a PDF/DOCX output?',
        answer: 'You can download your resumed as a polished PDF or editable DOCX once the builder finalizes your new layout.',
    },
    {
        question: 'What features do you offer for collaboration?',
        answer: 'Share editable links, comment on sections, and invite your career coach to co-edit in real time.',
    },
    {
        question: 'Is there a trial period available?',
        answer: 'Try our builder free for 7 days with limited exports to see the impact before committing.',
    },
];

export default function BlogDetailPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [commentName, setCommentName] = useState('');
    const [commentEmail, setCommentEmail] = useState('');
    const [commentText, setCommentText] = useState('');

    const toggleFaqItem = (index: number) => {
        setOpenFaqIndex((prev) => (prev === index ? null : index));
    };

    return (
        <div className={styles.pageShell}>
            <p className={styles.breadcrumb}>Home / Blog</p>
            <section className={styles.heroCard}>
                <div className={styles.heroMediaRow}>
                    <div className={styles.coverImage} role='presentation' />
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarCard}>
                            <Typography variant='h5' color='text.primary' fontWeight='500'>
                                Trending in UAE
                            </Typography>
                            <nav className={styles.sidebarLinks}>
                                {sidebarTopics.map((topic) => (
                                    <a href='#' key={topic} className={styles.sidebarLink}>
                                        {topic}
                                    </a>
                                ))}
                            </nav>
                            <MuiButton size='small' startIcon={<AddIcon />}>
                                Build a Dubai-ready CV
                            </MuiButton>
                        </div>
                    </aside>
                </div>
                <div className={styles.heroContent}>
                    <div className={styles.metadataRow}>
                        <span>Dubai</span>
                        <span>5 min read</span>
                        <span>Published Jan 21, 2026</span>
                    </div>

                    <Typography variant='h4' color='text.primary' fontWeight='500' pt={3}>
                        Build a Dubai-ready resume that clears every filter
                    </Typography>
                </div>
            </section>

            <div className={styles.mainLayout}>
                <div className={styles.blogContent}>
                    <Typography variant='subtitle1' color='text.primary' fontWeight='500'>
                        Dubai recruiters move fast. A clean visual hierarchy, measurable results, and locally preferred
                        keywords can make your credentials impossible to skip.
                    </Typography>
                    <Typography variant='h5' color='text.primary' fontWeight='500'>
                        Resume Tips
                    </Typography>
                    <Typography variant='subtitle1' color='text.primary' fontWeight='500'>
                        A clean visual hierarchy, measurable results, and locally preferred keywords can make your
                        credentials impossible to skip.
                    </Typography>
                    <ol className={styles.tipList}>
                        {resumeTips.map((tip) => (
                            <li key={tip}>{tip}</li>
                        ))}
                    </ol>

                    <div className={styles.ctaBlock}>
                        <div>
                            <h3>Upload your resume</h3>
                            <p>We rebuild your resume with ATS-friendly structure,</p>
                        </div>

                        <MuiButton size='large' startIcon={<AddIcon />}>
                            Build a Dubai-ready CV
                        </MuiButton>
                    </div>

                    <Typography variant='h5' color='text.primary' fontWeight='500'>
                        Resume Tips
                    </Typography>
                    <Typography variant='subtitle1' color='text.primary' fontWeight='500'>
                        A clean visual hierarchy, measurable results, and locally preferred keywords can make your
                        credentials impossible to skip.
                    </Typography>
                    <ol className={styles.tipList}>
                        {resumeTips.map((tip) => (
                            <li key={tip}>{tip}</li>
                        ))}
                    </ol>

                    <div className={styles.ctaBlock}>
                        <div>
                            <h3>Upload your resume</h3>
                            <p>We rebuild your resume with ATS-friendly structure,</p>
                        </div>

                        <MuiButton size='large' startIcon={<AddIcon />}>
                            Build a Dubai-ready CV
                        </MuiButton>
                    </div>
                </div>
            </div>

            <section className={styles.keyTakeaways}>
                <div>
                    <Typography variant='h5' color='text.primary' fontWeight='500' mb={3}>
                        Key Takeaways
                    </Typography>
                    <ul>
                        <li>Keep the resume concise but data-rich for Dubai hiring managers.</li>
                        <li>Keep the resume concise but data-rich for Dubai hiring managers.</li>
                        <li>Keep the resume concise but data-rich for Dubai hiring managers.</li>
                    </ul>
                </div>
            </section>

            <section className={styles.commentsSection}>
                <div className={styles.commentForm}>
                    <h3>Leave a comment</h3>
                    <div className={styles.formFields}>
                        <MuiInput label='Name' placeholder='Your name' value={commentName} onChange={setCommentName} />
                        <MuiInput
                            label='Email'
                            placeholder='you@email.com'
                            value={commentEmail}
                            onChange={setCommentEmail}
                            type='email'
                        />
                        <MuiInput
                            className={styles.commentTextarea}
                            label='Comment'
                            placeholder='Share your thoughts'
                            rows={4}
                            value={commentText}
                            onChange={setCommentText}
                        />
                    </div>
                    <Stack direction='row' justifyContent='flex-end' mt={3}>
                        <MuiButton type='button' size='medium' color='secondary' variant='contained'>
                            Submit
                        </MuiButton>
                    </Stack>
                </div>
                <div className={styles.commentList}>
                    <h3>Comments</h3>
                    {comments.map((item) => (
                        <div key={item.name} className={styles.commentItem}>
                            <div className={styles.avatar} aria-hidden='true'>
                                {item.name.charAt(0)}
                            </div>
                            <div>
                                <div className={styles.commentHeader}>
                                    <strong>{item.name}</strong>
                                    <span>{item.timestamp}</span>
                                </div>
                                <p>{item.text}</p>
                                <div className={styles.commentActions}>
                                    <button type='button'>Like</button>
                                    <button type='button'>Reply</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.faqSection}>
                <h3>FAQ</h3>
                <div className={styles.accordion}>
                    {faqItems.map((faq, index) => (
                        <article key={faq.question} className={styles.accordionItem}>
                            <button
                                type='button'
                                className={styles.accordionHeader}
                                aria-expanded={openFaqIndex === index}
                                onClick={() => toggleFaqItem(index)}
                            >
                                <span>{faq.question}</span>
                                <span className={styles.chevron}>{openFaqIndex === index ? '−' : '+'}</span>
                            </button>
                            {openFaqIndex === index && <p className={styles.accordionPanel}>{faq.answer}</p>}
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
