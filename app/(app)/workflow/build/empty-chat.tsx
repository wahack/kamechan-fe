"use client";
import React, { useEffect } from "react";
import { Card, Textarea, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { requestApi } from "@/app/_utils/request";
import { useRouter } from "next/navigation";

interface WorkflowPrompt {
  id: string;
  title: string;
}
export const BuildChatIsEmpty: React.FC = () => {
  const router = useRouter()
  const [workflows, setworkflows] = React.useState<WorkflowPrompt[]>([]);
  useEffect(() => {
    requestApi.get("/api/workflow/list/trending").then(({data}) => {
      setworkflows(data.data)
    })
  }, []);
  function onNav (workflow: WorkflowPrompt) {
    router.push('/workflow/' + workflow.id)
  }
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 mb-4">
      <h1 className="text-lg md:text-xl font-bold mt-8 text-center text-[#1A1A1A] dark:text-white">
        Build Your Own Workflow
      </h1>

      <h3 className="text-md md:text-lg mt-4 mb-8 text-center text-[#1A1A1A] dark:text-white">Seamlessly move and transform data between different apps</h3>

      <div className=" text-center mx-auto space-y-4">
        {workflows.map((workflow) => (
          <Card
            key={workflow.id}
            className="w-full px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm"
            disableRipple
            isPressable
          >
            <div className="flex items-center justify-between" onClick={() => onNav(workflow)}>
              <span className="text-[#1A1A1A] dark:text-white">
                {workflow.title}
              </span>
              <Icon
                icon="lucide:play"
                className="text-gray-400 dark:text-gray-500 ml-4"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
