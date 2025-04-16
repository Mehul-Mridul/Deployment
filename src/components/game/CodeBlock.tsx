
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <div className="cyber-container bg-[#1a1f2c] p-0 border-cyber-border">
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          background: '#12151f',
          padding: '1rem',
          borderRadius: '0.25rem',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          margin: 0
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
