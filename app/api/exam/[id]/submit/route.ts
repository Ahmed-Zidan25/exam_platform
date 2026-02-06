import { NextRequest, NextResponse } from 'next/server'
import {
  createExamAttempt,
  saveStudentAnswer,
  completeExamAttempt,
  getQuestionsByExam,
} from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    const { answers } = await request.json()
    const examId = parseInt(params.id)

    // Create exam attempt
    const attempt = await createExamAttempt(parseInt(userId), examId)
    const attemptId = attempt.id

    // Get all questions to check correct answers
    const questions = await getQuestionsByExam(examId)

    // Save answers and calculate score
    let score = 0
    for (const [questionIdStr, selectedOptionId] of Object.entries(answers) as [string, number][]) {
      const questionId = parseInt(questionIdStr)
      await saveStudentAnswer(attemptId, questionId, selectedOptionId)

      // Check if answer is correct
      const question = questions.find((q) => q.id === questionId)
      const correctOption = question?.answer_options?.find((o) => o.id === selectedOptionId && o.is_correct)
      if (correctOption) {
        score++
      }
    }

    // Complete exam attempt
    const completedAttempt = await completeExamAttempt(
      attemptId,
      score,
      questions.length
    )

    return NextResponse.json(
      { message: 'تم إرسال الامتحان بنجاح', attemptId, score, total: questions.length },
      { status: 200 }
    )
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
