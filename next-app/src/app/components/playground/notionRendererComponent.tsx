"use client";
import { NotionRenderer as NotionRendererLib } from "react-notion-x";
import "react-notion-x/src/styles.css";
import dynamic from "next/dynamic";
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation),
);

import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import CodeBlock from "./codeblock";

export const NotionRendererComponent = ({ recordMap }: { recordMap: any }) => {
  return (
    <div className="overflow-y-auto">
      <div>
        <style>
          {`
            :root {
              --bg-color: #ffffff;
              --fg-color: #333333;
            }
            .dark-mode {
              --bg-color: #1A1A1A;
              --fg-color: #E0E0E0;
            }
            .notion {
              background-color: var(--bg-color);
              color: var(--fg-color);
              max-width: 100%;
              overflow-wrap: break-word;
              word-wrap: break-word;
              word-break: break-word;
              border-radius: 1rem;
            }
            .notion-page {
              padding: 1rem !important;
              width: 100% !important;
              max-width: 100% !important;
            }
            .notion-text {
              padding: 0.5rem 0;
              width: 100% !important;
              max-width: 100% !important;
            }
            .notion-h1,
            .notion-h2,
            .notion-h3 {
              margin-top: 1.5rem;
              margin-bottom: 0.5rem;
              width: 100% !important;
              max-width: 100% !important;
            }
            .notion-asset-wrapper {
              max-width: 100%;
            }
            .notion-asset-wrapper img {
              max-width: 100%;
              height: auto;
            }
            .notion-code {
              white-space: pre-wrap;
              word-break: break-all;
            }
            @media (max-width: 640px) {
              .notion-page {
                padding: 0.5rem !important;
              }
            }
          `}
        </style>
        <NotionRendererLib
          components={{
            Code: CodeBlock,
            Equation,
          }}
          recordMap={recordMap}
          fullPage={true}
          darkMode={false}
          disableHeader={true}
          className="notion-renderer"
        />
      </div>
    </div>
  );
};
