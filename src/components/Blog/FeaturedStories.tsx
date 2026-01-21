'use client';

import ImageCardSlider from '@/components/Blog/ImageCardSlider';
import { BlogSection } from '@/components/Blog/ImageCardSlider.styles';

export default function FeaturedStories() {
    return (
        <BlogSection gap={2}>
            <ImageCardSlider />
        </BlogSection>
    );
}
