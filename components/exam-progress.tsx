import { themeColors, type Gender } from '@/lib/theme-colors'

interface ExamProgressProps {
  current: number
  total: number
  correctAnswers: number
  userGender?: string
}

export default function ExamProgress({
  current,
  total,
  correctAnswers,
  userGender,
}: ExamProgressProps) {
  const progressPercentage = (correctAnswers / total) * 100
  const theme = userGender === 'girl' ? themeColors.girl : themeColors.boy

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-slate-700">
          تقدمك: {correctAnswers} من {total} إجابات صحيحة
        </span>
        <span className="text-sm font-medium text-slate-700">
          السؤال {current} من {total}
        </span>
      </div>

      {/* Progress Bar with Rabbit and Carrot */}
      <div className="relative h-20 bg-slate-100 rounded-full overflow-hidden">
        {/* Progress Fill */}
        <div
          className="absolute h-full transition-all duration-500"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: theme.secondary,
            opacity: 0.2,
          }}
        />

        {/* Track */}
        <div className="absolute w-full h-full flex items-center px-4">
          {/* Carrot (Start) */}
          <div className="absolute left-4 text-3xl animate-bounce">🥕</div>

          {/* Rabbit (Progress) */}
          <div
            className="absolute text-3xl transition-all duration-500"
            style={{
              left: `calc(${progressPercentage}% - 24px)`,
            }}
          >
            🐰
          </div>

          {/* Progress Track Line */}
          <div className="absolute w-full h-1 bg-slate-300 top-1/2 transform -translate-y-1/2" />
          <div
            className="absolute h-1 transition-all duration-500"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: theme.primary,
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-slate-600">تم الإجابة عليه</p>
          <p className="text-2xl font-bold" style={{ color: theme.primary }}>
            {Object.keys([]).length}
          </p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-slate-600">إجابات صحيحة</p>
          <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-xs text-slate-600">متبقي</p>
          <p className="text-2xl font-bold text-yellow-600">{total - current + 1}</p>
        </div>
      </div>
    </div>
  )
}
