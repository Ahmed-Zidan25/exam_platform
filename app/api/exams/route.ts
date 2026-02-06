import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const result = await query(
      'SELECT id, title, description, total_questions, duration_minutes FROM exams WHERE is_published = true ORDER BY created_at DESC'
    )
    return NextResponse.json(result.rows, { status: 200 })
  } catch (error) {
    console.error('Exams error:', error)
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
