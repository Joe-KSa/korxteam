import { useRef } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { extensions } from "@/lib/codemirror";
import { ViewUpdate } from "@codemirror/view";
import { cpp } from "@codemirror/lang-cpp";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { go } from "@codemirror/lang-go";
import { csharp } from "@replit/codemirror-lang-csharp"
import { java } from "@codemirror/lang-java"

interface CodeEditorProps {
  value: string;
  onChange: (value: string, viewUpdate: ViewUpdate) => void;
  lineNumbers?: boolean;
  foldGutter?: boolean;
  urlLanguage: string;
}

const CodeEditor = ({
  value,
  onChange,
  lineNumbers = false,
  foldGutter = false,
  urlLanguage,
}: CodeEditorProps) => {
  let language;

  switch (urlLanguage) {
    case "markdown":
      language = markdown();
      break;
    case "javascript":
      language = javascript();
      break;
    case "cpp":
      language = cpp();
      break;
    case "python":
      language = python();
      break;
    case "go":
      language = go();
      break;
    case "csharp":
      language = csharp();
      break;
    case "java":
      language = java();
      break;
    default:
      language = markdown();
      break;
  }

  const editorRef = useRef<ReactCodeMirrorRef | null>(null);

  return (
    <CodeMirror
      ref={editorRef}
      value={value}
      onChange={onChange}
      extensions={[...extensions, language]}
      basicSetup={{
        lineNumbers: lineNumbers,
        foldGutter: foldGutter,
        highlightActiveLine: false,
      }}
    />
  );
};

export default CodeEditor;
