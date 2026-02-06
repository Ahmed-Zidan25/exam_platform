import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const result = await query(
      `SELECT ea.*, json_build_object('title', e.title, 'id', e.id) as exam
       FROM exam_attempts ea
       JOIN exams e ON ea.exam_id = e.id
       WHERE ea.id = $1`,
      [parseInt(params.attemptId)]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'النتيجة غير موجودة' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0], { status: 200 })
  } catch (error) {
    console.error('Results error:', error)
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
