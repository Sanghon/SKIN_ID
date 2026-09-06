export const brand = {
  name: 'SkinQuant AX',
  tagline: '오늘의 피지 패턴',
  taglineEn: 'Physical AI Skin Intelligence',
  description: '기름종이 한 장으로 확인하는 오늘의 피부 상태',
  colors: {
    paper: '#f5f6f2',
    surface: '#ffffff',
    ink: '#16294d',
    accent: '#7fa030',
    lab: '#3e5c86',
  },
  logo: {
    wordmark: '/brand/skinquant-logo-full.png',
    icon: '/brand/skinquant-icon.png',
  },
} as const

export type Brand = typeof brand
