import type { Locale } from '@/store/common/type';

const tagline =
  'Create a professional and ATS-friendly resume and CV in minutes with Z-CV. Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.';

export const mainTranslations = {
  en: {
    nav: {
      home: 'Home',
      cvResumeBuilder: 'CV/Resume Builder',
      pricing: 'Pricing',
      blog: 'Blog',
      faq: 'FAQ',
      contactUs: 'Contact Us',
      aboutUs: 'About Us',
      ourPlans: 'Our Plans',
    },
    hero: {
      title: 'Professional & ATS-friendly Resume',
      subtitle: 'Create a professional and ATS-friendly resume and CV in minutes with Z-CV.',
      tagline:
        'Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.',
      getStarted: 'Get Started Free',
      firstStep: 'First Step',
      answerQuestions: 'Answer questions',
      secondStep: 'Second Step',
      reviewSubmit: 'Review and Submit',
      finalStep: 'Final Step',
      downloadResume: 'Download a resume',
    },
    keyBenefits: {
      title: 'Key Benefits',
      intro: tagline,
      getStarted: 'Get Started Free',
      dubaiCvTitle: 'Dubai & UAE CV Format, Ready to Submit',
      dubaiCvDesc:
        'Build a Dubai-ready CV that matches UAE resume format expectations, from layout to recruiter-friendly',
      benefits: [
        {
          title: 'ATS-Friendly Resume That Gets Past Filters',
          description:
            'Create an ATS-friendly resume designed to pass automated screening and stay readable for real hiring managers',
        },
        {
          title: 'Tailor Your Resume to Any Job Description',
          description:
            'Tailor your resume to match the Job Description (JD) to highlight your relevant skills and experience.',
        },
        {
          title: 'AI Resume Builder, Done in Minutes',
          description:
            'Use an AI Resume Builder to generate a polished, professional resume without starting from scratch',
        },
        {
          title: 'Keyword Optimization for Higher Visibility',
          description:
            'Find missing keywords with a Keyword Gap approach so your resume matches UAE job posts more accurately',
        },
      ],
    },
    ourFeatures: {
      title: 'Our Features',
      intro: tagline,
      description:
        'Please provide details about your current visa status and the languages you speak fluently. Additionally, share your primary area of expertise and a summary of your previous work experiences. Include any certifications you hold, and let us know if you are open to relocating for work. What are your salary expectations, and how many years of experience do you have in your field? Finally, outline your career goals for the next five years.',
      items: [
        { title: 'Response to questions in 9 stages' },
        { title: 'Review the resume before the final exit' },
        { title: 'Check out our awesome features!' },
        { title: 'Finish, you can download and use your resume and its features.' },
        { title: 'Use the features in the Dashboard' },
      ],
    },
    craftResume: {
      title: 'Craft Your Dream Resume Today!',
      subtitle:
        "Z-CV has helped create over 10,000 resumes from all around the world Our platform is here for job seekers everywhere, making it easy to build the perfect resume. Join the thousands who've already taken advantage of our cool resume-building tools!",
      getStarted: 'Get Started Free',
    },
    productFeatures: {
      title: 'Product Features',
      intro: tagline,
      getStarted: 'Get Started Free',
      features: [
        {
          title: 'One-Click Job Description Import',
          description:
            'Paste or import a Job Description and instantly tailor your resume content to match role requirements',
        },
        {
          title: 'AI Bullet Points Generator',
          description:
            'Turn tasks into impact-driven achievements with an AI bullet points generator (clear, concise, recruiter-ready)',
        },
        {
          title: 'ATS Score Checker / Profile',
          description:
            'Check resume structure and content with an ATS score checker style review to improve compatibility and clarity',
        },
        {
          title: 'Keyword Gap Analyzer',
          description:
            'Identify missing keywords from the JD and improve matching with a built-in keyword gap analyzer',
        },
        {
          title: 'Modern ATS-Friendly Templates',
          description:
            'Pick from ATS-friendly resume templates optimized for a clean Dubai CV format look and faster scanning',
        },
        {
          title: 'AI Cover Letter Builder',
          description:
            'Generate a tailored cover letter aligned to the same job description, so your application stays consistent',
        },
      ],
    },
    faq: {
      title: 'FAQ',
      intro: tagline,
      askQuestion: 'Ask Your Question',
      items: [
        {
          question: 'What types of projects do you work on?',
          answer:
            'I build modern web experiences: design systems, landing pages, dashboards, and full product UIs—optimized for performance, accessibility, and maintainability.',
        },
        {
          question: 'What does a typical timeline look like?',
          answer:
            "Most small-to-mid scope UI projects take 1–3 weeks depending on the number of screens, integrations, and revisions. I'll share a clear plan and milestones up front.",
        },
        {
          question: 'How do you approach UI implementation?',
          answer:
            'I start with layout/grid and typography hierarchy, then implement components with consistent spacing, border radii, and states. Final pass focuses on polish: motion, responsiveness, and edge cases.',
        },
        {
          question: 'Can you match a Figma design pixel-perfect?',
          answer:
            'Yes. I use a strict spacing system, consistent component styling, and careful alignment checks to match designs as closely as possible across breakpoints.',
        },
        {
          question: 'Do you offer post-launch support?',
          answer:
            'Absolutely. I can help with iterations, new sections, bug fixes, and improvements as your product evolves.',
        },
      ],
    },
    blog: {
      title: 'Blog',
      intro: tagline,
      viewArchive: 'View Archive',
      readMore: 'More',
      cards: [
        { title: 'Crafting Your Perfect Resume in Minutes', description: 'Craft your perfect resume in just ...' },
        { title: 'Build a Standout Resume Quickly Resume', description: 'Create a polished resume in only... ' },
        { title: 'Fast and Easy Resume Creation Guide', description: 'Get a complete resume ready in...' },
        { title: 'Swift Resume Builder: Your Path to Success', description: 'Finish your resume in a quick ...' },
      ],
    },
    testimonials: {
      title: 'Testimonials',
      intro: '"Create a professional and ATS-friendly resume and CV in minutes with Z-CV. Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial ."',
      askQuestion: 'Ask Your Question',
      items: [
        {
          role: 'CEO of Telegram',
          name: 'Pavel Durov',
          quote: `"Create a professional and ATS-friendly resume and CV in minutes with Z-CV." Tailored for the markets of Iran and Dubai, featuring modern templates and advanced artificial intelligence.`,
        },
      ],
    },
    footer: {
      aiResumeMaker: 'AI Resume Maker',
      home: 'Home',
      aboutUs: 'About Us',
      ourPlans: 'Our Plans',
      contactUs: 'Contact Us',
      columnTitle: 'Title',
      columnItem: 'Item',
      copyright: '©2025 Z-AI Company',
    },
    pricing: {
      free: 'Free',
      coins: 'Coins',
      savePercent: (n: number) => `Save ${n}% on features`,
      popular: 'Popular',
      currentPlan: 'Current Plan',
      upgradeNow: 'Upgrade Now',
      loadingPlans: 'Loading plans...',
      loadError: 'Could not load coin packages from database',
      alreadyUsed: 'Already Used',
      claimFreePlan: 'Claim Free Plan',
      login: 'Login',
      packageFallback: (n: number) => `Package ${n}`,
    },
    app: {
      aiResumeMaker: 'AI Resume Maker',
      coin: 'Coin',
    },
    landing: {
      introDialog: {
        primaryInfo: 'Primary information',
        loading: 'Loading…',
        notEnoughCoins: 'Not enough coins',
        needPurchase: 'To create a new resume, you need to purchase a design or coins. Please go to the designs page',
        pricing: 'Pricing',
        back: 'Back',
        save: 'Save',
        fullName: 'Full name',
        dateOfBirth: 'Your date of birth',
        datePlaceholder: 'DD/MM/YYYY',
        mainSkill: 'Your main skill',
        loadingSkills: 'Loading...',
        selectSkill: 'Select one of your skills',
        dateError: 'Enter a valid past date (DD/MM/YYYY)',
      },
      stepper: {
        firstStep: 'First Step',
        firstSubtitle: 'Answer questions',
        secondStep: 'Second Step',
        secondSubtitle: 'Review and Submit',
        finalStep: 'Final Step',
        finalSubtitle: 'Download a resume',
      },
      skillCategoryFa: {} as Record<string, string>,
      wizard: {
        skillInput: {
          title: 'Very good 😊',
          subtitle: 'You should answer a few questions about your resume.',
          visaStatus: 'Your visa status?',
          selectVisa: 'Select visa status',
          contactYou: 'Best way to contact you?',
          typeAnswer: 'Type your answer...',
          languageSkills: 'Your language skills?',
          language: 'Language',
          level: 'Level',
          next: 'Next',
          citizen: 'Citizen',
          permanentResident: 'Permanent resident',
          workVisa: 'Work visa',
          studentVisa: 'Student visa',
          other: 'Other',
          arabic: 'Arabic',
          persian: 'Persian',
          english: 'English',
        },
        selectSkill: {
          title: 'Briefly tell us about your background',
          tooltipLine1: 'Start with your job title or the role you are applying for.',
          tooltipLine2: 'Mention your years of experience.',
          tooltipLine3: 'Highlight your strongest skills and what makes you valuable.',
          tooltipLine4: 'Add 1–2 examples of what you have achieved in past companies.',
          tooltipLine5: 'Keep it short, clear, and professional (3–4 lines).',
          tooltipExample: 'Example: "UX/UI Designer with 3+ years of experience in creating user-friendly digital products. Skilled in wireframing, prototyping, and user research. Successfully improved user engagement for multiple ed-tech and gaming platforms."',
          atsFriendly: 'ATS Friendly',
          summaryText: "Your summary shows employers you're right for their job. We'll help you write a great one with expert content you can customize.",
          typeAnswer: 'Type your answer...',
          attachFile: 'Attach file',
          recordDraft: 'Record draft action',
          yourSkills: 'Your skills?',
          mainSkill: 'Main skill',
          editMainSkill: 'Edit main skill',
          noSkillsFound: 'No skills found.',
          anotherSkills: 'Your another skills: Designer, Motion...',
          back: 'Back',
          next: 'Next',
          voiceLimit: (n: number) => `You can upload up to ${n} voice recordings.`,
          voiceDuration: 'Voice recordings are limited to 90 seconds.',
          fileAlreadyUploaded: 'This file has already been uploaded.',
          fileLimit: (limit: number, label: string) => `You can upload up to ${limit} ${label}.`,
          videoDuration: 'Each video must be 60 seconds or shorter.',
        },
        experience: {
          title: 'Your work experience history',
          back: 'Back',
          next: 'Next',
          voiceLimit: (n: number) => `You can upload up to ${n} voice recordings.`,
          voiceDuration: 'Voice recordings are limited to 90 seconds.',
          fileAlreadyUploaded: 'This file has already been uploaded.',
          fileLimit: (limit: number, label: string) => `You can upload up to ${limit} ${label}.`,
          videoDuration: 'Each video must be 60 seconds or shorter.',
        },
        certification: {
          title: 'Capture your certifications',
          back: 'Back',
          next: 'Next',
          voiceLimit: (n: number) => `You can upload up to ${n} voice recordings.`,
          voiceDuration: 'Voice recordings are limited to 90 seconds.',
          fileAlreadyUploaded: 'This file has already been uploaded.',
          fileLimit: (limit: number, label: string) => `You can upload up to ${limit} ${label}.`,
          videoDuration: 'Each video must be 60 seconds or shorter.',
        },
        jobDescription: {
          title: "Could you share the job description?",
          atsFriendly: 'ATS Friendly',
          summaryText: "If you have a job position you want to apply for and you're creating a resume for it, please provide us with that job position.",
          title2: 'Anything else to add?',
          summaryText2: 'You can upload your resume in PDF format or any other format, including a photo, detailing your work experience or activities.',
          back: 'Back',
          next: 'Next',
          voiceLimit: (n: number) => `You can upload up to ${n} voice recordings.`,
          voiceDuration: 'Voice recordings are limited to 90 seconds.',
          fileAlreadyUploaded: 'This file has already been uploaded.',
          fileLimit: (limit: number, label: string) => `You can upload up to ${limit} ${label}.`,
          videoDuration: 'Each video must be 60 seconds or shorter.',
        },
        thinking: {
          thinking: 'Thinking...',
          analyzing: 'Updating & analyzing your information via the resume analysis service...',
          analyzingFile: (name: string) => `Updating & analyzing "${name}" via the resume analysis service...`,
          mightTakeTime: 'It might take a few minutes!',
          cancel: 'Cancel',
          error: 'ERROR to send file',
        },
        resumeEditor: {
          title: 'CV Preview',
          subtitle: 'You can view and edit resume',
          template1: 'Template 1',
          template2: 'Template 2',
          template3: 'Template 3',
          template4: 'Template 4',
        },
        moreFeatures: {
          title: 'More Features',
          subtitle: 'You can utilize these features with your resume',
          loadingSuggestions: 'Loading suggestions...',
          noSuggestions: 'No feature suggestions available.',
          failedToLoad: 'Failed to load more features',
          back: 'Back',
          submit: 'Submit',
          insufficientCoins: 'Insufficient coins',
          insufficientCoinsHeadline: "You do not have enough coins to enable this feature.",
          insufficientCoinsBody: "You can buy coins/upgrade your plan, or continue to payment.",
          goToPayment: 'Go to payment',
          pricing: 'Pricing',
        },
        resumeGeneratorFrame: {
          resume: 'Resume',
          created: 'Created:',
          size: 'Size:',
          fitScore: 'Fit score:',
          skillGroup: 'Skill group:',
          experienceLevel: 'Experience level:',
          aiGeneration: 'AI Generation',
          goToPanel: 'Go to panel',
          edit: 'Edit',
          preparingPdf: (p: number) => `Preparing PDF… ${p}%`,
          downloadPdf: 'Download PDF',
          downloadError: 'Failed to generate PDF. Please try again.',
          featureResumeTemplate: 'Resume Template',
          featureResumeTemplateDesc: 'Create professional, templates with modern design and flexible layout options.',
          featureJobSuggestions: 'Job Position Suggestions',
          featureJobSuggestionsDesc: 'Create professional, templates with modern design and flexible layout options.',
          featureLearningHub: 'Learning Hub',
          featureLearningHubDesc: 'Create professional, templates with modern design and flexible layout options.',
          featureInterviewQuestions: 'Interview Questions',
          featureInterviewQuestionsDesc: 'Create professional,  with modern design and flexible layout options.',
          featureTextInterview: 'Text Interview Practice ',
          featureTextInterviewDesc: 'Create , templates with modern design and flexible layout options.',
          featureVoiceInterview: 'Voice Interview Practice',
          featureVoiceInterviewDesc: 'Create professional, templates with modern design  layout options.',
        },
        editSkillDialog: {
          title: 'Edit your main skill ',
          mainSkill: 'Your main skill',
          placeholder: 'Select one of your skills',
          loading: 'Loading...',
          save: 'Save',
        },
        fileCategoryLabels: {
          images: 'images',
          videos: 'videos',
          pdfFiles: 'PDF files',
          wordFiles: 'Word files',
        },
      },
    },
  },
  fa: {
    nav: {
      home: 'خانه',
      cvResumeBuilder: 'ساخت رزومه و CV',
      pricing: 'قیمت‌گذاری',
      blog: 'وبلاگ',
      faq: 'سوالات متداول',
      contactUs: 'تماس با ما',
      aboutUs: 'درباره ما',
      ourPlans: 'پلن‌های ما',
    },
    hero: {
      title: 'رزومه حرفه‌ای و سازگار با ATS',
      subtitle: 'با Z-CV در چند دقیقه رزومه و CV حرفه‌ای و سازگار با ATS بسازید.',
      tagline:
        'مناسب بازار ایران و دبی، با قالب‌های مدرن و هوش مصنوعی پیشرفته.',
      getStarted: 'شروع رایگان',
      firstStep: 'مرحله اول',
      answerQuestions: 'پاسخ به سوالات',
      secondStep: 'مرحله دوم',
      reviewSubmit: 'بررسی و ارسال',
      finalStep: 'مرحله نهایی',
      downloadResume: 'دانلود رزومه',
    },
    keyBenefits: {
      title: 'مزایای کلیدی',
      intro:
        'با Z-CV در چند دقیقه رزومه و CV حرفه‌ای و سازگار با ATS بسازید. مناسب بازار ایران و دبی، با قالب‌های مدرن و هوش مصنوعی پیشرفته.',
      getStarted: 'شروع رایگان',
      dubaiCvTitle: 'فرمت CV دبی و امارات، آماده ارسال',
      dubaiCvDesc:
        'یک CV آماده دبی بسازید که با انتظارات فرمت رزومه امارات از چیدمان تا دوست‌داشتنی برای کارفرما هماهنگ باشد.',
      benefits: [
        {
          title: 'رزومه سازگار با ATS که از فیلترها رد می‌شود',
          description:
            'رزومه‌ای سازگار با ATS طراحی کنید که غربالگری خودکار را پاس کند و برای کارفرمایان واقعی خواناتر باشد.',
        },
        {
          title: 'رزومه را با هر شرح شغل تطبیق دهید',
          description:
            'رزومه خود را با شرح شغل (JD) هماهنگ کنید تا مهارت‌ها و تجربیات مرتبط را برجسته کنید.',
        },
        {
          title: 'ساخت رزومه با هوش مصنوعی، در چند دقیقه',
          description:
            'با سازنده رزومه هوش مصنوعی یک رزومه منظم و حرفه‌ای بدون شروع از صفر تولید کنید.',
        },
        {
          title: 'بهینه‌سازی کلمات کلیدی برای دیده‌شدن بیشتر',
          description:
            'با رویکرد شکاف کلمات کلیدی، کلمات گم‌شده را پیدا کنید تا رزومه شما با آگهی‌های شغلی امارات هماهنگ‌تر شود.',
        },
      ],
    },
    ourFeatures: {
      title: 'قابلیت‌های ما',
      intro:
        'با Z-CV در چند دقیقه رزومه و CV حرفه‌ای و سازگار با ATS بسازید. مناسب بازار ایران و دبی، با قالب‌های مدرن و هوش مصنوعی پیشرفته.',
      description:
        'لطفاً وضعیت فعلی ویزا و زبان‌هایی که به آن‌ها مسلط هستید را ذکر کنید. همچنین حوزه تخصص اصلی و خلاصه تجربیات کاری قبلی را به اشتراک بگذارید. گواهینامه‌ها را اضافه کنید و در صورت تمایل به جابه‌جایی برای کار اطلاع دهید. انتظارات حقوقی و سال‌های تجربه در حوزه خود را بنویسید و در نهایت اهداف شغلی پنج سال آینده را شرح دهید.',
      items: [
        { title: 'پاسخ به سوالات در ۹ مرحله' },
        { title: 'بررسی رزومه قبل از خروج نهایی' },
        { title: 'قابلیت‌های ما را ببینید!' },
        { title: 'پایان؛ می‌توانید رزومه و قابلیت‌های آن را دانلود و استفاده کنید.' },
        { title: 'استفاده از قابلیت‌ها در داشبورد' },
      ],
    },
    craftResume: {
      title: 'همین امروز رزومه رویایی خود را بسازید!',
      subtitle:
        'Z-CV به ساخت بیش از ۱۰٬۰۰۰ رزومه از سراسر جهان کمک کرده است. پلتفرم ما برای جویندگان کار در همه جا آماده است تا ساختن رزومه ایده‌آل را آسان کند. به هزاران نفری بپیوندید که از ابزارهای ساخت رزومه ما استفاده کرده‌اند!',
      getStarted: 'شروع رایگان',
    },
    productFeatures: {
      title: 'قابلیت‌های محصول',
      intro:
        'با Z-CV در چند دقیقه رزومه و CV حرفه‌ای و سازگار با ATS بسازید. مناسب بازار ایران و دبی، با قالب‌های مدرن و هوش مصنوعی پیشرفته.',
      getStarted: 'شروع رایگان',
      features: [
        {
          title: 'وارد کردن یک‌کلیکی شرح شغل',
          description:
            'شرح شغل را paste یا import کنید و فوراً محتوای رزومه را با نیازمندی‌های نقش تطبیق دهید.',
        },
        {
          title: 'تولیدگر نقاط bullet با هوش مصنوعی',
          description:
            'وظایف را با تولیدگر نقاط bullet هوش مصنوعی به دستاوردهای تأثیرگذار تبدیل کنید (واضح، مختصر، آماده برای کارفرما).',
        },
        {
          title: 'بررسی‌گر امتیاز ATS / پروفایل',
          description:
            'ساختار و محتوای رزومه را با بررسی سبک امتیاز ATS برای سازگاری و وضوح بهتر چک کنید.',
        },
        {
          title: 'تحلیل‌گر شکاف کلمات کلیدی',
          description:
            'کلمات کلیدی گم‌شده از JD را شناسایی کنید و با تحلیل‌گر شکاف کلمات کلیدی داخلی، تطابق را بهبود دهید.',
        },
        {
          title: 'قالب‌های مدرن سازگار با ATS',
          description:
            'از میان قالب‌های رزومه سازگار با ATS بهینه‌شده برای ظاهر فرمت CV دبی و اسکن سریع‌تر انتخاب کنید.',
        },
        {
          title: 'سازنده نامه همراه با هوش مصنوعی',
          description:
            'یک نامه همراه متناسب با همان شرح شغل تولید کنید تا درخواست شما یکدست بماند.',
        },
      ],
    },
    faq: {
      title: 'سوالات متداول',
      intro:
        'با Z-CV در چند دقیقه رزومه و CV حرفه‌ای و سازگار با ATS بسازید. مناسب بازار ایران و دبی، با قالب‌های مدرن و هوش مصنوعی پیشرفته.',
      askQuestion: 'سوال خود را بپرسید',
      items: [
        {
          question: 'روی چه نوع پروژه‌هایی کار می‌کنید؟',
          answer:
            'من تجربیات وب مدرن می‌سازم: سیستم‌های طراحی، لندینگ، داشبورد و UI محصول کامل—بهینه برای عملکرد، دسترس‌پذیری و نگهداری.',
        },
        {
          question: 'یک زمان‌بندی معمول چگونه است؟',
          answer:
            'بیشتر پروژه‌های UI با محدوده کوچک تا متوسط بسته به تعداد صفحات، یکپارچه‌سازی‌ها و بازبینی‌ها ۱ تا ۳ هفته طول می‌کشند. از همان ابتدا برنامه و نقاط عطف واضح ارائه می‌دهم.',
        },
        {
          question: 'پیاده‌سازی UI را چطور انجام می‌دهید؟',
          answer:
            'با چیدمان/گرید و سلسله‌مراتب تایپوگرافی شروع می‌کنم، سپس کامپوننت‌ها را با فاصله‌گذاری، شعاع حاشیه و حالت‌های یکسان پیاده می‌کنم. مرحله نهایی روی پولیش است: انیمیشن، ریسپانسیو و موارد خاص.',
        },
        {
          question: 'آیا می‌توانید طراحی Figma را پیکسل‌به‌پیکسل مطابقت دهید؟',
          answer:
            'بله. از سیستم فاصله‌گذاری دقیق، استایل یکسان کامپوننت و بررسی تراز دقیق استفاده می‌کنم تا طراحی را تا حد امکان در تمام breakpointها مطابقت دهم.',
        },
        {
          question: 'آیا پس از راه‌اندازی پشتیبانی ارائه می‌دهید؟',
          answer:
            'قطعاً. می‌توانم در تکرارها، بخش‌های جدید، رفع باگ و بهبودها با رشد محصول کمک کنم.',
        },
      ],
    },
    blog: {
      title: 'وبلاگ',
      intro:
        'با Z-CV در چند دقیقه رزومه و CV حرفه‌ای و سازگار با ATS بسازید. مناسب بازار ایران و دبی، با قالب‌های مدرن و هوش مصنوعی پیشرفته.',
      viewArchive: 'مشاهده آرشیو',
      readMore: 'بیشتر',
      cards: [
        { title: 'ساخت رزومه ایده‌آل در چند دقیقه', description: 'رزومه ایده‌آل خود را در چند دقیقه بسازید...' },
        { title: 'ساخت رزومه برجسته به‌سرعت', description: 'یک رزومه منظم در زمان کوتاه...' },
        { title: 'راهنمای سریع و آسان ساخت رزومه', description: 'یک رزومه کامل آماده در...' },
        { title: 'سازنده رزومه: مسیر موفقیت شما', description: 'رزومه خود را به‌سرعت تمام کنید...' },
      ],
    },
    testimonials: {
      title: 'نظرات کاربران',
      intro:
        '"با Z-CV در چند دقیقه رزومه و CV حرفه‌ای و سازگار با ATS بسازید. مناسب بازار ایران و دبی، با قالب‌های مدرن و هوش مصنوعی پیشرفته."',
      askQuestion: 'سوال خود را بپرسید',
      items: [
        {
          role: 'مدیرعامل تلگرام',
          name: 'پاول دوروف',
          quote: `"با Z-CV در چند دقیقه رزومه و CV حرفه‌ای و سازگار با ATS بسازید." مناسب بازار ایران و دبی، با قالب‌های مدرن و هوش مصنوعی پیشرفته.`,
        },
      ],
    },
    footer: {
      aiResumeMaker: 'سازنده رزومه هوش مصنوعی',
      home: 'خانه',
      aboutUs: 'درباره ما',
      ourPlans: 'پلن‌های ما',
      contactUs: 'تماس با ما',
      columnTitle: 'عنوان',
      columnItem: 'مورد',
      copyright: '©۲۰۲۵ شرکت Z-AI',
    },
    pricing: {
      free: 'رایگان',
      coins: 'سکه',
      savePercent: (n: number) => `${n}٪ تخفیف روی قابلیت‌ها`,
      popular: 'محبوب',
      currentPlan: 'پلن فعلی',
      upgradeNow: 'ارتقا دهید',
      loadingPlans: 'در حال بارگذاری پلن‌ها...',
      loadError: 'بارگذاری بسته‌های سکه از پایگاه داده ممکن نشد',
      alreadyUsed: 'قبلاً استفاده شده',
      claimFreePlan: 'دریافت پلن رایگان',
      login: 'ورود',
      packageFallback: (n: number) => `بسته ${n}`,
    },
    app: {
      aiResumeMaker: 'سازنده رزومه هوش مصنوعی',
      coin: 'سکه',
    },
    landing: {
      introDialog: {
        primaryInfo: 'اطلاعات اولیه',
        loading: 'در حال بارگذاری…',
        notEnoughCoins: 'سکه کافی نیست',
        needPurchase: 'برای ساخت رزومه جدید باید یک طرح یا سکه خریداری کنید. لطفاً به صفحه طرح‌ها بروید',
        pricing: 'قیمت‌گذاری',
        back: 'بازگشت',
        save: 'ذخیره',
        fullName: 'نام کامل',
        dateOfBirth: 'تاریخ تولد',
        datePlaceholder: 'سال/ماه/روز',
        mainSkill: 'مهارت اصلی شما',
        loadingSkills: 'در حال بارگذاری...',
        selectSkill: 'یکی از مهارت‌های خود را انتخاب کنید',
        dateError: 'یک تاریخ معتبر در گذشته وارد کنید (سال/ماه/روز)',
      },
      stepper: {
        firstStep: 'مرحله اول',
        firstSubtitle: 'پاسخ به سوالات',
        secondStep: 'مرحله دوم',
        secondSubtitle: 'بررسی و ارسال',
        finalStep: 'مرحله نهایی',
        finalSubtitle: 'دانلود رزومه',
      },
      skillCategoryFa: {
        'Web Frameworks': 'چارچوب‌های وب',
        'Programming Languages': 'زبان‌های برنامه‌نویسی',
        'Web Development': 'توسعه وب',
        'Mobile Development': 'توسعه موبایل',
        'Database': 'پایگاه داده',
        'Cloud Computing': 'رایانش ابری',
        'DevOps': 'دوواپس',
        'Data Science': 'علم داده',
        'Machine Learning': 'یادگیری ماشین',
        'Design': 'طراحی',
        'Marketing': 'بازاریابی',
        'Sales': 'فروش',
        'Management': 'مدیریت',
        'Finance': 'مالی',
        'Healthcare': 'سلامت',
        'Education': 'آموزش',
        'Engineering': 'مهندسی',
        'Other': 'سایر',
      } as Record<string, string>,
      wizard: {
        skillInput: {
          title: 'خیلی خوب 😊',
          subtitle: 'چند سوال درباره رزومه‌تان پاسخ دهید.',
          visaStatus: 'وضعیت ویزای شما؟',
          selectVisa: 'وضعیت ویزا را انتخاب کنید',
          contactYou: 'بهترین راه ارتباط با شما؟',
          typeAnswer: 'پاسخ خود را بنویسید...',
          languageSkills: 'مهارت‌های زبانی شما؟',
          language: 'زبان',
          level: 'سطح',
          next: 'بعدی',
          citizen: 'شهروند',
          permanentResident: 'اقامت دائم',
          workVisa: 'ویزای کاری',
          studentVisa: 'ویزای دانش‌آموزی',
          other: 'سایر',
          arabic: 'عربی',
          persian: 'فارسی',
          english: 'انگلیسی',
        },
        selectSkill: {
          title: 'کوتاه از پیشینه خود بگویید',
          tooltipLine1: 'با عنوان شغلی یا نقشی که برای آن درخواست می‌دهید شروع کنید.',
          tooltipLine2: 'سال‌های تجربه خود را ذکر کنید.',
          tooltipLine3: 'قوی‌ترین مهارت‌ها و ارزش خود را برجسته کنید.',
          tooltipLine4: '۱ تا ۲ نمونه از دستاوردهای خود در شرکت‌های قبلی اضافه کنید.',
          tooltipLine5: 'کوتاه، واضح و حرفه‌ای (۳ تا ۴ خط) بنویسید.',
          tooltipExample: 'مثال: «طراح UX/UI با بیش از ۳ سال تجربه در ساخت محصولات دیجیتال کاربرپسند. مسلط به وایرفریم، پروتوتایپ و تحقیقات کاربری. افزایش تعامل کاربر در چند پلتفرم آموزشی و بازی.»',
          atsFriendly: 'سازگار با ATS',
          summaryText: 'خلاصه شما به کارفرما نشان می‌دهد برای این شغل مناسبید. ما با محتوای تخصصی به شما کمک می‌کنیم آن را بنویسید.',
          typeAnswer: 'پاسخ خود را بنویسید...',
          attachFile: 'پیوست فایل',
          recordDraft: 'ضبط صدا',
          yourSkills: 'مهارت‌های شما؟',
          mainSkill: 'مهارت اصلی',
          editMainSkill: 'ویرایش مهارت اصلی',
          noSkillsFound: 'مهارتی یافت نشد.',
          anotherSkills: 'سایر مهارت‌ها: طراح، موشن...',
          back: 'قبلی',
          next: 'بعدی',
          voiceLimit: (n: number) => `حداکثر ${n} فایل صوتی می‌توانید آپلود کنید.`,
          voiceDuration: 'فایل‌های صوتی حداکثر ۹۰ ثانیه.',
          fileAlreadyUploaded: 'این فایل قبلاً آپلود شده است.',
          fileLimit: (limit: number, label: string) => `حداکثر ${limit} ${label} می‌توانید آپلود کنید.`,
          videoDuration: 'هر ویدیو حداکثر ۶۰ ثانیه.',
        },
        experience: {
          title: 'سابقه کاری شما',
          back: 'قبلی',
          next: 'بعدی',
          voiceLimit: (n: number) => `حداکثر ${n} فایل صوتی می‌توانید آپلود کنید.`,
          voiceDuration: 'فایل‌های صوتی حداکثر ۹۰ ثانیه.',
          fileAlreadyUploaded: 'این فایل قبلاً آپلود شده است.',
          fileLimit: (limit: number, label: string) => `حداکثر ${limit} ${label} می‌توانید آپلود کنید.`,
          videoDuration: 'هر ویدیو حداکثر ۶۰ ثانیه.',
        },
        certification: {
          title: 'گواهینامه‌های خود را ثبت کنید',
          back: 'قبلی',
          next: 'بعدی',
          voiceLimit: (n: number) => `حداکثر ${n} فایل صوتی می‌توانید آپلود کنید.`,
          voiceDuration: 'فایل‌های صوتی حداکثر ۹۰ ثانیه.',
          fileAlreadyUploaded: 'این فایل قبلاً آپلود شده است.',
          fileLimit: (limit: number, label: string) => `حداکثر ${limit} ${label} می‌توانید آپلود کنید.`,
          videoDuration: 'هر ویدیو حداکثر ۶۰ ثانیه.',
        },
        jobDescription: {
          title: 'شرح شغل را با ما به اشتراک می‌گذارید؟',
          atsFriendly: 'سازگار با ATS',
          summaryText: 'اگر موقعیت شغلی دارید که برای آن درخواست می‌دهید و رزومه برای آن می‌سازید، لطفاً آن را وارد کنید.',
          title2: 'چیز دیگری هست؟',
          summaryText2: 'می‌توانید رزومه را به صورت PDF یا قالب دیگر از جمله عکس، با جزئیات تجربه یا فعالیت‌ها آپلود کنید.',
          back: 'قبلی',
          next: 'بعدی',
          voiceLimit: (n: number) => `حداکثر ${n} فایل صوتی می‌توانید آپلود کنید.`,
          voiceDuration: 'فایل‌های صوتی حداکثر ۹۰ ثانیه.',
          fileAlreadyUploaded: 'این فایل قبلاً آپلود شده است.',
          fileLimit: (limit: number, label: string) => `حداکثر ${limit} ${label} می‌توانید آپلود کنید.`,
          videoDuration: 'هر ویدیو حداکثر ۶۰ ثانیه.',
        },
        thinking: {
          thinking: 'در حال پردازش...',
          analyzing: 'در حال به‌روزرسانی و تحلیل اطلاعات شما توسط سرویس تحلیل رزومه...',
          analyzingFile: (name: string) => `در حال به‌روزرسانی و تحلیل «${name}» توسط سرویس تحلیل رزومه...`,
          mightTakeTime: 'ممکن است چند دقیقه طول بکشد!',
          cancel: 'لغو',
          error: 'خطا در ارسال فایل',
        },
        resumeEditor: {
          title: 'پیش‌نمایش CV',
          subtitle: 'می‌توانید رزومه را مشاهده و ویرایش کنید',
          template1: 'قالب ۱',
          template2: 'قالب ۲',
          template3: 'قالب ۳',
          template4: 'قالب ۴',
        },
        moreFeatures: {
          title: 'قابلیت‌های بیشتر',
          subtitle: 'می‌توانید از این قابلیت‌ها با رزومه خود استفاده کنید',
          loadingSuggestions: 'در حال بارگذاری پیشنهادها...',
          noSuggestions: 'پیشنهاد قابلیتی موجود نیست.',
          failedToLoad: 'بارگذاری قابلیت‌های بیشتر ناموفق بود',
          back: 'قبلی',
          submit: 'ارسال',
          insufficientCoins: 'سکه کافی نیست',
          insufficientCoinsHeadline: 'سکه کافی برای فعال‌سازی این قابلیت ندارید.',
          insufficientCoinsBody: 'می‌توانید سکه بخرید یا پلن ارتقا دهید، یا به پرداخت بروید.',
          goToPayment: 'رفتن به پرداخت',
          pricing: 'قیمت‌گذاری',
        },
        resumeGeneratorFrame: {
          resume: 'رزومه',
          created: 'ایجاد:',
          size: 'حجم:',
          fitScore: 'امتیاز تطابق:',
          skillGroup: 'گروه مهارت:',
          experienceLevel: 'سطح تجربه:',
          aiGeneration: 'تولید هوش مصنوعی',
          goToPanel: 'رفتن به پنل',
          edit: 'ویرایش',
          preparingPdf: (p: number) => `آماده‌سازی PDF… ${p}٪`,
          downloadPdf: 'دانلود PDF',
          downloadError: 'تولید PDF ناموفق بود. دوباره تلاش کنید.',
          featureResumeTemplate: 'قالب رزومه',
          featureResumeTemplateDesc: 'قالب‌های حرفه‌ای با طراحی مدرن و چیدمان انعطاف‌پذیر.',
          featureJobSuggestions: 'پیشنهاد موقعیت شغلی',
          featureJobSuggestionsDesc: 'قالب‌های حرفه‌ای با طراحی مدرن و چیدمان انعطاف‌پذیر.',
          featureLearningHub: 'مرکز یادگیری',
          featureLearningHubDesc: 'قالب‌های حرفه‌ای با طراحی مدرن و چیدمان انعطاف‌پذیر.',
          featureInterviewQuestions: 'سوالات مصاحبه',
          featureInterviewQuestionsDesc: 'حرفه‌ای با طراحی مدرن و گزینه‌های چیدمان.',
          featureTextInterview: 'ممارست مصاحبه متنی',
          featureTextInterviewDesc: 'قالب‌ها با طراحی مدرن و گزینه‌های چیدمان.',
          featureVoiceInterview: 'ممارست مصاحبه صوتی',
          featureVoiceInterviewDesc: 'قالب‌های حرفه‌ای با طراحی مدرن و چیدمان.',
        },
        editSkillDialog: {
          title: 'ویرایش مهارت اصلی شما ',
          mainSkill: 'مهارت اصلی شما',
          placeholder: 'یکی از مهارت‌های خود را انتخاب کنید',
          loading: 'در حال بارگذاری...',
          save: 'ذخیره',
        },
        fileCategoryLabels: {
          images: 'تصویر',
          videos: 'ویدیو',
          pdfFiles: 'فایل PDF',
          wordFiles: 'فایل Word',
        },
      },
    },
  },
} as const;

export function getMainTranslations(locale: Locale) {
  return mainTranslations[locale];
}
