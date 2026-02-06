'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Exam {
  id: number
  title: string
  description: string
  total_questions: number
  duration_minutes: number
  is_published: boolean
  created_at: string
}

interface AdminStats {
  totalExams: number
  totalStudents: number
  totalAttempts: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({ totalExams: 0, totalStudents: 0, totalAttempts: 0 })
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/admin/stats')
        const statsData = await statsRes.json()
        setStats(statsData)

        const examsRes = await fetch('/api/admin/exams')
        const examsData = await examsRes.json()
        setExams(examsData)
      } catch (error) {
        console.error('Error fetching admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const togglePublish = async (examId: number, currentState: boolean) => {
    try {
      await fetch(`/api/admin/exam/${examId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentState }),
      })

      setExams((prev) =>
        prev.map((exam) =>
          exam.id === examId ? { ...exam, is_published: !currentState } : exam
        )
      )
    } catch (error) {
      console.error('Error toggling publish:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-xl text-slate-300">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">لوحة تحكم الإدارة</h1>
          <Link href="/dashboard">
            <Button variant="outline" className="text-slate-300 bg-transparent">
              العودة للرئيسية
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
            <p className="text-slate-300 mb-2">عدد الامتحانات</p>
            <p className="text-5xl font-bold text-blue-300">{stats.totalExams}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-900 to-green-800 border-green-700">
            <p className="text-slate-300 mb-2">عدد الطلاب</p>
            <p className="text-5xl font-bold text-green-300">{stats.totalStudents}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
            <p className="text-slate-300 mb-2">عدد المحاولات</p>
            <p className="text-5xl font-bold text-purple-300">{stats.totalAttempts}</p>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Link href="/admin/upload-exam">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-medium">
              + رفع امتحان جديد
            </Button>
          </Link>
        </div>

        {/* Exams Table */}
        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="text-left p-4 text-slate-300 font-semibold">العنوان</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">عدد الأسئلة</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">المدة (دقيقة)</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">التاريخ</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">الحالة</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                    <td className="p-4 text-slate-200">{exam.title}</td>
                    <td className="p-4 text-slate-200">{exam.total_questions}</td>
                    <td className="p-4 text-slate-200">{exam.duration_minutes}</td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(exam.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          exam.is_published
                            ? 'bg-green-900 text-green-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}
                      >
                        {exam.is_published ? '✓ منشور' : '⊘ مسودة'}
                      </span>
                    </td>
                    <td className="p-4 space-x-2 flex">
                      <Button
                        onClick={() => togglePublish(exam.id, exam.is_published)}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        {exam.is_published ? 'إخفاء' : 'نشر'}
                      </Button>
                      <Button
                        onClick={() => router.push(`/admin/exam/${exam.id}`)}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        عرض
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {exams.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-slate-400">لا توجد امتحانات حالياً</p>
              <Link href="/admin/upload-exam">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  أنشئ الامتحان الأول
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
