"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Badge, Divider, Avatar, CardBody, CardHeader, useDisclosure, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { use } from 'react'
import Markdown from "react-markdown";
import { markdownComponents } from "@/components/markdown-components";
import { SidebarInfo } from './_components/sidebar-info';
import { requestApi } from "@/app/_utils/request";
import type { Workflow } from "./type";
import { MermaidRenderer } from "@/components/mermaid-renderer";
import { WorkflowModal } from "@/components/workflow-modal";
import CronModal from "@/components/cron-modal";
import { ConfigGroup, ConfigModal } from "@/components/config-modal";
import { redirect } from "next/navigation";

type Params = Promise<{ id: string }>

export default function WorkflowPage({ params }: {
  params: Params
}) {
  const { id } = use(params);
  const [workflow, setWorkflow] = useState<Workflow>()
  const [configGroups, setConfigGroups] = useState<ConfigGroup[]>([])
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {isOpen: isCronOpen, onOpen: onCronOpen, onOpenChange: onCronOpenChange} = useDisclosure();
  const {isOpen: isConfigOpen, onOpen: onConfigOpen, onOpenChange: onConfigOpenChnage} = useDisclosure();
  const [configLoading, setConfigLoading] = useState(false);
  const [cronLoading, setCronLoading] = useState(false);
  const [cronForm, setCronForm] = useState({})
  useEffect(() => {
    requestApi.get('/api/workflow/detail?id='+id).then(ret => {
      setWorkflow(ret.data.data)
    })
  }, [id])
  const handleExecute = () => {
    onOpen();
  };
  const handleScheduledRun = ()=>{
    onCronOpen()
  }
  const onConfigSubmit = async (formData: Record<string, any>) => {
    setConfigLoading(true);
    const {data} = await requestApi.post('/api/workflow/schedule', {
      workflowId: id,
      config: formData,
      ...cronForm
    }).catch(r => r);
    if (data.code === 0) {
      onConfigOpenChnage();
      redirect('/workflow/manage?tab=executions');
    }
    setConfigLoading(true);
  }
  const onCronSubmit = async (cronValue: string, cronText: string) => {
    setCronLoading(true);
    const {data} = await requestApi.post('/api/workflow/schedule', {
      workflowId: id,
      schedule: cronValue,
      scheduleText: cronText
    }).catch(r => r);
    if (data.code === 0) { //success
      onCronOpenChange();
      redirect('/workflow/manage?tab=executions')
    } else if (data.code === 2) {
      setConfigGroups(data.data);
      setCronForm({schedule: cronValue,
        scheduleText: cronText})
      onCronOpenChange();
      onConfigOpen()
   }
   setCronLoading(false);
  }
  const onCutomize = function () {
    addToast({
      description: 'comming soon'
    })
  }
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-7xl overflow-hidden" shadow="none">
        <CardHeader className="flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-lg font-semibold"></h2>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              color="primary"
              onPress={handleExecute}
              startContent={<Icon icon="lucide:play" width={16} />}
            >
              Run
            </Button>
            <Button 
              size="sm" 
              color="success"
              onPress={handleScheduledRun}
              startContent={<Icon icon="lucide:alarm-clock" width={16} />}
            >
              Scheduled Run
            </Button>
            <Button 
              size="sm"
              color="danger"
              variant="bordered"
              onPress={onCutomize}
              startContent={<Icon icon="lucide:lightbulb" width={16} />}
            >
              AI Customize
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto max-h-[80vh]">
          <div className="flex flex-col md:flex-row w-full">
            {/* Left Sidebar */}
            <div className="w-full md:w-1/3 p-4 md:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Icons */}
                <div className="flex gap-4">
                  {workflow?.nodes.map(node => (
                    <div key={node.name} className="h-6 w-6 rounded-sm flex items-center justify-center">
                       <img
                          src={node.logoUrl}
                          alt={'name'}
                          className="w-5 h-5 object-cover rounded-sm"
                        />
                    </div>
                  ))}
                  <div className="h-6 w-6 rounded-full flex items-center justify-center">
                    <Icon icon="lucide:edit-3" className="text-white text-xs" />
                  </div>
                  <div className="h-6 w-6 rounded-full flex items-center justify-center">
                    <Icon icon="lucide:share-2" className="text-white text-xs" />
                  </div>
                </div>
            
                {/* Title */}
                <div>
                  <h1 className="text-2xl font-bold text-black">
                    {workflow?.title}
                  </h1>
                </div>
            
                {/* Button */}
                <div>
                  <Button color="warning" className="bg-orange-500 text-white font-medium rounded-md">
                    Use for free
                  </Button>
                </div>
            
                {/* Info */}
                <SidebarInfo workflow={workflow} />
              </div>
            
              {/* Share */}
              <div className="mt-8">
                <p className="text-default-400 uppercase text-xs font-medium tracking-wider mb-2">SHARE:</p>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full border border-default-700 flex items-center justify-center cursor-pointer">
                    <Icon icon="lucide:link" className="text-default-300" width={16} />
                  </div>
                  <div className="h-8 w-8 rounded-full border border-default-700 flex items-center justify-center cursor-pointer">
                    <Icon icon="lucide:twitter" className="text-default-300" width={16} />
                  </div>
                  <div className="h-8 w-8 rounded-full border border-default-700 flex items-center justify-center cursor-pointer">
                    <Icon icon="lucide:linkedin" className="text-default-300" width={16} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="w-full md:w-2/3 p-4 md:p-10">
              {/* White Content Area */}
              <Card className="w-full mb-6  h-[260px] rounded-lg shadow " isBlurred={true}>
                <div className="h-full flex items-center justify-center bg-gray-100 border-solid border-gray border rounded-4xl">
                  <MermaidRenderer chart={(workflow?.flowchart||'').replace('graph TB', 'graph LR') || ''} />
                </div>
              </Card>
            
              {/* Description */}
              <div className="text-default-700 mb-6">
              <Markdown components={markdownComponents}>
                {workflow?.description}
              </Markdown>
              </div>

            </div>
          </div>
        </CardBody>
      </Card>
      <WorkflowModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        workflowId={workflow?.id || ""}
      />
      <CronModal isOpen={isCronOpen} onOpenChange={onCronOpenChange} onSubmit={onCronSubmit} loading={cronLoading}></CronModal>
      <ConfigModal isOpen={isConfigOpen} onOpenChange={onConfigOpenChnage} configGroups={configGroups} onSubmit={onConfigSubmit} loading={configLoading}></ConfigModal>
    </div>
  );
}