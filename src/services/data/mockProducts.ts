import productCleansing from '../../assets/product-cleansing.png'
import productHydration from '../../assets/product-hydration.png'
import productOilControl from '../../assets/product-oilcontrol.png'
import productSunCare from '../../assets/product-suncare.png'
import type { Product } from '../../types/product'

export const mockProducts: Product[] = [
  {
    id: 'product-cleansing-1',
    name: '로우 pH 젤 클렌저',
    brand: 'OILOG LAB',
    step: 'cleansing',
    price: 18000,
    imageUrl: productCleansing,
    description: '피지와 각질을 부드럽게 씻어내는 약산성 젤 클렌저.',
    matchScore: 92,
    reason: 'T존 피지량이 높아 저자극 세정이 우선이에요.',
  },
  {
    id: 'product-hydration-1',
    name: '라이트 워터 에센스',
    brand: 'OILOG LAB',
    step: 'hydration',
    price: 24000,
    imageUrl: productHydration,
    description: '유분 위에 얹혀도 무겁지 않은 저점도 수분 에센스.',
    matchScore: 81,
    reason: '유수분 밸런스를 맞추기 위한 가벼운 보습이 필요해요.',
  },
  {
    id: 'product-oil-control-1',
    name: '클레이 세범 패드',
    brand: 'OILOG LAB',
    step: 'oil-control',
    price: 21000,
    imageUrl: productOilControl,
    description: 'T존 피지를 흡착하는 클레이 성분 패드.',
    matchScore: 88,
    reason: 'T존과 U존의 피지 차이가 커서 부위별 케어가 효과적이에요.',
  },
  {
    id: 'product-sun-care-1',
    name: '매트 선 플루이드',
    brand: 'OILOG LAB',
    step: 'sun-care',
    price: 19000,
    imageUrl: productSunCare,
    description: '산뜻하게 발리는 무기자차 선크림, 밀림 없는 매트 마무리.',
    matchScore: 76,
    reason: '피지가 많은 피부에는 무기자차 매트 제형이 잘 맞아요.',
  },
]
