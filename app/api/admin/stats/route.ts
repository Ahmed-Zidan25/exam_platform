import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const examsResult = await query('SELECT COUNT(*) as count FROM exams')
    const studentsResult = await query('SELECT COUNT(*) as count FROM users')
    const attemptsResult = await query('SELECT COUNT(*) as count FROM exam_attempts WHERE completed_at IS NOT NULL')

    return NextResponse.json(
      {
        totalExams: parseInt(examsResult.rows[0].count),
        totalStudents: parseInt(studentsResult.rows[0].count),
        totalAttempts: parseInt(attemptsResult.rows[0].count),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
