interface Props {
  hints: string[]
  hintsRevealed: number
  onRevealHint: () => void
  onRevealSolution: () => void
  solutionRevealed: boolean
  solution: string
  isExamMode?: boolean
}

export function HintPanel({
  hints,
  hintsRevealed,
  onRevealHint,
  onRevealSolution,
  solutionRevealed,
  solution,
  isExamMode,
}: Props) {
  if (isExamMode) return null

  return (
    <div className="space-y-3">
      {/* Revealed hints */}
      {hintsRevealed > 0 && (
        <div className="space-y-2">
          {hints.slice(0, hintsRevealed).map((hint, i) => (
            <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 fade-in">
              <div className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">💡</span>
                <div>
                  <span className="text-xs font-medium text-amber-600 block mb-0.5">
                    רמז {i + 1}
                  </span>
                  <span className="text-sm text-amber-900">{hint}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Solution */}
      {solutionRevealed && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-500">✨</span>
            <span className="text-sm font-semibold text-purple-700">פתרון</span>
          </div>
          <pre className="sql-editor text-sm text-purple-900 bg-purple-100 rounded px-3 py-2 overflow-x-auto whitespace-pre-wrap">
            {solution}
          </pre>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {hintsRevealed < hints.length && !solutionRevealed && (
          <button
            onClick={onRevealHint}
            className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
          >
            💡 {hintsRevealed === 0 ? 'רמז' : `רמז ${hintsRevealed + 1}`}
          </button>
        )}
        {!solutionRevealed && (
          <button
            onClick={onRevealSolution}
            className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
          >
            ✨ הצג פתרון
          </button>
        )}
      </div>
    </div>
  )
}
