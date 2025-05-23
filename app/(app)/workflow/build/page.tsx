"use client";
import React from "react";

import { BuildChatIsEmpty } from "./empty-chat";
import { ChatInput } from "@/components/chat-input";
import { useChat } from "@ai-sdk/react";
import { Chat } from "@/components/chat";
import { Card, CardBody, Spacer, Button, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { MermaidRenderer } from "@/components/mermaid-renderer";
import { get, last } from "radash";
import { extractWorkflowTag } from "@/ai/utils/strUtil";
import { WorkflowModal } from "@/components/workflow-modal";
import { NodeDocSearch } from "@/components/node-doc-search";

export default function BuildWorkflow() {
  const { append, messages, id, setInput, input } = useChat();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showDocSearch, setShowDocSearch] = React.useState(true);
  const [showInfoPanel, setShowInfoPanel] = React.useState(true);

  const renderMermaid = React.useMemo(() => {
    return extractWorkflowTag(last(messages)?.content || "");
  }, [messages]);

  const messageId = React.useMemo(() => {
    return last(messages)?.id;
  }, [messages]);

  function onSubmit() {
    setInput("");
    append({
      role: "user",
      content: input,
      createdAt: new Date(),
    });
  }
  const handleExecute = () => {
    onOpen();
  };
  function onSelectDoc (doc: any) {
    setInput(input + doc.name + ': ' + doc.summary)
  }
  return (
    <div className="h-full bg-gradient-to-br from-content-light to-white dark:from-gray-900 dark:to-gray-950 bg-dotted-pattern">
      <div className="flex flex-1 overflow-hidden relative h-full">
        {/* Document Search Module - with Card wrapper */}
        <div
          className={`${showDocSearch ? 'translate-x-0 w-1/5' : '-translate-x-full w-0 min-w-0'
            } h-full z-10 relative transition-all duration-300 md:flex-shrink-0 lg:flex-shrink-0`}
        >
          <NodeDocSearch onSelectDoc={onSelectDoc} />
        </div>
        <div className="flex-1 overflow-auto bg-content-light dark:bg-gray-800/30 relative z-0">
          <div className="h-full overflow-hidden">
            <div
              className="h-full w-full shadow-xl dark:bg-content-dark backdrop-blur-sm bg-opacity-70 dark:bg-opacity-80 border border-white/50 dark:border-gray-700/50"
            >
              <main className="h-full flex flex-col">
                <Card className="h-full m-4 bg-white" shadow="md" radius="md">
                  {!messages.length ? (
                    <div className="max-w-[620px] mx-auto p-3 sm:p-4 md:p-6 pb-32">
                      <BuildChatIsEmpty></BuildChatIsEmpty>
                      <ChatInput
                        isInstructMode
                        input={input}
                        setInput={setInput}
                        handleSubmit={onSubmit}
                        isLoading={false}
                      ></ChatInput>
                    </div>
                  ) : (
                    <Chat id={id}></Chat>
                  )}
                </Card>
              </main>
            </div>
          </div>
        </div>

        <div
          className={`${showInfoPanel ? 'translate-x-0 2xl:w-[420px] w-[280px]' : 'translate-x-full w-0 min-w-0'
            } h-full z-10 relative transition-all duration-300 md:flex-shrink-0 lg:flex-shrink-0`}
        >
          <Card
            className="w-full h-full border-none rounded-none shadow-none overflow-hidden"
            radius="none"
          >
            <div className="w-full h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-y-auto flex flex-col border-l border-gray-100 dark:border-gray-700">
              {/* Simplified header with just title and button */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-accent-pink/5 to-accent-orange/10 dark:from-accent-pink/10 dark:to-accent-orange/20 px-4 py-3">
                <div className="flex items-center">
                  <Icon icon="lucide:git-branch" className="mr-2 text-accent-pink" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Workflow Flowchart</span>
                </div>

                {/* Execute button */}
                <Button
                  size="sm"
                  color="primary"
                  onPress={handleExecute}
                >
                  <Icon icon="lucide:play" className="mr-1" />
                    Run Test
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4  h-full">
                <CardBody className="py-16  h-full">
                  <div className="flex items-center justify-center h-full">
                    {renderMermaid && <MermaidRenderer chart={renderMermaid} />}
                    {!renderMermaid && (
                      <p className="text-gray-600">
                        AI-generated workflow will be rendered here
                      </p>
                    )}
                  </div>
                </CardBody>
              </div></div>
          </Card>
        </div>

        {/* </>} */}
      </div>
      <WorkflowModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        messageId={messageId || ""}
      />
    </div>
  );
}
