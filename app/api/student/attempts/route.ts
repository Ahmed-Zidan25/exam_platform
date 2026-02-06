import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    const result = await query(
      `SELECT ea.*, json_build_object('title', e.title, 'id', e.id) as exam
       FROM exam_attempts ea
       JOIN exams e ON ea.exam_id = e.id
       WHERE ea.user_id = $1 AND ea.completed_at IS NOT NULL
       ORDER BY ea.completed_at DESC`,
      [parseInt(userId)]
    )

    return NextResponse.json(result.rows, { status: 200 })
  } catch (error) {
    console.error('Attempts error:', error)
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
