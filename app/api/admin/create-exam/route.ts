import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

interface QuestionData {
  text: string
  options: Array<{
    text: string
    isCorrect: boolean
  }>
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, durationMinutes, questions } = await request.json()

    if (!title || !description || !durationMinutes || !questions || questions.length === 0) {
      return NextResponse.json(
        { message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // Create exam
    const examResult = await query(
      `INSERT INTO exams (title, description, total_questions, duration_minutes, is_published) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id`,
      [title, description, questions.length, durationMinutes, true]
    )

    const examId = examResult.rows[0].id

    // Create questions and answer options
    for (const question of questions as QuestionData[]) {
      const questionResult = await query(
        `INSERT INTO questions (exam_id, text) 
         VALUES ($1, $2) 
         RETURNING id`,
        [examId, question.text]
      )

      const questionId = questionResult.rows[0].id

      // Create answer options
      for (const option of question.options) {
        await query(
          `INSERT INTO answer_options (question_id, option_text, is_correct) 
           VALUES ($1, $2, $3)`,
          [questionId, option.text, option.isCorrect]
        )
      }
    }

    return NextResponse.json(
      { message: 'تم إنشاء الامتحان بنجاح', examId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create exam error:', error)
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
