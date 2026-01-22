'use client';

import { useEffect, useMemo, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import { BlogArticle } from '@shared/blog/repository';

import AddIcon from '@/assets/images/icons/add.svg';
import MuiButton from '@/components/UI/MuiButton';
import MuiInput from '@/components/UI/MuiInput';

import styles from './page.module.css';

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
    const searchParams = useSearchParams();
    const indexParam = searchParams.get('index') ?? '';
    const [article, setArticle] = useState<BlogArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [commentName, setCommentName] = useState('');
    const [commentEmail, setCommentEmail] = useState('');
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        let mounted = true;

        const fetchArticle = async () => {
            setIsLoading(true);

            try {
                const response = await fetch('/api/blog/articles');
                if (!response.ok) {
                    throw new Error('Unable to load the requested article.');
                }
                const data = (await response.json()) as BlogArticle[];
                const requestedIndex = Number(indexParam);
                const hasIndex =
                    Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < data.length;
                const selectedArticle = data[hasIndex ? requestedIndex : 0] ?? null;
                if (!mounted) {
                    return;
                }
                setArticle(selectedArticle);
                setErrorMessage(selectedArticle ? null : 'No articles have been published yet.');
            } catch (error) {
                if (!mounted) {
                    return;
                }
                setArticle(null);
                setErrorMessage((error as Error).message || 'Unable to load the article.');
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchArticle();

        return () => {
            mounted = false;
        };
    }, [indexParam]);

    const articleParagraphs = useMemo(() => {
        if (!article?.description) {
            return [];
        }
        return article.description
            .split(/\n+/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean);
    }, [article?.description]);

    const keyTakeaways = useMemo(() => {
        if (article?.keyTakeaways && article.keyTakeaways.length) {
            return article.keyTakeaways;
        }
        return articleParagraphs.slice(0, 3);
    }, [article?.keyTakeaways, articleParagraphs]);
    const heroImage = article?.banner || article?.image || '/images/Maskgroup.jpg';

    const toggleFaqItem = (index: number) => {
        setOpenFaqIndex((prev) => (prev === index ? null : index));
    };

    if (isLoading) {
        return (
            <div className={styles.pageShell}>
                <p className={styles.breadcrumb}>Home / Blog</p>
                <p className='text-sm text-gray-500'>در حال بارگذاری مقاله...</p>
            </div>
        );
    }

    if (errorMessage || !article) {
        return (
            <div className={styles.pageShell}>
                <p className={styles.breadcrumb}>Home / Blog</p>
                <p className='text-sm text-gray-500' role='alert'>
                    {errorMessage || 'No article available yet.'}
                </p>
            </div>
        );
    }

    return (
        <div className={styles.pageShell}>
            <p className={styles.breadcrumb}>Home / Blog</p>
            <section className={styles.heroCard}>
                <div className={styles.heroMediaRow}>
                    <div
                        className={styles.coverImage}
                        style={{
                            backgroundImage: `linear-gradient(120deg, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.1)), url('${heroImage}')`,
                        }}
                        role='presentation'
                    />
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
                        <span>{article.category}</span>
                        <span>5 min read</span>
                        <span>{article.meta}</span>
                    </div>

                    <Typography variant='h4' color='text.primary' fontWeight='500' pt={3}>
                        {article.title}
                    </Typography>
                </div>
            </section>

            <div className={styles.mainLayout}>
                <div className={styles.blogContent}>
                    <Typography variant='subtitle1' color='text.primary' fontWeight='500'>
                        {article.shortTitle || `Why ${article.title} matters`}
                    </Typography>
                    {articleParagraphs.length ? (
                        articleParagraphs.map((paragraph, index) => (
                            <Typography key={`${paragraph}-${index}`} variant='body1' className={styles.introParagraph}>
                                {paragraph}
                            </Typography>
                        ))
                    ) : (
                        <Typography className={styles.introParagraph} variant='body1'>
                            The full article text will appear once it is published.
                        </Typography>
                    )}
                    <div className={styles.ctaBlock}>
                        <div>
                            <h3>{article.meta || 'Apply these insights'}</h3>
                            <p>{`Use these ${article.category.toLowerCase()} insights when you build your Dubai-ready CV.`}</p>
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
                        {keyTakeaways.length ? (
                            keyTakeaways.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)
                        ) : (
                            <li>More insights will appear here after the article is published.</li>
                        )}
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
