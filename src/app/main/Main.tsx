'use client';

import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import ATSImage from '@/assets/images/main/ats.png';
import AITextImage from '@/assets/images/main/ai-text.png';
import KeywordImage from '@/assets/images/main/keyword.png';
import AICoverImage from '@/assets/images/main/ai-cover.png';
import ATSScoreImage from '@/assets/images/main/ats-score.png';
import AIBulletImage from '@/assets/images/main/ai-bullet.png';
import OneClickImage from '@/assets/images/main/one-click.png';
import ModernATSImage from '@/assets/images/main/modern-ats.png';
import MiddleEastImage from '@/assets/images/main/middle-east.png';
import QuickResumeImage from '@/assets/images/main/quick-resume.png';
import JobOpportunityImage from '@/assets/images/main/job-opportunity.png';
import { FC } from 'react';
import Image, { StaticImageData } from 'next/image';
import { ListAlt, CheckCircleOutline, Search, Layers, MailOutline, CloudUpload } from '@mui/icons-material';
import {
    Grid,
    Typography,
    Container,
    Box,
    Divider,
    Button,
    styled,
    CardContent,
    Card,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';

export default function MinaComponent() {
    return (
        <div>
            <Navbar />
            <main
                style={{
                    width: '100dvw !important',
                    height: 'fit-content',
                    background: '#fcfbff',
                    paddingBottom: '5rem',
                }}
            >
                <HeroSection />

                <KeyBenefits />

                <CraftResume />

                <ProductFeatures />

                {/* 


            <Divider sx={{ my: 6 }} />

            <PricingPlans />

            <Testimonials /> */}
            </main>
            <Footer />
        </div>
    );
}

// /////////////////////////////////////////////////////////
const HeroSection: FC = () => {
    const HeroWrapper = styled(Box)(({ theme }) => ({
        textAlign: 'center',
        padding: theme.spacing(8, 0),
        backgroundImage: 'url(/images/mask-group.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: theme.palette.secondary.main,
        height: '750px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    return (
        <HeroWrapper>
            <Container maxWidth='md'>
                <Typography variant='h2' color='secondary.main' fontWeight={'700'} mb={'1rem'}>
                    Professional & ATS-friendly Resume
                </Typography>

                <Typography variant='h5' color='secondary.main' fontWeight={'500'}>
                    Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
                </Typography>

                <Typography variant='h5' color='secondary.main' fontWeight={'500'}>
                    Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                    intelligence.
                </Typography>

                <Button variant='contained' color='secondary' size='large' sx={{ marginTop: '3rem' }}>
                    Get Started Free
                </Button>
            </Container>
        </HeroWrapper>
    );
};

// /////////////////////////////////////////////////////////
interface Benefit {
    title: string;
    description: string;
    image: StaticImageData;
}
const KeyBenefits: FC = () => {
    const benefits: Benefit[] = [
        {
            title: 'Quick Resume Builder',
            description: 'In 30 seconds, you have a complete resume.',
            image: QuickResumeImage,
        },
        {
            title: 'Job Opportunity Boost',
            description: 'Enhance your chances for better job prospects.',
            image: JobOpportunityImage,
        },
        {
            title: 'AI Text Generation',
            description: 'No need to write from scratch, AI generates the text.',
            image: AITextImage,
        },
        {
            title: 'Middle East Focus',
            description: 'Tailored for the Iranian and Dubai markets (Localization).',
            image: MiddleEastImage,
        },
    ];

    return (
        <Container>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'start' }}>
                    <Typography variant='h5' color='secondary.main' fontWeight={'700'} fontSize={'2.25rem'}>
                        Key Benefits
                    </Typography>

                    <Typography variant='subtitle1' color='secondary.main' fontWeight={'500'}>
                        Create a professional and ATS-friendly resume and CV in minutes with Z-CV. Tailored for the
                        markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.
                    </Typography>

                    <Button variant='contained' color='secondary' size='medium'>
                        Get Started Free
                    </Button>
                </div>

                <div
                    style={{
                        gap: '2rem',
                        height: '354',
                        display: 'flex',
                        padding: '40px',
                        background: 'white',
                        alignItems: 'center',
                        borderRadius: '24px',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: '2px solid #F0F0F2',
                    }}
                >
                    <Typography variant='h5' color='secondary.main' fontWeight={'584'}>
                        ATS-Friendly Resume
                    </Typography>

                    <Typography variant='subtitle1' color='secondary.main' fontWeight={'492'}>
                        Your resume won't be rejected by ATS
                    </Typography>

                    <Image alt='ats' width={200} height={157} src={ATSImage} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginTop: '5rem' }}>
                {benefits.map((benefit, index) => (
                    <div
                        key={index}
                        style={{
                            gap: '2rem',
                            height: '354',
                            display: 'flex',
                            background: 'white',
                            padding: '40px 24px',
                            alignItems: 'center',
                            borderRadius: '24px',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            border: '2px solid #F0F0F2',
                        }}
                    >
                        <Typography variant='h5' color='secondary.main' fontWeight={'584'} textAlign={'center'}>
                            {benefit.title}
                        </Typography>

                        <Typography variant='subtitle1' color='secondary.main' fontWeight={'492'} textAlign={'center'}>
                            {benefit.description}
                        </Typography>

                        <Image alt='ats' width={182} height={157} src={benefit.image} />
                    </div>
                ))}
            </div>
        </Container>
    );
};

// /////////////////////////////////////////////////////////
const CraftResume: FC = () => {
    const HeroWrapper = styled(Box)(({ theme }) => ({
        textAlign: 'center',
        padding: theme.spacing(8, 0),
        backgroundImage: 'url(/images/people-collage.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: theme.palette.secondary.main,
        height: '437px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5rem',
    }));

    return (
        <HeroWrapper>
            <Container
                maxWidth='md'
                sx={{ gap: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Typography variant='h2' color='secondary.main' fontWeight={'700'} fontSize={'2.25rem'}>
                    Craft Your Dream Resume Today!
                </Typography>

                <Typography variant='subtitle1' color='secondary.main' fontWeight={'492'}>
                    Z-CV has helped create over 10,000 resumes from all around the world Our platform is here for job
                    seekers everywhere, making it easy to build the perfect resume. Join the thousands who’ve already
                    taken advantage of our cool resume-building tools!
                </Typography>

                <Button variant='contained' color='secondary' size='large' sx={{ marginTop: '3rem' }}>
                    Get Started Free
                </Button>
            </Container>
        </HeroWrapper>
    );
};

// /////////////////////////////////////////////////////////
interface Feature {
    title: string;
    description: string;
    image: StaticImageData;
}
const ProductFeatures: FC = () => {
    const features: Feature[] = [
        {
            title: 'AI Bullet Points Generator',
            description: 'Effortlessly create bullet points with our AI tool for quick writing.',
            image: AIBulletImage,
        },
        {
            title: 'ATS Score Checker',
            description: "Check your resume's ATS compatibility with our score checker for better applications.",
            image: ATSScoreImage,
        },
        {
            title: 'Keyword Gap Analyzer',
            description: 'Uncover keyword opportunities with our tool that spots gaps in your content strategy.',
            image: KeywordImage,
        },
        {
            title: 'Modern ATS-Friendly Templates',
            description: 'Explore stylish templates that pass ATS checks and make your resume shine.',
            image: ModernATSImage,
        },
        {
            title: 'AI Cover Letter Writer',
            description: 'Easily craft personalized cover letters with our AI creator for job applications.',
            image: ATSScoreImage,
        },
        {
            title: 'One-Click Job Description Import',
            description: 'Seamlessly import job descriptions to streamline your hiring process.',
            image: OneClickImage,
        },
    ];

    return (
        <Container sx={{ mt: '5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                <Typography variant='h2' color='secondary.main' fontWeight={'700'}>
                    Product Features
                </Typography>

                <Typography variant='subtitle1' color='secondary.main' fontWeight={'500'} textAlign={'center'}>
                    Create a professional and ATS-friendly resume and CV in minutes with Z-CV.
                    <Typography variant='subtitle1' color='secondary.main' fontWeight={'500'} textAlign={'center'}>
                        Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial
                        intelligence.
                    </Typography>
                </Typography>

                <Button variant='contained' color='secondary' size='medium'>
                    Get Started Free
                </Button>
            </div>
            <div
                style={{
                    gap: '0',
                    display: 'grid',
                    marginTop: '5rem',
                    borderRadius: '24px',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    overflow: 'hidden',
                    boxShadow: '0 0 10px 2px #F0F0F2',
                }}
            >
                {features.map((feature, index) => (
                    <div
                        key={index}
                        style={{
                            gap: '1rem',
                            height: '354',
                            display: 'flex',
                            background: 'white',
                            padding: '40px 24px',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            border: '0.5px solid #F0F0F2',
                        }}
                    >
                        <Image alt='ats' width={100} height={100} src={feature.image} />

                        <Typography variant='h5' color='secondary.main' fontWeight={'584'} textAlign={'center'}>
                            {feature.title}
                        </Typography>

                        <Typography variant='subtitle1' color='secondary.main' fontWeight={'492'} textAlign={'center'}>
                            {feature.description}
                        </Typography>
                    </div>
                ))}
            </div>
        </Container>
    );
};

// /////////////////////////////////////////////////////////
// interface Plan {
//     name: string;
//     price: number;
//     currency: string;
//     features: string[];
//     isPopular: boolean;
//     textSource: string;
// }

// const PricingPlans: FC = () => {
//     const plans: Plan[] = [
//         {
//             name: 'Basic',
//             price: 5,
//             currency: 'AED',
//             features: ['Quick Resume Builder', 'Modern Templates'],
//             isPopular: false,
//             textSource: '5 AED [cite: 29]',
//         },
//         {
//             name: 'Premium',
//             price: 15,
//             currency: 'AED',
//             features: ['All Basic Features', 'ATS Score Checker', 'AI Bullet Points'],
//             isPopular: true,
//             textSource: '15 AED [cite: 38]',
//         },
//         {
//             name: 'Pro',
//             price: 30,
//             currency: 'AED',
//             features: ['All Premium Features', 'Keyword Gap Analyzer', 'AI Cover Letter Writer'],
//             isPopular: false,
//             textSource: '30 AED [cite: 40]',
//         },
//     ];

//     return (
//         <Container sx={{ py: 6 }}>
//             <Typography variant='h4' align='center' gutterBottom sx={{ fontWeight: 600 }}>
//                 [cite_start]Our Plans [cite: 35]
//             </Typography>
//             <Grid container spacing={4} justifyContent='center'>
//                 {plans.map((plan, index) => (
//                     <Grid item xs={12} sm={6} md={4} key={index}>
//                         <PricingCard {...plan} />
//                     </Grid>
//                 ))}
//             </Grid>
//         </Container>
//     );
// };

// interface Testimonial {
//     quote: string;
//     author: string;
// }

// const Testimonials: FC = () => {
//     const testimonials: Testimonial[] = [
//         {
//             quote: 'Create a professio...e and CV in minutes with 2-CV. The of Iran and Duta featuring advanced afhaal gence [cite: 79]',
//             author: 'CEO of Telegram [cite: 80]',
//         },
//         {
//             quote: 'friendy resume et CV meutes with 2-CV. Twilored for the markets of fram and Due Teamuring modem mplates and anсий mega [cite: 82]',
//             author: 'CEO of Telegram [cite: 81]',
//         },
//     ];

//     return (
//         <Box sx={{ py: 8, backgroundColor: '#f9f9f9' }}>
//             <Container>
//                 <Typography variant='h4' align='center' gutterBottom sx={{ fontWeight: 600 }}>
//                     [cite_start]Testimonials [cite: 71]
//                 </Typography>
//                 <Grid container spacing={4} justifyContent='center'>
//                     {testimonials.map((t, index) => (
//                         <Grid item xs={12} md={6} key={index}>
//                             <Card sx={{ p: 3, height: '100%' }}>
//                                 <CardContent>
//                                     <FormatQuoteIcon color='primary' sx={{ fontSize: 40, mb: 2 }} />
//                                     <Typography variant='body1' sx={{ fontStyle: 'italic', mb: 2 }}>
//                                         "{t.quote}"
//                                     </Typography>
//                                     <Typography variant='subtitle1' color='text.secondary'>
//                                         - {t.author}
//                                     </Typography>
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//                     ))}
//                 </Grid>
//             </Container>
//         </Box>
//     );
// };

// const FeatureItem: FC<Feature> = ({ title, description, icon: IconComponent }) => {
//     return (
//         <Card variant='outlined' sx={{ height: '100%', p: 2 }}>
//             <CardContent>
//                 {IconComponent && <IconComponent color='primary' sx={{ fontSize: 40 }} />}
//                 <Typography variant='h6' component='h3' gutterBottom sx={{ mt: 1, fontWeight: 500 }}>
//                     {title}
//                 </Typography>
//                 <Typography variant='body2' color='text.secondary'>
//                     {description}
//                 </Typography>
//             </CardContent>
//         </Card>
//     );
// };

// const PricingCard: FC<Plan> = ({ name, price, currency, features, isPopular, textSource }) => {
//     return (
//         <Card
//             variant={isPopular ? 'elevation' : 'outlined'}
//             sx={{
//                 height: '100%',
//                 border: isPopular ? '2px solid' : 'none',
//                 borderColor: 'primary.main',
//                 textAlign: 'center',
//             }}
//         >
//             <CardContent>
//                 {isPopular && (
//                     <Typography
//                         variant='caption'
//                         sx={{
//                             backgroundColor: 'primary.main',
//                             color: 'white',
//                             borderRadius: 1,
//                             px: 1,
//                             py: 0.5,
//                             mb: 1,
//                             display: 'inline-block',
//                         }}
//                     >
//                         Most Popular
//                     </Typography>
//                 )}
//                 <Typography variant='h5' component='h3' sx={{ fontWeight: 600 }} gutterBottom>
//                     {name}
//                 </Typography>
//                 <Typography variant='h3' color='primary.main' sx={{ my: 2 }}>
//                     {price} {currency}
//                 </Typography>
//                 <Typography variant='caption' display='block' color='text.secondary' sx={{ mb: 3 }}>
//                     {textSource}
//                 </Typography>

//                 <Button variant={isPopular ? 'contained' : 'outlined'} color='primary' fullWidth sx={{ mb: 3 }}>
//                     [cite_start]Upgrade Now [cite: 42, 45, 53]
//                 </Button>

//                 <List dense>
//                     {features.map((feature, index) => (
//                         <ListItem key={index}>
//                             <ListItemIcon>
//                                 <CheckIcon color='success' />
//                             </ListItemIcon>
//                             <ListItemText primary={feature} />
//                         </ListItem>
//                     ))}
//                 </List>
//             </CardContent>
//         </Card>
//     );
// };
