"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Link, Button, Divider, addToast, useDisclosure } from "@heroui/react";
import RouteLink from "next/link";
import { Icon } from "@iconify/react";
import LoginButton from "./login-button";
import { UserAccountTrigger } from "./user-account-trigger";
import { PasswordSelectionModal } from "@/components/credentials/password-selection-modal";

const navItems = [
  {
    icon: "lucide:network",
    label: "Build a workflow",
    path: "/workflow/build",
  },
  {
    icon: "lucide:layout-list",
    label: "Manage workflows",
    path: "/workflow/manage",
  },
  { icon: "lucide:shopping-bag", label: "Marketplace", path: "/workflow/marketplace" },
  // { icon: "lucide:message-circle", label: "New chat", path: "/chat/new" },
  // { icon: "lucide:history", label: "Chat history", path: "/chat/history" },
];

export const NavItems: React.FC<{ isCollapsed: boolean }> = ({
  isCollapsed,
}) => {
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="space-y-2">
        {!isCollapsed && (
          <p className="text-xs uppercase text-[#9CA3AF] dark:text-gray-400 font-medium tracking-wider px-2 mb-2">
            workflow
          </p>
        )}
        {navItems.slice(0, 3).map((item) => (
          <Button
            key={item.path}
            as={RouteLink}
            radius="sm"
            href={item.path}
            variant="light"
            className={`w-full justify-start h-[45px] mb-1 ${
              pathname === item.path
                ? "bg-[#B0E0E6]/30 text-[#1A1A1A] dark:bg-blue-800/30 dark:text-white"
                : "text-[#4B5563] dark:text-gray-300 hover:bg-[#E0F7FA]/30 dark:hover:bg-gray-700/50"
            } 2xl:px-2 lg:px-0`}
          >
            <Icon
              icon={item.icon}
              className={`${isCollapsed ? "mx-auto" : "mr-3"} text-sm`}
            />
            {!isCollapsed && <span className="text-sm">{item.label}</span>}
          </Button>
        ))}
      </div>

      <div className="space-y-2 mt-6">
        {!isCollapsed && (
          <p className="text-xs uppercase text-[#9CA3AF] dark:text-gray-400 font-medium tracking-wider px-2 mb-2">
            Knowledge Base
          </p>
        )}
        {navItems.slice(3).map((item) => (
          <Button
            key={item.path}
            as={RouteLink}
            href={item.path}
            variant="light"
            className={`w-full justify-start h-[45px] mb-1 ${
              pathname === item.path
                ? "bg-[#B0E0E6]/30 text-[#1A1A1A] dark:bg-blue-800/30 dark:text-white"
                : "text-[#4B5563] dark:text-gray-300 hover:bg-[#E0F7FA]/30 dark:hover:bg-gray-700/50"
            } px-2`}
          >
            <Icon
              icon={item.icon}
              className={`${isCollapsed ? "mx-auto" : "mr-3"} text-lg`}
            />
            {!isCollapsed && <span className="text-sm">{item.label}</span>}
          </Button>
        ))}
      </div>

      <div className="mt-auto space-y-2">
        {!isCollapsed && (
          <Button
            onPress={onOpen}
            variant="light"
            className="w-full justify-start h-[45px] text-[#4B5563] dark:text-gray-300 hover:bg-[#E0F7FA]/30 dark:hover:bg-gray-700/50 px-2"
          >
            <Icon icon="lucide:key-round" className="mr-3 text-lg" />
            <span className="text-sm">Credentials</span>
          </Button>
        )}

        {!isCollapsed && (
          <div className="px-2 mt-4">
            {/* <div className=" dark:bg-gray-700  dark:border-gray-600 rounded-md px-3 py-2 flex items-center justify-between"> */}
            {/* <span className="text-xs text-gray-500 dark:text-gray-300 truncate">0x1212...12ddf</span> */}
            {/* <Icon icon="lucide:chevron-down" className="text-gray-500 dark:text-gray-300 text-sm" /> */}

            {/* <LoginButton></LoginButton> */}
            <UserAccountTrigger
              username="wahack"
              email="liaoyuc@gmail.com"
              isPro={true}
            />
            {/* </div> */}
          </div>
        )}
      </div>
      <PasswordSelectionModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      ></PasswordSelectionModal>
    </>
  );
};
