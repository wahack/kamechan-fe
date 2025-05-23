import React from "react";
// import { useHistory } from "react-router-dom";
import { Card, CardBody, User, Divider, Badge, Progress, Button, Avatar, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { requestApi } from "@/app/_utils/request";
import { redirect } from "next/navigation";
import { get } from "radash";

interface Execution {
  id: number;
  title: string;
  progress: number;
  status: number;
  startTime: string;
  user: {
    name: string;
  };
  workflowId: number;
}

// const : Execution[] = [
//   {
//     id: 101,
//     title: "Auto-create and publish AI social videos with Telegram, GPT-4 and Blotato",
//     progress: 45,
//     status: "running",
//     startTime: "10 min ago",
//     author: {
//       name: "Dr. Firas",
//       avatar: "avatar?w=40&h=40&u=1"
//     },
//     workflowId: 1
//   },
//   {
//     id: 102,
//     title: "AI-Powered WhatsApp Chatbot for Text, Voice, Images & PDFs with memory",
//     progress: 78,
//     status: "running",
//     startTime: "35 min ago",
//     author: {
//       name: "Davide",
//       avatar: "avatar?w=40&h=40&u=2"
//     },
//     workflowId: 2
//   },
//   {
//     id: 103,
//     title: "AI-Powered Telegram Task Manager with MCF Server",
//     progress: 12,
//     status: "pending",
//     startTime: "2 min ago",
//     author: {
//       name: "Francis Ngonga",
//       avatar: "avatar?w=40&h=40&u=3"
//     },
//     workflowId: 3
//   },
//   {
//     id: 104,
//     title: "Build a Chatbot, Voice and Phone Agent with Voiceflow, Google Calendar and RAG",
//     progress: 89,
//     status: "running",
//     startTime: "1 hr ago",
//     author: {
//       name: "Davide",
//       avatar: "avatar?w=40&h=40&u=2"
//     },
//     workflowId: 4
//   }
// ];

const getStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return "success";
    case 2:
      return "warning";
    default:
      return "success";
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 1:
      return "Running";
    case 2:
      return "Paused";
    default:
      return '';
  }
}

export const ExecutionsList = () => {
  // const history = useHistory();
  const { data: executions, refetch, isLoading } = useQuery({
    queryKey: ['execution-list'],
    queryFn: async (): Promise<Execution[]> => {
      const { data } = await requestApi.get('/api/workflow/schedule');
      return data.data
    }
  })

  const handleCardClick = (id: number) => {
    // history.push(`/car/${id}`);
    redirect('/workflow/' + id)
  };

  const handlePauseClick = async (id: number) => {
    // console.log("Pause execution", id);
    await requestApi.post('/api/workflow/schedule/pause', {id})
    refetch()
  };

  const handleStopClick = async (id: number) => {
    // console.log("Stop execution", id);
    await requestApi.post('/api/workflow/schedule/remove', {id});
    refetch()

  };

  return (
    <>
      {isLoading && <div className="text-center my-20"><Spinner></Spinner></div>}
    
    <div className="grid grid-cols-1 gap-4">
      {(!isLoading && (!executions || !executions.length)) && <h4 className="ml-1">You don't have any background jobs running.</h4>}
      {executions && executions.map((execution) => (
        <Card
          key={execution.id}
          shadow="sm"
          radius="sm"
          className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          isPressable
          onPress={() => handleCardClick(execution.workflowId)}
        >
          <CardBody className="overflow-hidden p-4">
            <div className="mb-2 flex justify-between items-center">
              <Badge
                color={getStatusColor(execution.status)}
                variant="flat"
              >
                {getStatusText(execution.status)}
              </Badge>
              <span className="text-xs text-gray-500">{execution.startTime}</span>
            </div>

            <h3 className="font-medium text-sm mb-2 text-gray-800">
              {execution.title}
            </h3>

            <div className="my-3">
              <div className="flex justify-between text-xs mb-1">
                {/* <span>Running Count</span> */}
                {/* <span>{execution.progress}</span> */}
              </div>
              <Progress
                value={execution.progress}
                label={"Running Count: " + execution.progress}
                color={getStatusColor(execution.status)}
                size="sm"
                className="max-w-full"
              />
            </div>

            <Divider className="my-2" />

            <div className="mt-2 flex justify-between items-center">
              <div className="flex items-center gap-2">

                <Avatar name={get(execution, 'user.name')}
                  size="sm"
                  className="h-7 w-7 border-none text-xs"
                  showFallback
                  fallback={get(execution, 'user.name', ' ').charAt(0).toUpperCase()} />
                <span className="text-black">{get(execution, 'user.name')}</span>
              </div>
              <div className="flex gap-2" onClick={(e) => {e.preventDefault();e.stopPropagation()}}>
                <span 
                  className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-200 text-gray-600 cursor-pointer transition-colors"
                  onClick={(e) => handlePauseClick(execution.id)}
                >
                  {
                    execution.status ===  1 ? <Icon icon="lucide:pause" className="text-sm" /> : <Icon icon="lucide:play" className="text-sm" />
                  }
                  
                </span>
                <span 
                  className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-200 text-gray-600 cursor-pointer transition-colors"
                  onClick={(e) => handleStopClick(execution.id)}
                >
                  <Icon icon="lucide:x" className="text-sm" />
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
    </>
  );
};