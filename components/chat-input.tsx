"use client";

// import { useChat, UseChatHelpers } from "@ai-sdk/react";
import { Textarea, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import React, { useMemo } from "react";


interface InputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
  isInstructMode: boolean;
}

export function ChatInput({
  input,
  setInput,
  handleSubmit,
  isLoading,
  isInstructMode
}: InputProps) {
  const _handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (input.trim()) {
      setInput(input)
      handleSubmit()
    }
  };
  const inputTempl = useMemo(() => {
    return isInstructMode ? `1. userInteraction: config coin symbol, target price\n2. binance: get price of symbol configured\n3. cetus: swap usdc to sui\n4. telegram: send a message to my channel
      ` : ` `
  }, [isInstructMode])
  
  
  return (
    <div className="w-full mx-auto  bg-white dark:bg-gray-900">
      <form className="mx-auto relative my-0" onSubmit={_handleSubmit}>
        <Textarea
          isClearable
          fullWidth
          color="primary"
          minRows={isInstructMode? 5 : 1}
          label="Describe your Workflow Step by Step" 
          placeholder={inputTempl}
          value={input}
          className="border-none"
          classNames={{
            inputWrapper: "bg-gray-50 dark:bg-gray-800 focus-within:bg-white dark:focus-within:bg-gray-700",
            input: "leading-relaxed tracking-wide p-2",
            description: "text-gray-100 dark:text-gray-500"
          }}
          onValueChange={setInput}
          endContent={
            <Button
            type="submit"
            color="primary"
            size="sm"
            isIconOnly
            className="absolute right-2 bottom-2 rounded-full"
          >
            <Icon icon="lucide:send" className="text-white" />
          </Button>
          }
        />
      </form>
    </div>
  );
}
