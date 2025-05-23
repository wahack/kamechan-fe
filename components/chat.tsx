import React from "react";
import { Card, Button, ScrollShadow } from "@heroui/react";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";
import { useChat } from "@ai-sdk/react";

export function Chat({ id }: { id: string }) {
  const { input, setInput, append, messages, status, stop, data, setData } = useChat({
    id,
  });
 
  const isGeneratingResponse = ["streaming", "submitted"].includes(status);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or thinking state changes
  React.useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  }, []);

  function onSubmit() {
    setInput("");
    setData(undefined);
    append({
      role: "user",
      content: input,
      createdAt: new Date(),
    });
  }

  return (
    // <div className="flex justify-center items-center h-screen bg-gray-100">
    // <Card className="w-full max-w-xl h-[80vh]  pt-6">
    <div className="flex flex-col h-full pt-8 px-4">
      <ScrollShadow
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide"
        hideScrollBar={true}
      >
        <ChatMessages messages={messages} status={status} data={data}></ChatMessages>
      </ScrollShadow>

      <div className="p-3">
        {/* <div className="flex gap-2 m-2">
          <Button size="sm" variant="flat" className="text-xs">
            create a order
          </Button>
          <Button size="sm" variant="flat" className="text-xs">
            look up the price
          </Button>
        </div> */}
        <ChatInput
          isInstructMode={false}
          input={input}
          setInput={setInput}
          handleSubmit={onSubmit}
          isLoading={isGeneratingResponse}
        ></ChatInput>
      </div>
    </div>
    // </Card>
    // </div>
  );
}
