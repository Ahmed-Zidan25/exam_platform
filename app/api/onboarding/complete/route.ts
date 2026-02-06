import { NextRequest, NextResponse } from 'next/server'
import { createStudentProfile } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { gender, grade, semester, subject } = await request.json()
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { message: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    if (!gender || !grade || !semester || !subject) {
      return NextResponse.json(
        { message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    await createStudentProfile(
      parseInt(userId),
      grade,
      semester,
      subject,
      gender
    )

    return NextResponse.json(
      { message: 'تم حفظ البيانات بنجاح' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
