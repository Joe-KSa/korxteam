import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import "github-markdown-css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export const MarkdownPreview = ({ value }: { value: string }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[[gfm, { breaks: true }], remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {value.replace(/^"(.*)"$/, "$1").replace(/\\n/g, "\n")}
      </ReactMarkdown>
    </div>
  );
};
