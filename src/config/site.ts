export const siteConfig = {
  name: 'Nados AI',
  nameAr: 'نادوس للذكاء الاصطناعي',
  description:
    'منصة ذكاء اصطناعي عربية مجانية للمحادثة مع نماذج متقدمة، إدارة المحادثات، البحث، والمزيد.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ogImage: '/og-image.png',
  locale: 'ar',
  dir: 'rtl' as const,
  defaultTimezone: 'Asia/Baghdad',
  links: {
    twitter: 'https://twitter.com/nadosai',
    github: 'https://github.com/nadosai',
    contact: 'mailto:contact@nados.ai',
  },
  keywords: [
    'ذكاء اصطناعي',
    'محادثة ذكية',
    'ChatGPT عربي',
    'DeepSeek',
    'Nados AI',
    'AI chat',
  ],
} as const;

export type SiteConfig = typeof siteConfig;
