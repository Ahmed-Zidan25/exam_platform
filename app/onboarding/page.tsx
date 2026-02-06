'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getThemeCSSVariables, type Gender } from '@/lib/theme-colors'

const GRADES = [
  'الثاني الإبتدائي',
  'الثالث الإبتدائي',
  'الرابع الإبتدائي',
  'الخامس الإبتدائي',
  'السادس الإبتدائي',
  'الأول الإعدادي',
  'الثاني الإعدادي',
  'الثالث الإعدادي',
]

const SEMESTERS = ['الترم الأول', 'الترم الثاني']

const SUBJECTS = ['اللغة العربية', 'الرياضيات', 'العلوم', 'الدراسات الاجتماعية', 'اللغة الإنجليزية']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    gender: '' as Gender | '',
    grade: '',
    semester: '',
    subject: '',
  })

  const themeVars = getThemeCSSVariables(formData.gender)

  const handleGenderSelect = (gender: Gender) => {
    setFormData((prev) => ({ ...prev, gender }))
    setStep(2)
  }

  const handleNext = () => {
    if (step === 2 && !formData.grade) return
    if (step === 3 && !formData.semester) return
    if (step === 4 && !formData.subject) return

    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('فشل حفظ البيانات')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('حدث خطأ أثناء حفظ البيانات')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={themeVars as React.CSSProperties}
    >
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">مرحباً بك! 🎓</h1>
          <p className="text-slate-600">الخطوة {step} من 4</p>
        </div>

        {/* Step 1: Gender Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">حدد جنسك</h2>
              <p className="text-slate-600">سيساعدنا هذا في تخصيص تجربتك</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleGenderSelect('girl')}
                className="p-8 border-2 border-pink-300 rounded-xl hover:bg-pink-50 transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-4">👧</div>
                <p className="font-semibold text-lg">فتاة</p>
              </button>

              <button
                onClick={() => handleGenderSelect('boy')}
                className="p-8 border-2 border-blue-300 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-4">👦</div>
                <p className="font-semibold text-lg">فتى</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Grade Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">اختر صفك الدراسي</h2>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {GRADES.map((grade) => (
                <button
                  key={grade}
                  onClick={() => setFormData((prev) => ({ ...prev, grade }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.grade === grade
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Semester Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">اختر الترم</h2>
            <div className="grid grid-cols-2 gap-4">
              {SEMESTERS.map((semester) => (
                <button
                  key={semester}
                  onClick={() => setFormData((prev) => ({ ...prev, semester }))}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    formData.semester === semester
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {semester}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Subject Selection */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">اختر المادة</h2>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setFormData((prev) => ({ ...prev, subject }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.subject === subject
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <Button
              onClick={() => setStep(step - 1)}
              variant="outline"
              className="flex-1"
            >
              السابق
            </Button>
          )}

          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.gender) ||
                (step === 2 && !formData.grade) ||
                (step === 3 && !formData.semester)
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              التالي
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !formData.subject}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? 'جاري الحفظ...' : 'ابدأ الآن'}
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </Card>
    </div>
  )
}
