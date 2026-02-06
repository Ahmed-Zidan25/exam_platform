'use client'

import React from "react"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface ExcelRow {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string // A, B, C, or D
}

export default function UploadExamPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('60')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const parseExcelFile = async (file: File): Promise<ExcelRow[]> => {
    // Dynamic import of xlsx to avoid client-side issues
    const XLSX = await import('xlsx')
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    return jsonData as ExcelRow[]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!title || !description || !file) {
      setMessageType('error')
      setMessage('جميع الحقول مطلوبة')
      return
    }

    setLoading(true)
    try {
      // Parse Excel file
      const excelData = await parseExcelFile(file)

      if (excelData.length === 0) {
        throw new Error('الملف فارغ')
      }

      // Validate data
      for (const row of excelData) {
        if (!row.question || !row.optionA || !row.optionB || !row.optionC || !row.optionD || !row.correctAnswer) {
          throw new Error('جميع الأعمدة مطلوبة: question, optionA, optionB, optionC, optionD, correctAnswer')
        }
      }

      // Send to API
      const response = await fetch('/api/admin/create-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          durationMinutes: parseInt(durationMinutes),
          questions: excelData.map((row) => ({
            text: row.question,
            options: [
              { text: row.optionA, isCorrect: row.correctAnswer === 'A' },
              { text: row.optionB, isCorrect: row.correctAnswer === 'B' },
              { text: row.optionC, isCorrect: row.correctAnswer === 'C' },
              { text: row.optionD, isCorrect: row.correctAnswer === 'D' },
            ],
          })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'فشل إنشاء الامتحان')
      }

      setMessageType('success')
      setMessage(`تم إنشاء الامتحان بنجاح! (${excelData.length} سؤال)`)

      // Reset form
      setTitle('')
      setDescription('')
      setDurationMinutes('60')
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error: any) {
      setMessageType('error')
      setMessage(error.message || 'حدث خطأ أثناء معالجة الملف')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-blue-400 hover:text-blue-300 text-sm mb-4 block">
            ← العودة للإدارة
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">رفع امتحان جديد</h1>
          <p className="text-slate-400">أضف امتحان جديد من ملف Excel</p>
        </div>

        {/* Info Card */}
        <Card className="p-6 mb-8 bg-slate-800 border-slate-700">
          <h3 className="font-bold text-white mb-4">تنسيق ملف Excel المطلوب:</h3>
          <div className="bg-slate-900 p-4 rounded text-slate-300 text-sm space-y-2">
            <p><span className="text-green-400">question</span> - نص السؤال</p>
            <p><span className="text-green-400">optionA</span> - الخيار الأول</p>
            <p><span className="text-green-400">optionB</span> - الخيار الثاني</p>
            <p><span className="text-green-400">optionC</span> - الخيار الثالث</p>
            <p><span className="text-green-400">optionD</span> - الخيار الرابع</p>
            <p><span className="text-green-400">correctAnswer</span> - رقم الإجابة الصحيحة (A أو B أو C أو D)</p>
          </div>
        </Card>

        {/* Form */}
        <Card className="p-8 bg-slate-800 border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                عنوان الامتحان
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: امتحان الرياضيات - الترم الأول"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                وصف الامتحان
              </label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف مختصر للامتحان"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                المدة الزمنية (دقيقة)
              </label>
              <Input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="60"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                ملف Excel
              </label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-slate-300 font-medium">
                    {file ? file.name : 'انقر لاختيار ملف أو اسحب وأفلت'}
                  </p>
                  <p className="text-slate-500 text-sm mt-2">ملفات Excel (.xlsx, .xls, .csv)</p>
                </label>
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  messageType === 'success'
                    ? 'bg-green-900 border border-green-700 text-green-200'
                    : 'bg-red-900 border border-red-700 text-red-200'
                }`}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium"
            >
              {loading ? 'جاري المعالجة...' : 'إنشاء الامتحان'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
