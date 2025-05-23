import React from "react";
import { ScrollShadow, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Message, UIMessage, TextPart, JSONValue } from "ai";
import { UseChatHelpers } from "@ai-sdk/react";
import Markdown from "react-markdown";
import { markdownComponents } from "./markdown-components";
import MarkdownRenderer from "./markdown-renderer";
import { get, last } from "radash";
import { removeWorkflowTag } from "@/ai/utils/strUtil";

interface MessagesProps {
  messages: UIMessage[];
  status: UseChatHelpers["status"];
  data: JSONValue | undefined;
}

interface ReasoningUIPart {
  type: "reasoning";
  /**
   * The reasoning text.
   */
  reasoning: string;
  details: Array<
    | {
        type: "text";
        text: string;
        signature?: string;
      }
    | {
        type: "redacted";
        data: string;
      }
  >;
}

const ReasoningMessagePart = ({ part }: { part: ReasoningUIPart }) => {
  // console.log(part.details);
  
  return (
    <div className="gap-2 mb-1">
      {part.details.map((detail, detailIndex) =>
        detail.type === "text" ? (
          // <Markdown key={detailIndex} components={markdownComponents}>
          //   {detail.text}
          // </Markdown>
          <MarkdownRenderer key={detailIndex} content={detail.text}></MarkdownRenderer>
        ) : (
          "<redacted>"
        ),
      )}
    </div>
  );
};

const TextMessagePart = ({ part }: { part: TextPart }) => {
  return (
    <Markdown components={markdownComponents}>
      {removeWorkflowTag(part.text)}
    </Markdown>
  );
};

export function ChatMessages({ messages, status, data }: MessagesProps) {
  const thinkingRef = React.useRef<HTMLDivElement>(null);
  const answerRef = React.useRef<HTMLDivElement>(null);

  
  // Auto-scroll to bottom when content changes
  React.useEffect(() => {
    if (thinkingRef.current) {
      setTimeout(() => {
        if (thinkingRef.current) {
          thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [messages]);

  const hasReasonning = (message: Message) => {
    // console.log(message);
    
    return message.parts && get(message, 'parts[1].type') === "reasoning";
  };

  React.useEffect(() => {
    if (answerRef.current) {
      setTimeout(() => {
        if (answerRef.current) {
          answerRef.current.scrollTop = answerRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [messages]);
  return (
    <>
      {messages.map((message, index) => {
        return (
          <div className="flex items-start gap-3 mb-3" key={message.id}>
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center mt-1">
              <Icon
                icon={message.role === "user" ? "lucide:user" : "lucide:bot"}
                className="text-gray-600"
                width={14}
              />
            </div>
            {message.role === "user" && (
              <div
                className={`py-2 px-3 max-w-[85%] rounded-md bg-primary-100`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            )}
            {message.role === "assistant" && (
              <div className="flex-1">
                <div className="mb-1 mt-3">
                  {["streaming"].includes(status) &&
                    index === messages.length - 1 && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-500">
                          Thinking
                        </span>
                        <Icon
                          icon="eos-icons:loading"
                          className="text-gray-400"
                          width={14}
                        />
                      </div>
                    )}

                  {hasReasonning(message) && (
                    <ScrollShadow
                      ref={thinkingRef}
                      className="bg-gray-50 border border-gray-200 rounded-md p-2 max-h-[240px] overflow-y-auto text-xs whitespace-pre-wrap"
                      hideScrollBar={true}
                    >
                      {message.parts.map((part, index) => {
                        return (
                          part.type === "reasoning" && (
                            <ReasoningMessagePart
                              key={index}
                              part={part}
                            ></ReasoningMessagePart>
                          )
                        );
                      })}
                    </ScrollShadow>
                  )}
                </div>
                <div className="mt-2">
                  {message.parts.map((part, index) => {
                    return (
                      part.type === "text" && (
                        <TextMessagePart
                          key={index}
                          part={part}
                        ></TextMessagePart>
                      )
                    );
                  })}
                </div>
                {
                  index === messages.length - 1 && get(last(data as any || []), 'isLoadingFlow') === true &&  <div className="flex items-center">
                  <span className="mr-2">Generating workflow</span>       
                  <Spinner classNames={{label: "text-foreground"}} size="sm" label="" variant="dots" />
                </div>
                }
               
              </div>
            )}
          </div>
        );
      })}
      {messages.length && messages[messages.length - 1].role === "user" && (
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center mt-1">
            <Icon icon="lucide:bot" className="text-gray-600" width={14} />
          </div>
          <div className="flex-1">
            <div className="mb-1 mt-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-500">
                  Thinking
                </span>
                <Icon
                  icon="eos-icons:loading"
                  className="text-gray-400"
                  width={14}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
