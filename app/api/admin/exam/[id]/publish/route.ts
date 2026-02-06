import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isPublished } = await request.json()

    await query('UPDATE exams SET is_published = $1 WHERE id = $2', [
      isPublished,
      parseInt(params.id),
    ])

    return NextResponse.json(
      { message: 'تم تحديث حالة الامتحان' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
