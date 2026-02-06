import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth'
import { getUser } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني وكلمة المرور مطلوبة' },
        { status: 400 }
      )
    }

    // Find user
    const user = await getUser(email)

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    // Set session cookie
    const response = NextResponse.json(
      { message: 'تم تسجيل الدخول بنجاح', user: { id: user.id, email: user.email } },
      { status: 200 }
    )

    response.cookies.set('userId', String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
