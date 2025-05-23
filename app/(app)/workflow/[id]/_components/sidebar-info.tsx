import React from "react";
import { Avatar, Badge, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Workflow } from "../type";
import { get } from "radash";

export const SidebarInfo = ({
  workflow
}: {
  workflow: Workflow | undefined
}) => {
  return (
    <div className="space-y-5">
      {/* Created By */}
      <div>
        <p className="text-default-400 uppercase text-xs font-medium tracking-wider mb-2">CREATED BY:</p>
        <div className="flex items-center gap-2">
          <Avatar  name={get(workflow, 'user.name')}
              size="sm"
              className="h-7 w-7 border-none text-xs"
              showFallback
              fallback={get(workflow, 'user.name', ' ').charAt(0).toUpperCase()} />
          <div className="flex items-center">
            <span className="text-black">{get(workflow, 'user.name')}</span>
            {/* <Badge color="danger" size="sm" variant="flat" className="ml-1.5">
              <Icon icon="lucide:circle" width={8} />
            </Badge> */}
          </div>
        </div>
      </div>

      {/* Last Update */}
      <div>
        <p className="text-default-400 uppercase text-xs font-medium tracking-wider mb-1">LAST UPDATE:</p>
        <p className="text-black">Last update 10 days ago</p>
      </div>

      {/* Categories */}
      <div>
        <p className="text-default-400 uppercase text-xs font-medium tracking-wider mb-2">CATEGORIES:</p>
        <div className="flex gap-2">

              
        <Chip 
            className="bg-default-800 text-white px-3 py-1 text-xs border border-default-700"
            variant="flat"
            radius="sm"
          >
            swap
          </Chip>
          <Chip 
            className="bg-default-800 text-white px-3 py-1 text-xs border border-default-700"
            variant="flat"
            radius="sm"
          >
            onchain
          </Chip>
        </div>
      </div>
    </div>
  );
};