import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { createUser } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json()

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = hashPassword(password)

    // Create user
    const user = await createUser(email, passwordHash, fullName)

    // Set session cookie (simplified - in production use httpOnly)
    const response = NextResponse.json(
      { message: 'تم التسجيل بنجاح', user },
      { status: 201 }
    )

    response.cookies.set('userId', String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Register error:', error)
    if (error.message.includes('duplicate key')) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { message: 'خطأ في السيرفر' },
      { status: 500 }
    )
  }
}
