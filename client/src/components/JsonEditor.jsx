import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

export default function JsonEditor({ value, onChange, readOnly = false }) {
  return (
    <div className="text-sm border border-slate-700 rounded overflow-hidden h-full flex flex-col">
      <CodeMirror
        value={value}
        height="100%"
        extensions={[json()]}
        theme={vscodeDark}
        onChange={(val) => {
          if (!readOnly && onChange) onChange(val);
        }}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          autocompletion: true,
        }}
        className="cm-scroller-h-auto flex-1 overflow-hidden" // Custom class to fix scrolling issues
      />
    </div>
  );
}