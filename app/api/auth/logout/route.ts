import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: 'تم تسجيل الخروج بنجاح' },
    { status: 200 }
  )

  response.cookies.set('userId', '', {
    maxAge: 0,
  })

  return response
}
