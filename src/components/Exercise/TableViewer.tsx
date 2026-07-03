import type { TableDisplay } from '../../types'

interface Props {
  table: TableDisplay
}

export function TableViewer({ table }: Props) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
          {table.tableName}
        </span>
        <span className="text-xs text-slate-400">({table.rows.length} שורות)</span>
      </div>
      <div className="table-scroll border border-slate-200 rounded-lg overflow-hidden">
        <table className="result-table w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {table.columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-left font-semibold whitespace-nowrap text-slate-700 text-xs"
                >
                  {col}
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
                    className="px-3 py-1.5 text-left whitespace-nowrap text-slate-700"
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
