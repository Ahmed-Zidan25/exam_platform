'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getThemeCSSVariables } from '@/lib/theme-colors'

interface ExamAttempt {
  id: number
  exam: {
    title: string
    id: number
  }
  score: number
  total_questions: number
  completed_at: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [attempts, setAttempts] = useState<ExamAttempt[]>([])
  const [studentProfile, setStudentProfile] = useState<any>(null)
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

        const attemptsRes = await fetch('/api/student/attempts')
        const attemptsData = await attemptsRes.json()
        setAttempts(attemptsData)
      } catch (error) {
        console.error('Error fetching history:', error)
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">سجل الامتحانات 📊</h1>
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
          >
            العودة
          </Button>
        </div>

        {attempts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-slate-600 mb-4">لم تحل أي امتحانات بعد</p>
            <Button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              ابدأ الآن
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
                <p className="text-sm text-slate-600">عدد الامتحانات</p>
                <p className="text-4xl font-bold text-blue-600">{attempts.length}</p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                <p className="text-sm text-slate-600">متوسط الدرجات</p>
                <p className="text-4xl font-bold text-green-600">
                  {Math.round(
                    (attempts.reduce((sum, a) => sum + (a.score / a.total_questions) * 100, 0) /
                      attempts.length) || 0
                  )}%
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <p className="text-sm text-slate-600">إجمالي الأسئلة</p>
                <p className="text-4xl font-bold text-purple-600">
                  {attempts.reduce((sum, a) => sum + a.total_questions, 0)}
                </p>
              </Card>
            </div>

            {/* Attempts List */}
            <div className="space-y-4">
              {attempts.map((attempt) => {
                const percentage = Math.round((attempt.score / attempt.total_questions) * 100)
                const isPassed = percentage >= 50

                return (
                  <Card
                    key={attempt.id}
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(`/results/${attempt.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {attempt.exam.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {new Date(attempt.completed_at).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-slate-600 mb-1">درجتك</p>
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl"
                            style={{
                              backgroundColor: isPassed ? '#dcfce7' : '#fef2f2',
                              color: isPassed ? '#22c55e' : '#ef4444',
                            }}
                          >
                            {percentage}%
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-slate-600 mb-1">النتيجة</p>
                          <p className="text-lg font-bold text-slate-900">
                            {attempt.score}/{attempt.total_questions}
                          </p>
                          <p
                            className="text-xs font-semibold mt-1"
                            style={{
                              color: isPassed ? '#22c55e' : '#ef4444',
                            }}
                          >
                            {isPassed ? '✓ ناجح' : '✗ راسب'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
