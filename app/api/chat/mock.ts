import { generateId, simulateReadableStream } from "ai";

export async function mockStreamResponse() {
  return new Response(
    simulateReadableStream({
      initialDelayInMs: 1000, // Delay before the first chunk
      chunkDelayInMs: 1000, // Delay between chunks
      chunks: [
        `f:{"messageId": "${generateId()}"}\n`,
        `g:${JSON.stringify('💡 I need to design a workflow for swapping 100 SUI to USDC on the Sui blockchain. Let me first understand what nodes I need to use for this operation. I should look up the relevant node services that can help with this swap operation.<br>')} \n`,
        `0:${JSON.stringify("This workflow facilitates swapping 100 SUI to USDC on the Sui blockchain using the Cetus DEX aggregator. The process follows these steps:\n\n1. **Price Check**: First, the workflow queries the current on-chain price of SUI in USDC using the Cetus SDK. This provides transparency to the user about the expected exchange rate before proceeding with the swap.\n\n2. **Transaction Preparation**: The workflow then creates a swap transaction payload using the Cetus SDK's aggregator functionality, which finds the optimal route for swapping 100 SUI to USDC with minimal slippage.\n\n3. **User Authorization**: The prepared transaction is presented to the user for signing through their connected wallet, ensuring they have full control over authorizing the swap.\n\n4. **Execution**: Once signed, the transaction is submitted to the Sui blockchain for execution, completing the swap of 100 SUI to USDC.\n\nThis workflow provides a streamlined yet secure process for token swapping on the Sui blockchain, with appropriate checks and user authorization steps.")}\n`,
        `g:${JSON.stringify('🔍 **Searching docs cetusSdk:get best swap quote**<br>')}\n`,
        `g:"📃 cetusSdk: cetusSdk - get the best swap quote between two coins<br>"\n`,
        `2:[{"isLoadingFlow": true}]\n`,
        `g:"📃 cetusSdk: cetusSdk - build swap transaction payload smartly, optimizing prices & reducing slippage, across multiple dex on Sui<br>"\n`,
        `g:"📃 cetusSdk: cetusSdk - Open a liquidity position with parameters {lowerPrice, upperPrice, isFixedCoinA, amount, coinTypeA, coinTypeB, feeRate, poolAddress, slippage, senderAddress}<br>"\n`,
        `g:"🔍 Searching docs **suiSdk:execute transaction**<br>"\n`,
        `g:"⚡ suiSdk: Sui Sdk - executes a signed transaction on the Sui network\\n"\n`,
        `2:[{"isLoadingFlow": false}]\n`,
        `g:"- suiSdk: suiSdk - Build a transaction payload to transfer coins, supporting SUI and other tokens\\n"\n`,
        `g:"- suiSdk: suiSdk - sign a transaction with base64-encoded transaction data and private key\\n"\n`,
        `g:"🔍Searching docs **userInteractSdk:walletSign**\\n"\n`,
        `g:"- userInteractSdk: userInteractSdk - sign a raw transaction payload using the private key associated with the user's Sui wallet\\n"\n`,
        `g:"- userInteractSdk: userInteractSdk - user input configuration (JSON format) for SDK interaction\\n"\n`,
        `g:"- suiSdk: suiSdk - sign a transaction with base64-encoded transaction data and private key\\n"\n`,
        `0:"<workflow>graph TB\nStart([\"\`Start\`\"])\nget_price_onchain[\"\`cetusSdk\\nget price onchain\\nGet current SUI to USDC exchange rate for 100 SUI\`\"]\ncreate_swap_transaction_payload[\"\`cetusSdk\\ncreate swap transaction payload\\nCreate payload to swap 100 SUI to USDC with 0.5% slippage\`\"]\nsign_transaction[\"\`userInteractSdk\\nsign transaction\\nRequest user to sign the swap transaction\`\"]\nexecute_transaction[\"\`suiSdk\\nexecute transaction\\nExecute the signed transaction on Sui blockchain\`\"]\nStart --> get_price_onchain\nget_price_onchain --> create_swap_transaction_payload\ncreate_swap_transaction_payload --> sign_transaction\nsign_transaction --> execute_transaction\nexecute_transaction --> End([End])</workflow>"\n`,
        `e:{"finishReason":"stop","usage":{"promptTokens":20,"completionTokens":50},"isContinued":false}\n`,
        `d:{"finishReason":"stop","usage":{"promptTokens":20,"completionTokens":50}}\n`
      ],
    }).pipeThrough(new TextEncoderStream()),
    {
      status: 200,
      headers: {
        "X-Vercel-AI-Data-Stream": "v1",
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
