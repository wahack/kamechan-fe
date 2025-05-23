'use client';
import React from "react";
import { Input, Card, CardBody, Button, Divider, Badge, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { WorkflowTemplateList } from "./_components/list";
import { ExecutionsList } from "./_components/execution-list";


export default function WorkflowMange() {
  const [selectedTab, setSelectedTab] = React.useState("workflows");
  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4">
          <Tabs
            aria-label="Workflow Management"
            className="mb-4"
            selectedKey={selectedTab}
            onSelectionChange={key => setSelectedTab(key as string)}
            variant="underlined"
            size="lg"
            color="primary"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-12 text-md font-medium",
              tabContent: "group-data-[selected=true]:text-primary"
            }}
          >
            <Tab key="workflows" title={
              <div className="flex items-center gap-2 text-lg">
                <Icon icon="lucide:layout-template" width={20} height={20} />
                <span>Workflows</span>
              </div>
            }>
              <div className="pt-4">
                <div className="flex items-center mb-4">
                  {/* <h3 className="text-xl font-semibold text-gray-800 mr-2">Trending</h3> */}
                  {/* <Badge color="primary" variant="flat" className="bg-gray-200 text-gray-800">AI</Badge> */}
                  <span className="text-xl text-gray-600 ml-2">Run workflow</span>
                </div>

                <WorkflowTemplateList isMarket={false}/>
              </div>
            </Tab>
            <Tab key="executions" title={
              <div className="flex items-center gap-2 text-lg">
                <Icon icon="lucide:play-circle" width={20} height={20} />
                <span>Executions</span>
              </div>
            }>
              <div className="pt-4">
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mr-1">Live workflows</h3>
                  {/* <Badge color="success" variant="flat" className="bg-green-100 text-green-800">Live</Badge> */}
                  {/* <span className="text-xl text-gray-600 ml-2">workflows</span> */}
                </div>

                <ExecutionsList />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}