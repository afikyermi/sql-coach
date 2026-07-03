import type { ValidationResult, Row } from '../../types'

interface Props {
  result: ValidationResult
  isExamMode?: boolean
}

function ResultTable({
  columns,
  rows,
  label,
}: {
  columns: string[]
  rows: Row[]
  label: string
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs font-semibold text-slate-500 mb-1 text-center">{label}</div>
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="result-table w-full text-xs">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-2 py-1.5 text-left font-semibold text-slate-600 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-2 py-2 text-center text-slate-400 italic text-xs">
                    (ריק)
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    {columns.map((col) => (
                      <td key={col} className="px-2 py-1.5 text-left whitespace-nowrap text-slate-700">
                        {row[col] === null || row[col] === undefined ? (
                          <span className="text-slate-400 italic">NULL</span>
                        ) : (
                          String(row[col])
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function FeedbackPanel({ result, isExamMode }: Props) {
  const message = result.alternativeMessage ?? result.errorMessage

  if (result.passed) {
    return (
      <div className="space-y-3">
        {result.alternativeAccepted ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-blue-800 mb-1">תוצאה נכונה!</p>
                {message && <p className="text-sm text-blue-700 whitespace-pre-line">{message}</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold text-green-800 mb-1">מעולה! תשובה נכונה</p>
              </div>
            </div>
          </div>
        )}

        {/* Show result on success */}
        {result.userRows && result.userColumns && result.userRows.length > 0 && (
          <div className="border border-green-200 rounded-xl overflow-hidden">
            <div className="bg-green-50 px-3 py-1.5 border-b border-green-200">
              <span className="text-xs font-semibold text-green-700">תוצאה</span>
            </div>
            <div className="overflow-x-auto">
              <table className="result-table w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {result.userColumns.map((col) => (
                      <th key={col} className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap text-xs">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.userRows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      {result.userColumns!.map((col) => (
                        <td key={col} className="px-3 py-1.5 text-left whitespace-nowrap text-slate-700">
                          {row[col] === null || row[col] === undefined ? (
                            <span className="text-slate-400 italic">NULL</span>
                          ) : (
                            String(row[col])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Wrong answer
  return (
    <div className="space-y-3">
      {/* Error header */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold text-red-800 mb-1">תשובה שגויה</p>
            {message && <p className="text-sm text-red-700 whitespace-pre-line">{message}</p>}
          </div>
        </div>
      </div>

      {/* Diff grid — Learning Mode only */}
      {!isExamMode && result.userColumns && result.expectedColumns && (
        <div>
          <div className="text-xs font-semibold text-slate-500 mb-2">השוואת תוצאות</div>
          <div className="diff-grid gap-3">
            <ResultTable
              columns={result.userColumns}
              rows={result.userRows ?? []}
              label="התוצאה שלך"
            />
            <ResultTable
              columns={result.expectedColumns}
              rows={result.expectedRows ?? []}
              label="התוצאה הצפויה"
            />
          </div>
          {result.userRows && result.expectedRows && (
            <p className="text-xs text-slate-500 mt-2 text-center">
              {result.userRows.length} שורות בתשובה שלך · {result.expectedRows.length} שורות צפויות
            </p>
          )}
        </div>
      )}
    </div>
  )
}
