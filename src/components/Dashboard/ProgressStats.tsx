interface Props {
  total: number
  correct: number
  mastered: number
  accuracy: number
  levelsCompleted: number
  totalLevels: number
}

export function ProgressStats({ total, correct, mastered, accuracy, levelsCompleted, totalLevels }: Props) {
  if (total === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      <StatCard
        value={`${levelsCompleted}/${totalLevels}`}
        label="רמות הושלמו"
        icon="📚"
        color="bg-blue-50 border-blue-200"
        valueColor="text-blue-700"
      />
      <StatCard
        value={`${correct}/${total}`}
        label="תרגילים נכונים"
        icon="✅"
        color="bg-green-50 border-green-200"
        valueColor="text-green-700"
      />
      <StatCard
        value={`${mastered}`}
        label="שלטתי (ללא עזרה)"
        icon="⭐"
        color="bg-amber-50 border-amber-200"
        valueColor="text-amber-700"
      />
      <StatCard
        value={`${accuracy}%`}
        label="דיוק"
        icon="🎯"
        color="bg-purple-50 border-purple-200"
        valueColor="text-purple-700"
      />
    </div>
  )
}

function StatCard({
  value,
  label,
  icon,
  color,
  valueColor,
}: {
  value: string
  label: string
  icon: string
  color: string
  valueColor: string
}) {
  return (
    <div className={`border rounded-xl p-3 text-center ${color}`}>
      <div className="text-xl mb-1">{icon}</div>
      <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}
