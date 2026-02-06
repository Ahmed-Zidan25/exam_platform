'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-7xl mb-6">🎓</div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
            منصة الامتحانات التفاعلية
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 text-balance">
            منصة تعليمية متقدمة للطلاب من الصف الثاني الإبتدائي إلى الثالث الإعدادي
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/login">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold bg-transparent">
                إنشاء حساب
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 bg-white/10 border-white/20 text-white">
              <div className="text-4xl mb-4">🐰</div>
              <h3 className="text-xl font-bold mb-2">Progress Bar تفاعلي</h3>
              <p className="text-blue-100">أرنب صغير يتحرك نحو الجزرة مع كل إجابة صحيحة</p>
            </Card>

            <Card className="p-6 bg-white/10 border-white/20 text-white">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">تقارير مفصلة</h3>
              <p className="text-blue-100">عرض النتائج والسجل التاريخي لكل امتحان</p>
            </Card>

            <Card className="p-6 bg-white/10 border-white/20 text-white">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">ألوان ديناميكية</h3>
              <p className="text-blue-100">تغيير الألوان بناءً على جنس الطالب</p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
