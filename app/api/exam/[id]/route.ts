import { NextRequest, NextResponse } from 'next/server'
import { getExamById } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exam = await getExamById(parseInt(params.id))

    if (!exam) {
      return NextResponse.json(
        { message: 'الامتحان غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json(exam, { status: 200 })
  } catch (error) {
    console.error('Exam error:', error)
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
