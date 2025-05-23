'use client'
import React from "react";
// import RouteLink from "next/link";
import { Link, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ThemeSwitch } from "@/components/theme-switch";
import { NavItems } from "@/components/navItems";
export default function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileView, setIsMobileView] = React.useState(false);

  // Handle responsive sidebar
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (


    <div>

      {!isCollapsed && isMobileView && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${isCollapsed
            ? isMobileView
              ? "w-0 -translate-x-full"
              : "w-[60px]"
            : "2xl:w-[240px] w-[200px]"
          } bg-[#F7F7F7] dark:bg-gray-800 py-5 px-4 flex flex-col transition-all duration-300 fixed md:static z-20 h-full`}
      >
        <div className="mb-8 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg">
              <Icon icon="mdi:turtle" className="text-black text-xl dark:text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              KameChan<span className="text-primary font-bold"></span>
            </span>
          </div>
          )}
          {isCollapsed && !isMobileView && (
            <Icon
              icon="lucide:moon"
              className="mx-auto text-[#1A1A1A] dark:text-white"
            />
          )}
          {/* Theme switcher */}
          {/* {!isCollapsed && <ThemeSwitch />} */}
        </div>

        {/* Sidebar toggle button for mobile */}
        <Button
          isIconOnly
          variant="light"
          className="fixed top-4 left-4 z-30 md:hidden"
          onPress={() => setIsCollapsed(!isCollapsed)}
        >
          <Icon
            icon={isCollapsed ? "lucide:menu" : "lucide:x"}
            className="text-[#1A1A1A] dark:text-white"
          />
        </Button>
        <NavItems isCollapsed={isCollapsed}></NavItems>
      </div>
    </div>

  );
};