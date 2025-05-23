import React from "react";
    import { Input, Card, CardBody, Button, Divider, Badge } from "@heroui/react";
    import { Icon } from "@iconify/react";
    import { WorkflowTemplateList } from "../manage/_components/list";

    export default function WorkflowMarket() {
      return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8 text-center">
              {/* <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
                1758 Workflow
              </h1>
              <h2 className="text-2xl font-medium text-gray-700 md:text-3xl">
                Built  
              </h2> */}
            </div>
            
            {/* Search */}
            <div className="mb-6">
              <Input
                type="search"
                placeholder="Search  usecases..."
                radius="sm"
                endContent={<Icon icon="lucide:search" className="text-gray-400" />}
                classNames={{
                  input: "bg-white",
                  inputWrapper: "shadow-sm"
                }}
              />
            </div>
            
            {/* Filter Chips */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              <Button variant="flat" color="default" radius="sm" size="sm" className="font-medium bg-gray-700 text-white">
                All
              </Button>
              <Button variant="flat" color="default" radius="sm" size="sm" className="font-medium">
                Onchain Analysis
              </Button>
              <Button variant="flat" color="default" radius="sm" size="sm" className="font-medium">
                Arbitrage
              </Button>
              <Button variant="flat" color="default" radius="sm" size="sm" className="font-medium">
                Trade
              </Button>
              <Button variant="flat" color="default" radius="sm" size="sm" className="font-medium">
                Monitor
              </Button>
              <Button variant="flat" color="default" radius="sm" size="sm" className="font-medium">
                Airdrop
              </Button>
             
            </div>

            {/* Template Section */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mr-2">Workflows Trending</h3>
                {/* <Badge color="primary" variant="flat" className="bg-gray-200 text-gray-800">AI</Badge>
                <span className="text-xl text-gray-600 ml-2">templates</span> */}
              </div>
              
              <WorkflowTemplateList isMarket/>
            </div>
          </div>
        </div>
      );
    }