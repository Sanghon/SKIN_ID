import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Pill } from '../components'
import { ChevronRightIcon, TrashIcon } from '../components/icons'
import { pickImageDataUrl, useProductStore } from '../lib/productStore'
import type { CareStep, Product } from '../types/product'

const STEP_OPTIONS: { value: CareStep; label: string }[] = [
  { value: 'cleansing', label: '클렌징' },
  { value: 'hydration', label: '수분' },
  { value: 'oil-control', label: '피지 케어' },
  { value: 'sun-care', label: '선 케어' },
]

type DraftProduct = Omit<Product, 'price' | 'matchScore'> & { price: string; matchScore: string }

const EMPTY_DRAFT: DraftProduct = {
  id: '',
  name: '',
  brand: 'OILOG LAB',
  step: 'cleansing',
  price: '',
  imageUrl: '',
  description: '',
  matchScore: '',
  reason: '',
}

function toDraft(p: Product): DraftProduct {
  return { ...p, price: String(p.price), matchScore: String(p.matchScore) }
}

function ProductForm({
  draft,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  draft: DraftProduct
  onChange: (next: DraftProduct) => void
  onSubmit: () => void
  onCancel?: () => void
  submitLabel: string
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {draft.imageUrl ? (
          <img src={draft.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-xs text-ink-faint">
            이미지 없음
          </span>
        )}
        <button
          type="button"
          onClick={async () => {
            const dataUrl = await pickImageDataUrl()
            if (dataUrl) onChange({ ...draft, imageUrl: dataUrl })
          }}
          className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-medium text-ink"
        >
          이미지 선택
        </button>
      </div>

      <label className="flex flex-col gap-1 text-xs text-ink-faint">
        제품명
        <input
          value={draft.name}
          onChange={(e) => onChange({ ...draft, name: e.target.value })}
          className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs text-ink-faint">
        브랜드
        <input
          value={draft.brand}
          onChange={(e) => onChange({ ...draft, brand: e.target.value })}
          className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs text-ink-faint">
        단계
        <select
          value={draft.step}
          onChange={(e) => onChange({ ...draft, step: e.target.value as CareStep })}
          className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink"
        >
          {STEP_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-ink-faint">
          가격 (원)
          <input
            type="number"
            value={draft.price}
            onChange={(e) => onChange({ ...draft, price: e.target.value })}
            className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-xs text-ink-faint">
          맞춤도 (%)
          <input
            type="number"
            value={draft.matchScore}
            onChange={(e) => onChange({ ...draft, matchScore: e.target.value })}
            className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs text-ink-faint">
        설명
        <textarea
          value={draft.description}
          onChange={(e) => onChange({ ...draft, description: e.target.value })}
          rows={2}
          className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs text-ink-faint">
        추천 사유
        <textarea
          value={draft.reason}
          onChange={(e) => onChange({ ...draft, reason: e.target.value })}
          rows={2}
          className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink"
        />
      </label>

      <div className="flex gap-2">
        <Button className="flex-1" onClick={onSubmit} disabled={!draft.name.trim()}>
          {submitLabel}
        </Button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-surface-2 px-4 py-2 text-sm font-medium text-ink-soft"
          >
            취소
          </button>
        )}
      </div>
    </Card>
  )
}

export function AdminCarePage() {
  const { products, addProduct, updateProduct, removeProduct, reset } = useProductStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<DraftProduct>(EMPTY_DRAFT)
  const [creating, setCreating] = useState(false)
  const [newDraft, setNewDraft] = useState<DraftProduct>(EMPTY_DRAFT)

  function startEdit(p: Product) {
    setEditingId(p.id)
    setEditDraft(toDraft(p))
  }

  function commitEdit() {
    if (!editingId) return
    updateProduct(editingId, {
      name: editDraft.name,
      brand: editDraft.brand,
      step: editDraft.step,
      price: Number(editDraft.price) || 0,
      imageUrl: editDraft.imageUrl,
      description: editDraft.description,
      matchScore: Number(editDraft.matchScore) || 0,
      reason: editDraft.reason,
    })
    setEditingId(null)
  }

  function commitCreate() {
    addProduct({
      id: `product-${Date.now()}`,
      name: newDraft.name,
      brand: newDraft.brand,
      step: newDraft.step,
      price: Number(newDraft.price) || 0,
      imageUrl: newDraft.imageUrl,
      description: newDraft.description,
      matchScore: Number(newDraft.matchScore) || 0,
      reason: newDraft.reason,
    })
    setNewDraft(EMPTY_DRAFT)
    setCreating(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <Link to="/profile" className="text-sm text-ink-soft">
          ← 마이로 돌아가기
        </Link>
        <h1 className="mt-2 text-lg font-semibold text-ink">관리자 설정 · 케어 제품</h1>
        <p className="mt-1 text-sm text-ink-faint">
          케어 탭에 노출되는 제품 목록과 이미지를 등록·수정·삭제할 수 있어요. (현재는 권한 제한 없이 전체 공개)
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {products.map((p) =>
          editingId === p.id ? (
            <ProductForm
              key={p.id}
              draft={editDraft}
              onChange={setEditDraft}
              onSubmit={commitEdit}
              onCancel={() => setEditingId(null)}
              submitLabel="저장"
            />
          ) : (
            <Card key={p.id} className="flex items-center gap-3">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-[10px] text-ink-faint">
                  이미지 없음
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-ink">{p.name}</p>
                  <Pill tone="accent" className="shrink-0">
                    {STEP_OPTIONS.find((s) => s.value === p.step)?.label}
                  </Pill>
                </div>
                <p className="text-xs text-ink-faint">
                  {p.brand} · {p.price.toLocaleString('ko-KR')}원 · {p.matchScore}%
                </p>
              </div>
              <button type="button" onClick={() => startEdit(p)} className="shrink-0 text-ink-faint">
                <ChevronRightIcon width={18} height={18} />
              </button>
              <button
                type="button"
                onClick={() => removeProduct(p.id)}
                aria-label="삭제"
                className="shrink-0 text-pop-coral"
              >
                <TrashIcon width={18} height={18} />
              </button>
            </Card>
          ),
        )}
      </div>

      {creating ? (
        <ProductForm
          draft={newDraft}
          onChange={setNewDraft}
          onSubmit={commitCreate}
          onCancel={() => setCreating(false)}
          submitLabel="등록"
        />
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-2xl border border-dashed border-line px-4 py-3 text-sm font-medium text-ink-soft"
        >
          + 새 제품 등록
        </button>
      )}

      <button type="button" onClick={reset} className="text-center text-xs text-ink-faint underline">
        기본 목록으로 초기화
      </button>
    </div>
  )
}
