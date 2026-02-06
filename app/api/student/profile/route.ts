import { NextRequest, NextResponse } from 'next/server'
import { getStudentProfile, getUserById } from '@/lib/db'
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

    const profile = await getStudentProfile(parseInt(userId))

    if (!profile) {
      return NextResponse.json(
        { message: 'لم يتم إكمال الملف الشخصي' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile, { status: 200 })
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
