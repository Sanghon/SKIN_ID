// Generates migrations/0002_seed.sql from the same logic as src/services/data/mockMeasurements.ts,
// so the initial D1 dataset matches what the app used to generate client-side.
import { writeFileSync } from 'node:fs'

const OIL_INDEX_WEIGHTS = { coverage: 0.6, intensity: 0.4 }
const SKIN_TYPE_THRESHOLDS = [
  { type: '극건성', min: 0 },
  { type: '건성', min: 20 },
  { type: '중성', min: 40 },
  { type: '지성', min: 60 },
  { type: '극지성', min: 80 },
]
const COMBINATION_OVERRIDE_THRESHOLD = 25
const COMBINATION_CHARACTER = 'double-life'
const SKIN_TYPE_TO_CHARACTER = {
  극건성: 'sahara',
  건성: 'cactus',
  중성: 'balance',
  지성: 'oil-field',
  극지성: 'oil-king',
  복합성: COMBINATION_CHARACTER,
}
const FACE_ZONES = ['이마', '코', '왼쪽볼', '오른쪽볼', '턱']

function calcOilScore(oilCoverage, oilIntensity) {
  const score = OIL_INDEX_WEIGHTS.coverage * oilCoverage + OIL_INDEX_WEIGHTS.intensity * oilIntensity
  return Math.round(Math.min(100, Math.max(0, score)))
}

function classifySkinType(oilScore) {
  const sorted = [...SKIN_TYPE_THRESHOLDS].sort((a, b) => a.min - b.min)
  let result = sorted[0].type
  for (const threshold of sorted) {
    if (oilScore >= threshold.min) result = threshold.type
  }
  return result
}

function resolveSkinCharacter(skinType, tZoneScore, uZoneScore) {
  if (tZoneScore - uZoneScore >= COMBINATION_OVERRIDE_THRESHOLD) return COMBINATION_CHARACTER
  return SKIN_TYPE_TO_CHARACTER[skinType]
}

function buildZoneScores(dayIndex) {
  return FACE_ZONES.map((zone, zoneIndex) => {
    const isTZone = zone === '이마' || zone === '코'
    const wobble = Math.sin(dayIndex * 0.7 + zoneIndex) * 10
    const trend = 55 - dayIndex * 1.4
    const base = (isTZone ? trend + 12 : trend - 8) + wobble
    const oilCoverage = Math.round(Math.min(100, Math.max(5, base)))
    const oilIntensity = Math.round(Math.min(100, Math.max(5, base - 6 + wobble * 0.3)))
    return { zone, oilCoverage, oilIntensity, score: calcOilScore(oilCoverage, oilIntensity) }
  })
}

function buildMeasurement(daysAgo, id, capturedAt, wobbleOffset = 0) {
  const zoneScores = buildZoneScores(daysAgo + wobbleOffset)
  const tZoneScores = zoneScores.filter((z) => z.zone === '이마' || z.zone === '코')
  const uZoneScores = zoneScores.filter((z) => z.zone !== '이마' && z.zone !== '코')
  const avg = (list) => list.reduce((sum, z) => sum + z.score, 0) / list.length

  const tZoneScore = Math.round(avg(tZoneScores))
  const uZoneScore = Math.round(avg(uZoneScores))
  const oilCoverage = Math.round(zoneScores.reduce((sum, z) => sum + z.oilCoverage, 0) / zoneScores.length)
  const oilIntensity = Math.round(zoneScores.reduce((sum, z) => sum + z.oilIntensity, 0) / zoneScores.length)
  const oilScore = calcOilScore(oilCoverage, oilIntensity)
  const skinType = classifySkinType(oilScore)
  const skinCharacter = resolveSkinCharacter(skinType, tZoneScore, uZoneScore)

  return {
    id,
    userId: 'user-1',
    capturedAt,
    imageUrl: '',
    result: { oilCoverage, oilIntensity, tZoneScore, uZoneScore, oilScore, confidence: 0.85, skinType, skinCharacter, zoneScores },
  }
}

function daysAgoIso(daysAgo) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
}

function todayAt(hour) {
  const d = new Date()
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

const measurements = [
  ...Array.from({ length: 13 }, (_, i) => buildMeasurement(13 - i, `measurement-${13 - i}`, daysAgoIso(13 - i))),
  buildMeasurement(0, 'measurement-0-am', todayAt(9)),
  buildMeasurement(0, 'measurement-0-pm', todayAt(21), -0.6),
]

const products = [
  { id: 'product-cleansing-1', name: '로우 pH 젤 클렌저', brand: 'OILOG LAB', step: 'cleansing', price: 18000, imageUrl: '/api/images/products/cleansing.png', description: '피지와 각질을 부드럽게 씻어내는 약산성 젤 클렌저.', matchScore: 92, reason: 'T존 피지량이 높아 저자극 세정이 우선이에요.' },
  { id: 'product-hydration-1', name: '라이트 워터 에센스', brand: 'OILOG LAB', step: 'hydration', price: 24000, imageUrl: '/api/images/products/hydration.png', description: '유분 위에 얹혀도 무겁지 않은 저점도 수분 에센스.', matchScore: 81, reason: '유수분 밸런스를 맞추기 위한 가벼운 보습이 필요해요.' },
  { id: 'product-oil-control-1', name: '클레이 세범 패드', brand: 'OILOG LAB', step: 'oil-control', price: 21000, imageUrl: '/api/images/products/oilcontrol.png', description: 'T존 피지를 흡착하는 클레이 성분 패드.', matchScore: 88, reason: 'T존과 U존의 피지 차이가 커서 부위별 케어가 효과적이에요.' },
  { id: 'product-sun-care-1', name: '매트 선 플루이드', brand: 'OILOG LAB', step: 'sun-care', price: 19000, imageUrl: '/api/images/products/suncare.png', description: '산뜻하게 발리는 무기자차 선크림, 밀림 없는 매트 마무리.', matchScore: 76, reason: '피지가 많은 피부에는 무기자차 매트 제형이 잘 맞아요.' },
  { id: 'product-cleansing-2', name: '저자극 크림 클렌저', brand: 'OILOG LAB', step: 'cleansing', price: 17000, imageUrl: '/api/images/products/cleansing.png', description: '건조함이 걱정될 때 쓰기 좋은 순한 크림 타입 클렌저.', matchScore: 78, reason: '세정력은 유지하면서 당김이 덜한 순한 제형을 원할 때 추천해요.' },
  { id: 'product-hydration-2', name: '진정 수딩 크림', brand: 'OILOG LAB', step: 'hydration', price: 26000, imageUrl: '/api/images/products/hydration.png', description: '가벼운 에센스보다 밀도 있는 보습을 원할 때 좋은 수딩 크림.', matchScore: 74, reason: '건조함이 더 크게 느껴지는 날엔 밀도 있는 보습이 도움돼요.' },
  { id: 'product-oil-control-2', name: '살리실릭 토너 패드', brand: 'OILOG LAB', step: 'oil-control', price: 22000, imageUrl: '/api/images/products/oilcontrol.png', description: '모공 속 피지까지 정돈해주는 산뜻한 토너 패드.', matchScore: 80, reason: '클레이 제형이 자극적으로 느껴질 때 대신 쓰기 좋아요.' },
  { id: 'product-sun-care-2', name: '수분 선크림', brand: 'OILOG LAB', step: 'sun-care', price: 21000, imageUrl: '/api/images/products/suncare.png', description: '매트한 마무리보다 촉촉함을 원할 때 좋은 수분 선크림.', matchScore: 70, reason: '유수분기가 부족한 부위엔 촉촉한 제형이 더 편안해요.' },
]

const routineEvents = [
  { id: 'routine-1', measurementId: 'measurement-9', productId: 'product-oil-control-1', note: '클레이 세범 패드로 교체' },
  { id: 'routine-2', measurementId: 'measurement-4', productId: 'product-hydration-1', note: '라이트 워터 에센스 추가' },
  { id: 'routine-3', measurementId: 'measurement-0-pm', productId: 'product-sun-care-1', note: '매트 선 플루이드로 교체' },
]

function sqlStr(v) {
  return `'${String(v).replace(/'/g, "''")}'`
}

const lines = []

for (const p of products) {
  lines.push(
    `INSERT INTO products (id, name, brand, step, price, image_url, description, match_score, reason) VALUES (${sqlStr(p.id)}, ${sqlStr(p.name)}, ${sqlStr(p.brand)}, ${sqlStr(p.step)}, ${p.price}, ${sqlStr(p.imageUrl)}, ${sqlStr(p.description)}, ${p.matchScore}, ${sqlStr(p.reason)});`,
  )
}

for (const m of measurements) {
  const r = m.result
  lines.push(
    `INSERT INTO measurements (id, user_id, captured_at, image_url, oil_coverage, oil_intensity, t_zone_score, u_zone_score, oil_score, confidence, skin_type, skin_character) VALUES (${sqlStr(m.id)}, ${sqlStr(m.userId)}, ${sqlStr(m.capturedAt)}, ${sqlStr(m.imageUrl)}, ${r.oilCoverage}, ${r.oilIntensity}, ${r.tZoneScore}, ${r.uZoneScore}, ${r.oilScore}, ${r.confidence}, ${sqlStr(r.skinType)}, ${sqlStr(r.skinCharacter)});`,
  )
  for (const z of r.zoneScores) {
    lines.push(
      `INSERT INTO zone_scores (measurement_id, zone, oil_coverage, oil_intensity, score) VALUES (${sqlStr(m.id)}, ${sqlStr(z.zone)}, ${z.oilCoverage}, ${z.oilIntensity}, ${z.score});`,
    )
  }
}

for (const e of routineEvents) {
  lines.push(
    `INSERT INTO routine_events (id, measurement_id, product_id, note) VALUES (${sqlStr(e.id)}, ${sqlStr(e.measurementId)}, ${sqlStr(e.productId)}, ${sqlStr(e.note)});`,
  )
}

writeFileSync(new URL('../migrations/0002_seed.sql', import.meta.url), lines.join('\n') + '\n')
console.log(`Wrote ${lines.length} statements to migrations/0002_seed.sql`)
