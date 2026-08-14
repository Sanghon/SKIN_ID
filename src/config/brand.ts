export const brand = {
  name: 'OILOG',
  tagline: '오늘의 피지 패턴',
  taglineEn: 'Skin History & Tracking',
  description: '기름종이 한 장으로 확인하는 오늘의 피부 상태',
  colors: {
    paper: '#f5f6f2',
    surface: '#ffffff',
    ink: '#16294d',
    accent: '#7fa030',
    lab: '#3e5c86',
  },
  logo: {
    full: '/brand/oilog-logo-full.png',
    wordmark: '/brand/oilog-wordmark.png',
  },
} as const

export type Brand = typeof brand
