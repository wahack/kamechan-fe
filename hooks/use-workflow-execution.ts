import React, { useEffect, useMemo, useState } from "react";
import { fromBase64 } from '@mysten/sui/utils';
import { ExecutionStep as LogStep } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import {
  ConnectButton,
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { get } from "radash";
import { requestApi } from "@/app/_utils/request";
export function useWorkflowExecution( executionId: string) {
  const { mutateAsync: signTransaction } = useSignTransaction();
  const account = useCurrentAccount();

  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [formLoading, setFormLoading] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { data: executionResult, isError, error } = useQuery({
    queryKey: ["WorkflowExecution", executionId],
    queryFn: async (): Promise<{ status: number; steps: LogStep[] }> => {
      if (!executionId) return {status:0, steps: []}
      const {data} = await requestApi.get("/api/workflow/execute?execution=" + executionId);
      return data.data
    },
    enabled: !!executionId && isOpen,
    // 动态 refetch 间隔
    refetchInterval: (query) => {
      // 如果最新数据的状态是 'done' 则停止轮询
      if (!isOpen) return false;
      return 2000;
      // return [2, 3].includes(query.state.data?.status || -1) ? false : 2000;
    },
    // 以下选项保持轮询始终激活
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    // 禁用缓存策略
    staleTime: 0
  });


  const execute = async ({messageId, workflowId}: {
    messageId?: string,
    workflowId?: string
  }) => {
    if (!messageId && !workflowId) return;
    const {data} = await requestApi.post('/api/workflow/execute',{
      messageId, workflowId
    })
    return data.data as string
  }

  
  const handleFormChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent, step: LogStep) => {
    e.preventDefault();
    // console.log(formData);
    setFormLoading(true);
    await requestApi.post("/api/workflow/execute/interaction", {
      executionId: executionId,
      userConfig: {
        [step.action]: {
          result: formData,
        },
      },
    });
    setFormLoading(false)
  };

  const handleConfirm = async (step: LogStep) => {
    console.log("sign:", step);
    const transactions = get(step, "origin.transactions", "") as string;
    if (!transactions) return;

    const { bytes, signature } = await signTransaction({
      //@ts-ignore
      transaction: transactions.startsWith('{') ? Transaction.from(transactions) : new TextDecoder().decode(fromBase64(transactions)),
      // chain: 'sui:mainnet'
    });
    requestApi.post("/api/workflow/execute/interaction", {
      executionId: executionId,
      userConfig: {
        [step.action]: {
          result: {
            bcsBase64Transaction: bytes,
            base64Signature: signature,
            publicKey: account?.publicKey,
          },
        },
      },
    });
  };
 
  const steps = useMemo(() => {
    return executionResult && executionResult.steps || []
  }, [executionResult])

  // console.log(executionResult);
  

  return {
    steps,
    currentStepIndex: steps.length - 1,
    status: executionResult?.status || 0,
    formData,
    formLoading,
    handleFormChange,
    handleFormSubmit,
    handleConfirm,
    isProcessing,
    execute,
    setIsOpen
  };
}
