'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Question {
  id: number
  text: string
  answer_options: Array<{
    id: number
    text: string
    is_correct: boolean
  }>
}

interface Exam {
  id: number
  title: string
  description: string
  total_questions: number
  duration_minutes: number
  is_published: boolean
}

export default function ExamDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const examId = params.id as string

  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examRes = await fetch(`/api/exam/${examId}`)
        const examData = await examRes.json()
        setExam(examData)

        const questionsRes = await fetch(`/api/exam/${examId}/questions`)
        const questionsData = await questionsRes.json()
        setQuestions(questionsData)
      } catch (error) {
        console.error('Error fetching exam:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [examId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-xl text-slate-300">جاري التحميل...</div>
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Card className="p-8 text-center bg-slate-800 border-slate-700">
          <p className="text-xl text-slate-300">الامتحان غير موجود</p>
          <Link href="/admin">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
              العودة للإدارة
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <Link href="/admin" className="text-blue-400 hover:text-blue-300 text-sm mb-4 block">
              ← العودة للإدارة
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">{exam.title}</h1>
            <p className="text-slate-400">{exam.description}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-lg font-medium ${
              exam.is_published
                ? 'bg-green-900 text-green-300'
                : 'bg-yellow-900 text-yellow-300'
            }`}
          >
            {exam.is_published ? '✓ منشور' : '⊘ مسودة'}
          </span>
        </div>

        {/* Exam Info */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-slate-800 border-slate-700">
            <p className="text-slate-400 text-sm mb-2">عدد الأسئلة</p>
            <p className="text-3xl font-bold text-blue-300">{exam.total_questions}</p>
          </Card>
          <Card className="p-6 bg-slate-800 border-slate-700">
            <p className="text-slate-400 text-sm mb-2">المدة الزمنية</p>
            <p className="text-3xl font-bold text-green-300">{exam.duration_minutes} دقيقة</p>
          </Card>
          <Card className="p-6 bg-slate-800 border-slate-700">
            <p className="text-slate-400 text-sm mb-2">عدد المحاولات</p>
            <p className="text-3xl font-bold text-purple-300">--</p>
          </Card>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">الأسئلة</h2>
          {questions.map((question, index) => (
            <Card key={question.id} className="p-6 bg-slate-800 border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">
                {index + 1}. {question.text}
              </h3>

              <div className="space-y-2">
                {question.answer_options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-3 rounded-lg border ${
                      option.is_correct
                        ? 'bg-green-900 border-green-700 text-green-300'
                        : 'bg-slate-700 border-slate-600 text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {option.is_correct && <span className="text-lg">✓</span>}
                      {option.text}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
