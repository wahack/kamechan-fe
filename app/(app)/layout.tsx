import React from "react";
import AppSidebar from "@/components/appSidebar";

export default async function AppLayout ({
  children,
}: {
  children: React.ReactNode;
})  {


  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray dark:bg-gray-900">
        <main className="h-full flex flex-col">{children}</main>
      </div>
    </div>
  );
};