'use client';

import { useEffect, useMemo, useState } from 'react';

import {  Typography } from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { BlogArticle } from '@shared/blog/repository';

import AddIcon from '@/assets/images/icons/add.svg';
import MuiButton from '@/components/UI/MuiButton';
import { getMainTranslations } from '@/locales/main';
import { useLocaleStore } from '@/store/common';

import styles from './page.module.css';

export default function BlogDetailPage() {
    const locale = useLocaleStore((s) => s.locale);
    const dir = locale === 'fa' ? 'rtl' : 'ltr';
    const mainT = getMainTranslations(locale);
    const t = mainT.blogDetails;
    const navT = mainT.nav;
    const categoryLabels = mainT.blogPage.categoryLabels ?? {};

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
                    throw new Error('DETAILS_LOAD_ERROR');
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
                setErrorMessage(selectedArticle ? null : 'NO_ARTICLES');
            } catch {
                if (!mounted) {
                    return;
                }
                setArticle(null);
                setErrorMessage('DETAILS_LOAD_ERROR');
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

    const displayArticle = useMemo(() => {
        if (!article) return null;
        const isFa = locale === 'fa';
        const title = isFa && article.titleFa ? article.titleFa : article.title;
        const shortTitle = isFa && article.shortTitleFa ? article.shortTitleFa : article.shortTitle;
        const description = isFa && article.descriptionFa ? article.descriptionFa : article.description;
        const meta = isFa && article.metaFa ? article.metaFa : article.meta;
        const keyTakeaways = isFa && article.keyTakeawaysFa?.length
            ? article.keyTakeawaysFa
            : article.keyTakeaways;
        const hasFaContent = Boolean(article.titleFa || article.descriptionFa);
        const contentDir: 'rtl' | 'ltr' = (locale === 'fa' && hasFaContent) ? 'rtl' : 'ltr';
        const contentAlign: 'right' | 'left' = contentDir === 'rtl' ? 'right' : 'left';
        return {
            title,
            shortTitle,
            description,
            meta,
            keyTakeaways,
            contentDir,
            contentAlign,
        };
    }, [article, locale]);

    const articleParagraphs = useMemo(() => {
        if (!displayArticle?.description) {
            return [];
        }
        return displayArticle.description
            .split(/\n+/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean);
    }, [displayArticle?.description]);

    const keyTakeaways = useMemo(() => {
        if (displayArticle?.keyTakeaways && displayArticle.keyTakeaways.length) {
            return displayArticle.keyTakeaways;
        }
        return articleParagraphs.slice(0, 3);
    }, [displayArticle?.keyTakeaways, articleParagraphs]);
    const heroImage = article?.banner || article?.image || '/images/Maskgroup.jpg';

    const toggleFaqItem = (index: number) => {
        setOpenFaqIndex((prev) => (prev === index ? null : index));
    };

    const displayError = () => {
        if (errorMessage === 'NO_ARTICLES') return t.noArticles;
        return t.errorLoadGeneric;
    };

    if (isLoading) {
        return (
            <div className={styles.pageShell} dir={dir} style={{ direction: dir }}>
                <p className={styles.breadcrumb}>
                    {t.home} / <Link href='/blog'>{navT.blog}</Link>
                </p>
                <p className='text-sm text-gray-500'>{t.loadingArticle}</p>
            </div>
        );
    }

    if (errorMessage || !article) {
        return (
            <div className={styles.pageShell} dir={dir} style={{ direction: dir }}>
                <p className={styles.breadcrumb}>
                    <Link href='/blog'>{navT.blog}</Link> {t.breadcrumbSep} {t.details}
                </p>
                <p className='text-sm text-gray-500' role='alert'>
                    {errorMessage ? displayError() : t.noArticle}
                </p>
            </div>
        );
    }

    return (
        <div className={styles.pageShell} dir={dir} style={{ direction: dir }}>
            <p className={styles.breadcrumb}>
                <Link href='/blog'>{navT.blog}</Link>
                {t.breadcrumbSep}
                {t.details}
            </p>
            <section className={styles.heroCard}>
                <div
                    className={styles.heroMediaRow}
                    style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : undefined }}
                >
                    <div
                        className={styles.coverImage}
                        style={{
                            backgroundImage: `linear-gradient(120deg, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.1)), url('${heroImage}')`,
                        }}
                        role='presentation'
                    />
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarCard}>
                            <Typography
                                variant='h5'
                                color='text.primary'
                                fontWeight='500'
                                sx={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}
                            >
                                {t.trendingInUae}
                            </Typography>
                            <nav className={styles.sidebarLinks}>
                                {t.sidebarTopics.map((topic) => (
                                    <a href='#' key={topic} className={styles.sidebarLink}>
                                        {topic}
                                    </a>
                                ))}
                            </nav>
                            <MuiButton size='small' startIcon={<AddIcon />}>
                                {t.buildCv}
                            </MuiButton>
                        </div>
                    </aside>
                </div>
                <div className={styles.heroContent}>
                    <div
                        className={styles.metadataRow}
                        style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}
                    >
                        <span>{categoryLabels[article.category] ?? article.category}</span>
                        <span>{t.minRead}</span>
                        <span>{displayArticle!.meta}</span>
                    </div>

                    <Typography
                        variant='h4'
                        color='text.primary'
                        fontWeight='500'
                        pt={3}
                        sx={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}
                    >
                        {displayArticle!.title}
                    </Typography>
                </div>
            </section>

            <div className={styles.mainLayout}>
                <div className={styles.blogContent} dir={displayArticle!.contentDir} style={{ direction: displayArticle!.contentDir }}>
                    <Typography
                        variant='subtitle1'
                        color='text.primary'
                        fontWeight='500'
                        sx={{ textAlign: displayArticle!.contentAlign }}
                    >
                        {displayArticle!.shortTitle || t.whyMatters(displayArticle!.title)}
                    </Typography>
                    {articleParagraphs.length ? (
                        articleParagraphs.map((paragraph, index) => (
                            <Typography
                                key={`${paragraph}-${index}`}
                                variant='body1'
                                className={styles.introParagraph}
                                sx={{ textAlign: displayArticle!.contentAlign }}
                            >
                                {paragraph}
                            </Typography>
                        ))
                    ) : (
                        <Typography
                            className={styles.introParagraph}
                            variant='body1'
                            sx={{ textAlign: displayArticle!.contentAlign }}
                        >
                            {t.fullTextPlaceholder}
                        </Typography>
                    )}
                    <div
                        className={styles.ctaBlock}
                        style={{
                            flexDirection: dir === 'rtl' ? 'row-reverse' : 'row',
                            textAlign: displayArticle!.contentAlign,
                        }}
                    >
                        <div>
                            <h3 style={{ textAlign: displayArticle!.contentAlign }}>
                                {displayArticle!.meta || t.applyInsights}
                            </h3>
                            <p style={{ textAlign: displayArticle!.contentAlign }}>
                                {t.useInsights(article.category)}
                            </p>
                        </div>

                        <MuiButton size='large' startIcon={<AddIcon />}>
                            {t.buildCv}
                        </MuiButton>
                    </div>
                </div>
            </div>

            <section className={styles.keyTakeaways} dir={displayArticle!.contentDir} style={{ direction: displayArticle!.contentDir }}>
                <div>
                    <Typography
                        variant='h5'
                        color='text.primary'
                        fontWeight='500'
                        mb={3}
                        sx={{ textAlign: displayArticle!.contentAlign }}
                    >
                        {t.keyTakeaways}
                    </Typography>
                    <ul style={{ paddingLeft: displayArticle!.contentDir === 'rtl' ? undefined : '1.25rem', paddingRight: displayArticle!.contentDir === 'rtl' ? '1.25rem' : undefined }}>
                        {keyTakeaways.length ? (
                            keyTakeaways.map((item, index) => (
                                <li key={`${item}-${index}`} style={{ textAlign: displayArticle!.contentAlign }}>
                                    {item}
                                </li>
                            ))
                        ) : (
                            <li style={{ textAlign: displayArticle!.contentAlign }}>
                                {t.moreInsightsPlaceholder}
                            </li>
                        )}
                    </ul>
                </div>
            </section>

{/*            <section className={styles.commentsSection} dir={dir}>*/}
{/*                <div className={styles.commentForm}>*/}
{/*                    <h3 className={styles.sectionTitleRtl} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>{t.leaveComment}</h3>*/}
{/*                    <div className={styles.formFields}>*/}
{/*                        <MuiInput*/}
{/*                            label={t.name}*/}
{/*                            placeholder={t.namePlaceholder}*/}
{/*                            value={commentName}*/}
{/*                            onChange={setCommentName}*/}
{/*                        />*/}
{/*                        <MuiInput*/}
{/*                            label={t.email}*/}
{/*                            placeholder={t.emailPlaceholder}*/}
{/*                            value={commentEmail}*/}
{/*                            onChange={setCommentEmail}*/}
{/*                            type='email'*/}
{/*                        />*/}
{/*                        <MuiInput*/}
{/*                            className={styles.commentTextarea}*/}
{/*                            label={t.comment}*/}
{/*                            placeholder={t.commentPlaceholder}*/}
{/*                            rows={4}*/}
{/*                            value={commentText}*/}
{/*                            onChange={setCommentText}*/}
{/*                        />*/}
{/*                    </div>*/}
{/*                    <Stack*/}
{/*                        direction={dir === 'rtl' ? 'row-reverse' : 'row'}*/}
{/*                        justifyContent={dir === 'rtl' ? 'flex-start' : 'flex-end'}*/}
{/*                        mt={3}*/}
{/*                    >*/}
{/*                        <MuiButton type='button' size='medium' color='secondary' variant='contained'>*/}
{/*                            {t.submit}*/}
{/*                        </MuiButton>*/}
{/*                    </Stack>*/}
{/*                </div>*/}
{/*                <div className={styles.commentList}>*/}
{/*                    <h3 style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>{t.comments}</h3>*/}
{/*                    {t.commentList.map((item) => (*/}
{/*                        <div*/}
{/*                            key={item.name}*/}
{/*                            className={styles.commentItem}*/}
{/*                            style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}*/}
{/*                        >*/}
{/*                            <div className={styles.avatar} aria-hidden='true'>*/}
{/*                                {item.name.charAt(0)}*/}
{/*                            </div>*/}
{/*<div style={{ textAlign: dir === 'rtl' ? 'right' : 'left', direction: dir }}>*/}
{/*                                    <div*/}
{/*                                        className={styles.commentHeader}*/}
{/*                                        style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}*/}
{/*                                    >*/}
{/*                                        <strong>{item.name}</strong>*/}
{/*                                        <span>{item.timestamp}</span>*/}
{/*                                    </div>*/}
{/*                                    <p>{item.text}</p>*/}
{/*                                    <div*/}
{/*                                        className={styles.commentActions}*/}
{/*                                        style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}*/}
{/*                                    >*/}
{/*                                        <button type='button'>{t.like}</button>*/}
{/*                                        <button type='button'>{t.reply}</button>*/}
{/*                                    </div>*/}
{/*                                </div>*/}
{/*                        </div>*/}
{/*                    ))}*/}
{/*                </div>*/}
{/*            </section>*/}

            <section className={styles.faqSection} dir={dir}>
                <h3 className={`${styles.sectionTitleRtl} ${styles.faqSectionTitle}`} style={{ textAlign: dir === 'rtl' ? 'right' : 'left', width: '100%' }}>{t.faq}</h3>
                <div className={styles.accordion}>
                    {t.faqItems.map((faq, index) => (
                        <article key={faq.question} className={styles.accordionItem}>
                            <button
                                type='button'
                                className={styles.accordionHeader}
                                style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}
                                aria-expanded={openFaqIndex === index}
                                onClick={() => toggleFaqItem(index)}
                            >
                                <span
                                    className={styles.accordionQuestion}
                                    style={{
                                        textAlign: dir === 'rtl' ? 'right' : 'left',
                                        direction: dir === 'rtl' ? 'rtl' : 'ltr',
                                    }}
                                >
                                    {faq.question}
                                </span>
                                <span className={styles.chevron}>{openFaqIndex === index ? '−' : '+'}</span>
                            </button>
                            {openFaqIndex === index && (
                                <p
                                    className={styles.accordionPanel}
                                    style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}
                                >
                                    {faq.answer}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
