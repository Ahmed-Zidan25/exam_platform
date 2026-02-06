import { NextRequest, NextResponse } from 'next/server'
import { getQuestionsByExam } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questions = await getQuestionsByExam(parseInt(params.id))

    return NextResponse.json(questions, { status: 200 })
  } catch (error) {
    console.error('Questions error:', error)
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
