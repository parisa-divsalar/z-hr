export const heroHighlights = [
  {
    title: 'Resume & CV Tips',
    description: 'Build Dubai-ready CVs with ATS-friendly sections recruiters expect.',
    accent: 'linear-gradient(120deg, #4d49fc, #a466ff)',
    icon: '✦',
  },
  {
    title: 'Interview Tips',
    description: 'Prep with modern templates and export-ready formats to impress.',
    accent: 'linear-gradient(120deg, #ff7ebf, #ffb199)',
    icon: '✧',
  },
  {
    title: 'Career Growth',
    description: 'Land roles with actionable guides that spotlight your best skills.',
    accent: 'linear-gradient(120deg, #3dd4bd, #5ddeff)',
    icon: '✔',
  },
];

export const featuredStories = [
  {
    title: 'Crafting Your Perfect Resume in Minutes',
    description: 'Craft your resume in just a few clicks and tailor it for UAE recruiters.',
    meta: 'Dubai · 6 min read · Today',
    tag: 'Resume',
    image: '/images/Maskgroup.jpg',
  },
  {
    title: 'Build a Standout Resume Quickly',
    description: 'Use polished layouts and ATS-friendly wording to make recruiters notice you.',
    meta: 'Dubai · 6 min read · Today',
    tag: 'Interview',
    image: '/images/people-collage.png',
  },
  {
    title: 'Fast and Easy Resume Creation Guide',
    description: 'Get a complete resume in under 10 minutes with guided prompts.',
    meta: 'Dubai · 6 min read · Today',
    tag: 'Career Growth',
    image: '/images/Maskgroup.jpg',
  },
  {
    title: 'Swift Resume Builder: Your Path to Success',
    description: 'Finish your resume in a quick 30 steps curated for professionals.',
    meta: 'Dubai · 5 min read · Today',
    tag: 'Tips',
    image: '/images/people-collage.png',
  },
];

export type TrendingTopic = {
  title: string;
  meta: string;
};

export const trendingTopics: TrendingTopic[] = [
  { title: 'Resume Tips', meta: 'Updated today' },
  { title: 'ATS Insights', meta: '6 min read' },
  { title: 'Format Choices', meta: '7 min read' },
  { title: 'Collaboration Tools', meta: '3 min read' },
  { title: 'Trial Options', meta: '2 min read' },
  { title: 'Interview Prep', meta: 'New' },
  { title: 'Personal Branding', meta: '4 min read' },
];

export type InsightCard = {
  title: string;
  description: string;
  meta: string;
  tag: string;
  image: string;
};

export const insightHighlights: InsightCard[] = [
  {
    title: 'Networking Strategies',
    description: 'Learn how to expand connections while keeping your energy balanced.',
    meta: 'This Month · Dubai',
    tag: 'Networking',
    image: '/images/Maskgroup.jpg',
  },
  {
    title: 'Skill Development Courses',
    description: 'Explore curated courses focused on technical and soft-skills growth.',
    meta: 'This Week · Dubai',
    tag: 'Career Growth',
    image: '/images/people-collage.png',
  },
  {
    title: 'Work-Life Balance',
    description: 'Practical steps for creating healthy rhythms between focus and rest.',
    meta: 'This Week · Remote',
    tag: 'Wellbeing',
    image: '/images/Maskgroup.jpg',
  },
  {
    title: 'Personal Branding Basics',
    description: 'Shape an online presence that mirrors your professionalism and style.',
    meta: 'New · Dubai',
    tag: 'Branding',
    image: '/images/people-collage.png',
  },
];

export const categories = ['All', 'Resume', 'Interview', 'Career Growth', 'Networking'];

export type BlogArticle = {
  title: string;
  description: string;
  meta: string;
  category: string;
  image: string;
};

export const blogArticles: BlogArticle[] = [
  {
    title: 'Resume Tips',
    description:
      'Explore essential tips for crafting a standout resume that earns attention across industries.',
    meta: 'This Month · Dubai',
    category: 'Resume',
    image: '/images/people-collage.png',
  },
  {
    title: 'Cover Letter Guide',
    description:
      'Discover how to frame a compelling cover letter that complements your resume and highlights your fit.',
    meta: 'This Week · Dubai',
    category: 'Career Growth',
    image: '/images/Maskgroup.jpg',
  },
  {
    title: 'Interview Techniques',
    description:
      'Master conversation strategies, follow-ups, and the confidence you need for the next call.',
    meta: 'Last Week · Dubai',
    category: 'Interview',
    image: '/images/Maskgroup.jpg',
  },
  {
    title: 'Job Market Trends',
    description:
      'Stay updated on hiring signals, fast-growing skills, and what employers seek in UAE markets.',
    meta: 'This Month · Dubai',
    category: 'Career Growth',
    image: '/images/people-collage.png',
  },
  {
    title: 'Networking Strategies',
    description:
      'Learn how to expand your network, nurture relationships, and unlock career opportunities.',
    meta: 'This Month · Dubai',
    category: 'Networking',
    image: '/images/Maskgroup.jpg',
  },
  {
    title: 'Skill Development Courses',
    description:
      'Find curated courses to sharpen technical and soft skills that recruiters praise.',
    meta: 'This Week · Dubai',
    category: 'Career Growth',
    image: '/images/people-collage.png',
  },
  {
    title: 'Remote Work Practices',
    description:
      'Adopt healthy routines when working remotely and stay connected with your team.',
    meta: 'This Week · Remote',
    category: 'Career Growth',
    image: '/images/Maskgroup.jpg',
  },
  {
    title: 'Freelancing Insights',
    description:
      'Insights on pricing, pitching, and retaining clients while managing your time.',
    meta: 'This Month · Dubai',
    category: 'Career Growth',
    image: '/images/people-collage.png',
  },
  {
    title: 'Interview Follow-Ups',
    description:
      'How to structure follow-up notes that reinforce your enthusiasm and readiness.',
    meta: 'Last Week · Dubai',
    category: 'Interview',
    image: '/images/Maskgroup.jpg',
  },
];

