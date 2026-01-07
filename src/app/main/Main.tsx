'use client';

import Blog from '@/app/main/Blog';
import CraftResume from '@/app/main/CraftResume';
import Faq from '@/app/main/Faq';
import FooterMain from '@/app/main/FooterMain';
import HeroSection from '@/app/main/HeroSection';
import KeyBenefits from '@/app/main/KeyBenefits';
import Pricing from '@/app/main/Pricing';
import ProductFeatures from '@/app/main/ProductFeatures';
import Testimonials from '@/app/main/Testimonials';
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
                <Faq />
                <Testimonials />
                <FooterMain />
            </main>
        </div>
    );
}
