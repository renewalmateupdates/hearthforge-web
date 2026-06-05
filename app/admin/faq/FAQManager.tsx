'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { FAQ } from '@/types'

function SortableFAQItem({
  faq,
  onEdit,
  onDelete,
}: {
  faq: FAQ
  onEdit: (faq: FAQ) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: faq.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  return (
    <div ref={setNodeRef} style={style} className="admin-card flex items-start gap-3">
      <button {...attributes} {...listeners} className="mt-1 p-1 cursor-grab text-hearthstone/20 hover:text-hearthstone/50 shrink-0">
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-hearthstone text-sm">{faq.question}</p>
        <p className="text-hearthstone/50 text-sm mt-1 line-clamp-2">{faq.answer}</p>
        <div className="flex gap-2 mt-1.5">
          <span className="text-xs text-hearthstone/30">{faq.category}</span>
          <span className={`text-xs ${faq.is_published ? 'text-green-400' : 'text-hearthstone/30'}`}>
            {faq.is_published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        <button onClick={() => onEdit(faq)} className="p-1.5 rounded hover:bg-white/10 text-hearthstone/40 hover:text-hearthstone transition-colors">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button onClick={() => onDelete(faq.id)} className="p-1.5 rounded hover:bg-red-400/10 text-hearthstone/40 hover:text-red-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

type FormData = { question: string; answer: string; category: string; is_published: boolean }
const EMPTY: FormData = { question: '', answer: '', category: 'General', is_published: true }

export default function FAQManager({ faqs: initial }: { faqs: FAQ[] }) {
  const router = useRouter()
  const [faqs, setFaqs] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function openNew() {
    setEditing(null)
    setForm(EMPTY)
    setShowForm(true)
  }

  function openEdit(faq: FAQ) {
    setEditing(faq)
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, is_published: faq.is_published })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.question || !form.answer) {
      setError('Question and answer are required')
      return
    }
    setSaving(true)
    setError('')
    try {
      let res: Response
      if (editing) {
        res = await fetch('/api/admin/faq', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing.id, ...form }),
        })
      } else {
        res = await fetch('/api/admin/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, sort_order: faqs.length }),
        })
      }
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Save failed')
      }
      setShowForm(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return
    await fetch(`/api/admin/faq?id=${id}`, { method: 'DELETE' })
    setFaqs(prev => prev.filter(f => f.id !== id))
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = faqs.findIndex(f => f.id === active.id)
    const newIndex = faqs.findIndex(f => f.id === over.id)
    const newOrder = arrayMove(faqs, oldIndex, newIndex)
    setFaqs(newOrder)

    // persist new sort orders
    await Promise.all(
      newOrder.map((faq, i) =>
        fetch('/api/admin/faq', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: faq.id, sort_order: i }),
        })
      )
    )
  }

  return (
    <div className="space-y-4">
      <button onClick={openNew} className="admin-btn-primary flex items-center gap-2">
        <Plus className="w-4 h-4" /> Add FAQ
      </button>

      {showForm && (
        <div className="admin-card space-y-4">
          <h3 className="font-semibold text-hearthstone">{editing ? 'Edit' : 'New'} FAQ</h3>
          <div>
            <label className="admin-label">Question *</label>
            <input value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Answer *</label>
            <textarea value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} className="admin-input min-h-[100px] resize-y" />
          </div>
          <div>
            <label className="admin-label">Category</label>
            <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="admin-input" placeholder="General" />
          </div>
          <label className="flex items-center gap-2 text-sm text-hearthstone/70 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))} className="w-4 h-4 rounded" />
            Published
          </label>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="admin-btn-primary text-sm">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setShowForm(false)} className="admin-btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      {faqs.length === 0 && !showForm ? (
        <div className="admin-card text-center py-10">
          <p className="text-hearthstone/40">No FAQs yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-hearthstone/30">Drag to reorder</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={faqs.map(f => f.id)} strategy={verticalListSortingStrategy}>
              {faqs.map(faq => (
                <SortableFAQItem key={faq.id} faq={faq} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
