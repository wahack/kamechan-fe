"use client";
import React, { useState } from "react";
import { Card, CardBody, Avatar, Divider, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { requestApi } from "@/app/_utils/request";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { get } from 'radash'
interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  author?: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  nodes?: {
    name: string;
    logoUrl: string;
  }[];
  interactions?: number;
}


export const WorkflowTemplateList = ({
  isMarket
}: {
  isMarket: boolean
}) => {
  // const [workflows, setWorkflows] = useState([])
  const { data: session } = useSession();

  const { data: workflows, isError, error, isLoading } = useQuery({
    queryKey: ["fetchUserWorkflows", session?.user.id, isMarket],
    queryFn: async (): Promise<WorkflowTemplate[]> => {
      const { data } = await requestApi.get("/api/workflow/list/" + (isMarket ? 'market' : 'mine'));
      return data.data
    },
    enabled: !!session?.user,
    // 动态 refetch 间隔
    refetchInterval: (query) => {

      return 10000;
      // return [2, 3].includes(query.state.data?.status || -1) ? false : 2000;
    },
    // 以下选项保持轮询始终激活
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    // 禁用缓存策略
    staleTime: 0
  });

  // requestApi.get('')
  function handleCardClick(id: string) {
    redirect('/workflow/' + id)
  }

  return (
    <>
      {isLoading && <div className="text-center my-20"><Spinner></Spinner></div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(!isLoading && (!workflows || !workflows.length)) && <h4 className="ml-2">You haven't created any workflows yet.</h4>}
        {workflows && workflows.map((template) => (
          <Card key={template.id} shadow="sm" radius="sm" onPress={() => handleCardClick(template.id)} isPressable className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardBody className="overflow-hidden p-4">
              <div className="mb-2 flex justify-between">
                <div className="flex gap-2">
                  {template.nodes?.map((node) => (
                    <div key={node.name} className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
                      <img src={node.logoUrl} alt={node.name} className="w-5 h-5 object-cover rounded-full" />
                    </div>
                  ))}
                </div>
                <div>
                  <span className="text-xs text-gray-600 font-medium">+ {template.nodes?.length}</span>
                </div>
              </div>

              <h3 className="font-medium text-md mb-4 mt-2 text-gray-800">
                {template.title}
              </h3>

              <Divider className="my-2" />

              <div className="mt-2">
                <div className="flex items-center gap-2">

                  <Avatar name={get(template, 'user.name')}
                    size="sm"
                    className="h-5 w-5 border-none text-xs"
                    showFallback
                    fallback={get(template, 'user.name', ' ').charAt(0).toUpperCase()} />
                  <div className="flex items-center">
                    <span className="text-black text-sm">{get(template, 'user.name')}</span>
                    {/* <Badge color="danger" size="sm" variant="flat" className="ml-1.5">
              <Icon icon="lucide:circle" width={8} />
            </Badge> */}
                  </div>
                </div>
                {/* {template.author.verified && (
                <div className="absolute right-1 bottom-1 w-3 h-3 bg-red-500 rounded-full" />
              )} */}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </>

  );
};