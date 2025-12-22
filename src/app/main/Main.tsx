'use client';

import type { ElementType, FC } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import Blog from '@/app/main/Blog';
import CraftResume from '@/app/main/CraftResume';
import HeroSection from '@/app/main/HeroSection';
import KeyBenefits from '@/app/main/KeyBenefits';
import Pricing from '@/app/main/Pricing';
import ProductFeatures from '@/app/main/ProductFeatures';
import Footer from '@/components/Layout/Footer';
import Navbar from '@/components/Layout/Navbar';

export default function MinaComponent() {
    return (
        <div>
            <Navbar />
            <main
                style={{
                    width: '100dvw',
                    height: 'fit-content',
                    background: '#fcfbff',
                    paddingBottom: '5rem',
                }}
            >
                <HeroSection />

                <KeyBenefits />

                <CraftResume />

                <ProductFeatures />
                <Pricing />
                <Blog />
                {/*<PricingPlans />*/}
                {/*<Testimonials />*/}
            </main>
            <Footer />
        </div>
    );
}

interface Plan {
    name: string;
    price: number;
    currency: string;
    features: string[];
    isPopular: boolean;
    textSource: string;
}

const PricingPlans: FC = () => {
    const plans: Plan[] = [
        {
            name: 'Basic',
            price: 5,
            currency: 'AED',
            features: ['Quick Resume Builder', 'Modern Templates'],
            isPopular: false,
            textSource: '5 AED [cite: 29]',
        },
        {
            name: 'Premium',
            price: 15,
            currency: 'AED',
            features: ['All Basic Features', 'ATS Score Checker', 'AI Bullet Points'],
            isPopular: true,
            textSource: '15 AED [cite: 38]',
        },
        {
            name: 'Pro',
            price: 30,
            currency: 'AED',
            features: ['All Premium Features', 'Keyword Gap Analyzer', 'AI Cover Letter Writer'],
            isPopular: false,
            textSource: '30 AED [cite: 40]',
        },
    ];

    return (
        <Container sx={{ py: 6 }}>
            <Typography variant='h4' align='center' gutterBottom sx={{ fontWeight: 600 }}>
                [cite_start]Our Plans [cite: 35]
            </Typography>
            <Grid container spacing={4} justifyContent='center'>
                {plans.map((plan, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <PricingCard {...plan} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

interface Testimonial {
    quote: string;
    author: string;
}

interface Feature {
    title: string;
    description: string;
    icon?: ElementType;
}

const Testimonials: FC = () => {
    const testimonials: Testimonial[] = [
        {
            quote: 'Create a professio...e and CV in minutes with 2-CV. The of Iran and Duta featuring advanced afhaal gence [cite: 79]',
            author: 'CEO of Telegram [cite: 80]',
        },
        {
            quote: 'friendy resume et CV meutes with 2-CV. Twilored for the markets of fram and Due Teamuring modem mplates and anсий mega [cite: 82]',
            author: 'CEO of Telegram [cite: 81]',
        },
    ];

    return (
        <Box sx={{ py: 8, backgroundColor: '#f9f9f9' }}>
            <Container>
                <Typography variant='h4' align='center' gutterBottom sx={{ fontWeight: 600 }}>
                    [cite_start]Testimonials [cite: 71]
                </Typography>
                <Grid container spacing={4} justifyContent='center'>
                    {testimonials.map((t, index) => (
                        <Grid size={{ xs: 12, md: 6 }} key={index}>
                            <Card sx={{ p: 3, height: '100%' }}>
                                <CardContent>
                                    <FormatQuoteIcon color='primary' sx={{ fontSize: 40, mb: 2 }} />
                                    <Typography variant='body1' sx={{ fontStyle: 'italic', mb: 2 }}>
                                        "{t.quote}"
                                    </Typography>
                                    <Typography variant='subtitle1' color='text.secondary'>
                                        - {t.author}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

const FeatureItem: FC<Feature> = ({ title, description, icon: IconComponent }) => {
    return (
        <Card variant='outlined' sx={{ height: '100%', p: 2 }}>
            <CardContent>
                {IconComponent && <IconComponent color='primary' sx={{ fontSize: 40 }} />}
                <Typography variant='h6' component='h3' gutterBottom sx={{ mt: 1, fontWeight: 500 }}>
                    {title}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};

const PricingCard: FC<Plan> = ({ name, price, currency, features, isPopular, textSource }) => {
    return (
        <Card
            variant={isPopular ? 'elevation' : 'outlined'}
            sx={{
                height: '100%',
                border: isPopular ? '2px solid' : 'none',
                borderColor: 'primary.main',
                textAlign: 'center',
            }}
        >
            <CardContent>
                {isPopular && (
                    <Typography
                        variant='caption'
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            mb: 1,
                            display: 'inline-block',
                        }}
                    >
                        Most Popular
                    </Typography>
                )}
                <Typography variant='h5' component='h3' sx={{ fontWeight: 600 }} gutterBottom>
                    {name}
                </Typography>
                <Typography variant='h3' color='primary.main' sx={{ my: 2 }}>
                    {price} {currency}
                </Typography>
                <Typography variant='caption' display='block' color='text.secondary' sx={{ mb: 3 }}>
                    {textSource}
                </Typography>

                <Button variant={isPopular ? 'contained' : 'outlined'} color='primary' fullWidth sx={{ mb: 3 }}>
                    [cite_start]Upgrade Now [cite: 42, 45, 53]
                </Button>

                <List dense>
                    {features.map((feature, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <CheckIcon color='success' />
                            </ListItemIcon>
                            <ListItemText primary={feature} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};
