import { NextRequest } from "next/server";
import { createDataStreamResponse, streamText } from "ai";
import { auth } from "@/utils/auth";
import { buildWorkflowWithAI } from "@/ai/workflow/build";
// import { mockStreamResponse } from "./mock";
import { appendContent, appendData, appendStop } from "@/ai/utils/streamContent";

export const POST = async (req: NextRequest) => {
  const { messages } = await req.json();

  const MAX_TOKENS = 128000;
  let tokenCount = 0;
  const truncatedMessages = [];

  // Process messages from newest to oldest
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    // Rough token estimation: 4 chars ≈ 1 token
    const estimatedTokens = Math.ceil((msg.content?.length || 0) / 4);

    if (tokenCount + estimatedTokens <= MAX_TOKENS) {
      truncatedMessages.unshift(msg);
      tokenCount += estimatedTokens;
    } else {
      break;
    }
  }
  

  const errMsg = `⚠️ Sorry, the assistant encountered an issue. Please try again **(This is a preview version with features under active development. Thank you for your patience!)**` 
  return createDataStreamResponse({
    status: 200,
    statusText: "OK",
    async execute(dataStream) {
      try {
        await buildWorkflowWithAI(messages, dataStream);
      } catch (e) {
        console.warn(e)
        appendContent(dataStream, errMsg);
        appendData(dataStream, {
          isLoadingFlow: false
        })
        appendStop(dataStream)
      }
    },
    onError: (e) => {
      console.warn(e)
      return errMsg
    },
  });
};
