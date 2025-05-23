import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Icon } from "@iconify/react";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // const processedContent = React.useMemo(() => {
  //   // Then process literal \n sequences (not actual newlines) to line break placeholders
  //   let processed = content.replace(
  //     /\n/g, 
  //     '<span class="newline-placeholder"></span>'
  //   );
    
  //   return processed;
  // }, [content]);

  // Custom components for ReactMarkdown
  const components = {
    h1: ({ node, ...props }: any) => (
      <h1 
        className="text-3xl font-bold text-foreground-900 mb-4 border-b border-default-200 pb-2" 
        {...props} 
      />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 
        className="text-2xl font-semibold text-foreground-800 mt-6 mb-3" 
        {...props} 
      />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 
        className="text-xl font-semibold text-foreground-700 mt-5 mb-2" 
        {...props} 
      />
    ),
    h4: ({ node, ...props }: any) => (
      <h4 
        className="text-lg font-medium text-foreground-600 mt-4 mb-2" 
        {...props} 
      />
    ),
    p: ({ node, ...props }: any) => (
      <p className="text-foreground-600 mb-6 leading-7 text-md" {...props} /> // Changed mb-4 to mb-6 for more consistent paragraph spacing
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="text-foreground-600" {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <a 
        className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary-200 rounded-sm" 
        target="_blank" 
        rel="noopener noreferrer" 
        {...props} 
      />
    ),
    // blockquote: ({ node, ...props }: any) => (
    //   <blockquote 
    //     className="border-l-4 border-primary-200 pl-4 py-1 mb-4 italic text-foreground-500 bg-content2 bg-opacity-50 rounded-sm" 
    //     {...props} 
    //   />
    // ),
    // code: ({ node, inline, className, children, ...props }: any) => {
    //   const match = /language-(\w+)/.exec(className || "");
      
    //   if (inline) {
    //     return (
    //       <code 
    //         className="px-1.5 py-0.5 rounded-sm bg-content2 text-foreground-700 font-mono text-sm" 
    //         {...props}
    //       >
    //         {children}
    //       </code>
    //     );
    //   }
      
    //   return (
    //     <Code
    //       className="font-mono text-sm w-full mb-4"
    //       color="default"
    //     >
    //       {String(children).replace(/\n$/, "")}
    //     </Code>
    //   );
    // },
    hr: ({ node, ...props }: any) => (
      <hr 
        className="my-6 border-t border-default-200" 
        {...props} 
      />
    ),
    img: ({ node, ...props }: any) => (
      <img 
        className="max-w-full h-auto rounded-medium my-4" 
        {...props} 
        alt={props.alt || ""}
      />
    ),
    // Process the icon placeholder spans
    span: ({ node, ...props }: any) => {
      // if (props.className === "newline-placeholder") {
      //   return <br/>;
      // }
      return <span {...props} />;
    }
  };

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;