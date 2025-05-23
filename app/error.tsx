'use client';
import React from "react";
import { Button, Card, CardBody, Spacer } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
    <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none -z-20"></div>
    <div className="absolute top-0 right-0 w-2/3 h-screen bg-gradient-to-bl from-gray-200/5 via-gray-300/2 to-transparent -z-10"></div>
    
    <Card className="w-full max-w-xl border-none shadow-md" disableRipple>
      <CardBody className="p-0">
        <div className="p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto w-24 h-24 bg-danger/5 rounded-full flex items-center justify-center mb-6">
              <Icon icon="lucide:alert-circle" className="text-danger text-4xl" />
            </div>
            
            <h1 className="text-3xl font-normal">Something went wrong</h1>
            <Spacer y={2} />
            <p className="text-default-600">
              We apologize for the inconvenience. The application encountered an unexpected error.
            </p>
          </div>
          
          {error && (
            <Card className="bg-danger/5 border-none mb-8" disableRipple>
              <CardBody className="py-4 px-6">
                <p className="text-sm text-danger-700 font-mono">
                  {error.message || "Unknown error occurred"}
                </p>
              </CardBody>
            </Card>
          )}
          
          <div className="space-y-2 mb-8">
            <p className="text-default-600 text-sm">You can try the following:</p>
            <ul className="space-y-2 text-sm text-default-600">
              <li className="flex items-start gap-2">
                <Icon icon="lucide:refresh-cw" className="mt-0.5 text-primary" />
                <span>Refresh the page and try again</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="lucide:trash-2" className="mt-0.5 text-primary" />
                <span>Clear your browser cache and cookies</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="lucide:clock" className="mt-0.5 text-primary" />
                <span>Try again later if the problem persists</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="flat" 
              startContent={<Icon icon="lucide:home" width={18} />}
              onPress={() => router.push('/workflow/build')}
              className="flex-1"
            >
              Return to Home
            </Button>
            
            {reset && (
              <Button 
                color="primary" 
                startContent={<Icon icon="lucide:refresh-cw" width={18} />}
                onPress={reset}
                className="flex-1"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
        
        <div className="px-8 py-4 border-t border-default-100 bg-default-50/50 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="p-1 bg-primary/5 rounded-full">
              <Icon icon="lucide:circuit" className="text-primary text-sm" />
            </div>
            <span className="text-sm text-default-600">
              KameChan is in active development with frequent updates. We appreciate your patience as we work to improve your experience. 
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  </div>
  );
}
