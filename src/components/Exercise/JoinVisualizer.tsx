import type { TableDisplay } from '../../types'

interface Props {
  leftTable: TableDisplay
  rightTable: TableDisplay
  joinKey: string
  joinType?: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL'
}

const joinLabels: Record<string, string> = {
  INNER: 'INNER JOIN — רק שורות עם התאמה בשתי הטבלאות',
  LEFT: 'LEFT JOIN — כל שורות הטבלה השמאלית, עם NULL אם אין התאמה',
  RIGHT: 'RIGHT JOIN — כל שורות הטבלה הימנית, עם NULL אם אין התאמה',
  FULL: 'FULL OUTER JOIN — כל השורות משתי הטבלאות, NULL עבור חסרים',
}

const joinColors: Record<string, string> = {
  INNER: 'bg-blue-100 border-blue-300 text-blue-800',
  LEFT: 'bg-teal-100 border-teal-300 text-teal-800',
  RIGHT: 'bg-purple-100 border-purple-300 text-purple-800',
  FULL: 'bg-amber-100 border-amber-300 text-amber-800',
}

function MiniTable({
  table,
  joinKey,
  side,
}: {
  table: TableDisplay
  joinKey: string
  side: 'left' | 'right'
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
          {table.tableName}
        </span>
        {side === 'left' && <span className="text-xs text-slate-400">(שמאל)</span>}
        {side === 'right' && <span className="text-xs text-slate-400">(ימין)</span>}
      </div>
      <div className="table-scroll border border-slate-200 rounded-lg overflow-hidden">
        <table className="result-table w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {table.columns.map((col) => (
                <th
                  key={col}
                  className={`px-3 py-2 text-left font-semibold whitespace-nowrap ${
                    col === joinKey
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'text-slate-600'
                  }`}
                >
                  {col}
                  {col === joinKey && <span className="mr-1">🔑</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-3 py-2 text-left whitespace-nowrap ${
                      table.columns[j] === joinKey
                        ? 'bg-yellow-50 font-medium text-yellow-900'
                        : 'text-slate-700'
                    }`}
                  >
                    {cell === null ? (
                      <span className="text-slate-400 italic">NULL</span>
                    ) : (
                      String(cell)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function JoinVisualizer({ leftTable, rightTable, joinKey, joinType = 'INNER' }: Props) {
  return (
    <div className="space-y-3">
      {/* Join type badge */}
      <div className={`border rounded-lg px-3 py-2 text-xs font-medium ${joinColors[joinType]}`}>
        {joinLabels[joinType]}
      </div>

      {/* Two tables side by side (stacked on narrow screens) */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
        <MiniTable table={leftTable} joinKey={joinKey} side="left" />

        {/* Join symbol */}
        <div className="flex flex-row sm:flex-col items-center justify-center py-1 sm:py-0 sm:pt-8 gap-1">
          <div className="w-6 h-px bg-slate-400" />
          <div className="text-lg">⊕</div>
          <div className="w-6 h-px bg-slate-400" />
        </div>

        <MiniTable table={rightTable} joinKey={joinKey} side="right" />
      </div>

      <div className="text-xs text-slate-500 text-center">
        🔑 עמודת החיבור: <code className="font-mono bg-slate-100 px-1 rounded">{joinKey}</code>
      </div>
    </div>
  )
}
