'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getThemeCSSVariables } from '@/lib/theme-colors'

interface ExamResult {
  id: number
  score: number
  total_questions: number
  completed_at: string
  exam: {
    title: string
  }
}

export default function ResultsPage() {
  const router = useRouter()
  const params = useParams()
  const attemptId = params.attemptId as string
  
  const [result, setResult] = useState<ExamResult | null>(null)
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

        const resultRes = await fetch(`/api/results/${attemptId}`)
        const resultData = await resultRes.json()
        setResult(resultData)
      } catch (error) {
        console.error('Error fetching results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [attemptId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-600">جاري تحميل النتائج...</div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-xl text-slate-600">النتيجة غير متاحة</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            العودة للرئيسية
          </Button>
        </Card>
      </div>
    )
  }

  const themeVars = getThemeCSSVariables(studentProfile?.gender)
  const percentage = Math.round((result.score / result.total_questions) * 100)
  const isPassed = percentage >= 50

  return (
    <div
      className="min-h-screen p-4 transition-colors duration-300"
      style={themeVars as React.CSSProperties}
    >
      <div className="max-w-2xl mx-auto">
        {/* Celebration/Result Header */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">
            {isPassed ? '🎉' : '💪'}
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {isPassed ? 'مبروك! 🌟' : 'حاول مرة أخرى'}
          </h1>
          <p className="text-xl text-slate-600">
            {result.exam.title}
          </p>
        </div>

        {/* Score Card */}
        <Card className="p-8 mb-6 text-center">
          <p className="text-slate-600 mb-4">درجتك</p>
          <div className="inline-block relative mb-6">
            <div
              className="text-center"
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isPassed ? '#dcfce7' : '#fef2f2',
                border: `4px solid ${isPassed ? '#22c55e' : '#f87171'}`,
              }}
            >
              <p className="text-6xl font-bold" style={{ color: isPassed ? '#22c55e' : '#ef4444' }}>
                {percentage}%
              </p>
              <p className="text-sm text-slate-600 mt-2">
                {result.score} من {result.total_questions}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-slate-600">صحيح</p>
              <p className="text-2xl font-bold text-green-600">{result.score}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-slate-600">خطأ</p>
              <p className="text-2xl font-bold text-red-600">{result.total_questions - result.score}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-slate-600">المجموع</p>
              <p className="text-2xl font-bold text-blue-600">{result.total_questions}</p>
            </div>
          </div>
        </Card>

        {/* Result Message */}
        <Card className="p-6 mb-6 border-l-4" style={{ borderLeftColor: isPassed ? '#22c55e' : '#f87171' }}>
          <p className="text-center text-lg font-semibold text-slate-900">
            {isPassed
              ? 'أداء رائع! تابع التقدم وحل المزيد من الامتحانات'
              : 'لا تيأس! حاول مرة أخرى وستحسن درجاتك'}
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => router.push('/dashboard')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            العودة للرئيسية
          </Button>
          <Button
            onClick={() => router.push(`/history`)}
            variant="outline"
            className="flex-1"
          >
            عرض السجل
          </Button>
        </div>

        {/* Attempt Date */}
        <p className="text-center text-sm text-slate-500 mt-6">
          تم الامتحان في {new Date(result.completed_at).toLocaleDateString('ar-EG')}
        </p>
      </div>
    </div>
  )
}
