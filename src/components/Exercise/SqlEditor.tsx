import { useState } from 'react'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-sql'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  loading: boolean
  disabled?: boolean
  /** Blocks submission only (button + Ctrl+Enter) without disabling the editor
   *  itself — used while the SQL engine is still loading, so the student can
   *  keep reading/typing instead of being locked out. */
  submitDisabled?: boolean
}

export function SqlEditor({ value, onChange, onSubmit, loading, disabled, submitDisabled }: Props) {
  const [focused, setFocused] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (!disabled && !submitDisabled && !loading) onSubmit()
    }
  }

  return (
    <div className="space-y-2">
      <div
        className={`border-2 rounded-xl overflow-hidden transition-colors ${
          focused ? 'border-blue-400' : 'border-slate-200'
        } ${disabled ? 'opacity-60' : ''}`}
        onKeyDown={handleKeyDown}
      >
        <div className="bg-slate-800 px-3 py-1.5 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">SQL</span>
          <span className="text-xs text-slate-500">Ctrl+Enter להגשה</span>
        </div>
        <div className="sql-editor bg-slate-900 min-h-[100px]">
          <Editor
            value={value}
            onValueChange={onChange}
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.sql, 'sql')
            }
            padding={16}
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 14,
              lineHeight: '1.6',
              color: '#e2e8f0',
              direction: 'ltr',
              textAlign: 'left',
              minHeight: '100px',
              outline: 'none',
            }}
            placeholder="-- כתוב כאן את השאילתה שלך&#10;SELECT ..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
          />
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={disabled || submitDisabled || loading || !value.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="animate-spin">⟳</span>
            <span>מריץ שאילתה...</span>
          </>
        ) : (
          <>
            <span>▶</span>
            <span>הגש שאילתה</span>
          </>
        )}
      </button>
    </div>
  )
}
