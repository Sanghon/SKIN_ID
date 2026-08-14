import type { SkinCharacter } from '../../types/skin'

export const SKIN_CHARACTERS: Record<string, SkinCharacter> = {
  sahara: {
    id: 'sahara',
    name: '사하라',
    nameEn: 'Sahara',
    skinType: '극건성',
    description: '유분이 거의 감지되지 않아요. 수분과 유분 밸런스를 함께 채워주세요.',
  },
  cactus: {
    id: 'cactus',
    name: '선인장',
    nameEn: 'Cactus',
    skinType: '건성',
    description: '전반적으로 유분이 적은 편이에요. 보습 중심 루틴이 잘 맞아요.',
  },
  balance: {
    id: 'balance',
    name: '밸런스 마스터',
    nameEn: 'Balance Master',
    skinType: '중성',
    description: 'T존과 U존의 유분이 고르게 안정적이에요.',
  },
  'double-life': {
    id: 'double-life',
    name: '이중생활',
    nameEn: 'Double Life',
    skinType: '복합성',
    description: 'T존과 U존의 유분 차이가 커요. 부위별로 다른 케어가 필요해요.',
  },
  'oil-field': {
    id: 'oil-field',
    name: '유전 발견',
    nameEn: 'Oil Field',
    skinType: '지성',
    description: '유분이 눈에 띄게 감지돼요. 오일 컨트롤 케어를 더해보세요.',
  },
  'oil-king': {
    id: 'oil-king',
    name: 'OIL KING',
    nameEn: 'Oil King',
    skinType: '극지성',
    description: '전 부위에서 유분이 뚜렷하게 감지돼요. 피지 조절이 핵심이에요.',
  },
}
