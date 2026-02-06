'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getThemeCSSVariables } from '@/lib/theme-colors'
import ExamProgress from '@/components/exam-progress'

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
  duration_minutes: number
  total_questions: number
}

export default function ExamPage() {
  const router = useRouter()
  const params = useParams()
  const examId = params.id as string
  
  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [studentProfile, setStudentProfile] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

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

        const examRes = await fetch(`/api/exam/${examId}`)
        const examData = await examRes.json()
        setExam(examData)
        setTimeLeft(examData.duration_minutes * 60)

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
  }, [examId, router])

  // Timer effect
  useEffect(() => {
    if (!timeLeft || submitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev ? prev - 1 : null
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, submitted])

  const handleSelectAnswer = (optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: optionId,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/exam/${examId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) {
        throw new Error('فشل إرسال الامتحان')
      }

      const result = await response.json()
      setSubmitted(true)

      setTimeout(() => {
        router.push(`/results/${result.attemptId}`)
      }, 2000)
    } catch (error) {
      console.error('Submit error:', error)
      alert('حدث خطأ أثناء إرسال الامتحان')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-600">جاري تحميل الامتحان...</div>
      </div>
    )
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-xl text-slate-600">الامتحان غير متاح</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            العودة للرئيسية
          </Button>
        </Card>
      </div>
    )
  }

  const themeVars = getThemeCSSVariables(studentProfile?.gender)
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((Object.keys(answers).length) / questions.length) * 100
  const correctAnswersCount = Object.entries(answers).filter(([qId, optionId]) => {
    const question = questions.find((q) => q.id === parseInt(qId))
    const option = question?.answer_options.find((o) => o.id === optionId)
    return option?.is_correct
  }).length

  return (
    <div
      className="min-h-screen p-4 transition-colors duration-300"
      style={themeVars as React.CSSProperties}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">{exam.title}</h1>
          <div className="text-2xl font-bold text-red-600">
            {timeLeft ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}` : '0:00'}
          </div>
        </div>

        {/* Progress Bar with Rabbit and Carrot */}
        <ExamProgress
          current={currentQuestionIndex + 1}
          total={questions.length}
          correctAnswers={correctAnswersCount}
          userGender={studentProfile?.gender}
        />

        {/* Question Card */}
        <Card className="p-8 mb-6">
          <p className="text-sm text-slate-600 mb-4">
            السؤال {currentQuestionIndex + 1} من {questions.length}
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{currentQuestion.text}</h2>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.answer_options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  answers[currentQuestion.id] === option.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <span className="font-medium">{option.text}</span>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentQuestionIndex > 0 && (
              <Button onClick={handlePrev} variant="outline" className="flex-1 bg-transparent">
                السؤال السابق
              </Button>
            )}
            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
                السؤال التالي
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitted}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {submitted ? 'جاري الإرسال...' : 'إرسال الامتحان'}
              </Button>
            )}
          </div>
        </Card>

        {/* Question Navigator */}
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-700 mb-4">الأسئلة</p>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`p-2 rounded text-sm font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[questions[index].id]
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200 text-slate-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
