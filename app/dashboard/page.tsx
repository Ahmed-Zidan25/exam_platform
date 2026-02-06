'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getThemeCSSVariables } from '@/lib/theme-colors'

interface StudentProfile {
  gender: string
  grade: string
  semester: string
  subject: string
}

interface Exam {
  id: number
  title: string
  description: string
  total_questions: number
  duration_minutes: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch('/api/student/profile')
        if (!profileRes.ok) {
          router.push('/login')
          return
        }
        const profile = await profileRes.json()
        setStudentProfile(profile)

        const examsRes = await fetch('/api/exams')
        const examsData = await examsRes.json()
        setExams(examsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-600">جاري التحميل...</div>
      </div>
    )
  }

  const themeVars = getThemeCSSVariables(studentProfile?.gender)

  return (
    <div
      className="min-h-screen p-4 transition-colors duration-300"
      style={themeVars as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">مرحباً بعودتك! 👋</h1>
            <p className="text-slate-600 mt-2">
              {studentProfile?.grade} - {studentProfile?.subject}
            </p>
          </div>
          <Button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              router.push('/login')
            }}
            variant="outline"
          >
            تسجيل خروج
          </Button>
        </div>

        {/* Student Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-pink-50 to-rose-50">
            <p className="text-sm text-slate-600">الصف</p>
            <p className="text-2xl font-bold text-slate-900">{studentProfile?.grade}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
            <p className="text-sm text-slate-600">الترم</p>
            <p className="text-2xl font-bold text-slate-900">{studentProfile?.semester}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
            <p className="text-sm text-slate-600">المادة</p>
            <p className="text-2xl font-bold text-slate-900">{studentProfile?.subject}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50">
            <p className="text-sm text-slate-600">الامتحانات المتاحة</p>
            <p className="text-2xl font-bold text-slate-900">{exams.length}</p>
          </Card>
        </div>

        {/* Exams Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-slate-900">الامتحانات المتاحة</h2>
          {exams.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-slate-600 text-lg">لا توجد امتحانات متاحة حالياً</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exams.map((exam) => (
                <Card key={exam.id} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{exam.title}</h3>
                  <p className="text-slate-600 mb-4">{exam.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-slate-600">
                      {exam.total_questions} أسئلة
                    </span>
                    <span className="text-sm text-slate-600">
                      {exam.duration_minutes} دقيقة
                    </span>
                  </div>
                  <Button
                    onClick={() => router.push(`/exam/${exam.id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    ابدأ الامتحان
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
