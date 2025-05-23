import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  Spinner,
  Badge,
  Divider,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { WorkflowStep } from "./workflow-step";
import { useWorkflowExecution } from "@/hooks/use-workflow-execution";
import { requestApi } from "@/app/_utils/request";
import { last } from "radash";
import { WorkflowCreationModal } from "@/components/workflow-create-modal";

interface WorkflowModalProps {
  isOpen: boolean;
  workflowId?: string;
  messageId?: string;
  onOpenChange: (isOpen: boolean) => void;
}

export function WorkflowModal({
  workflowId,
  messageId,
  isOpen,
  onOpenChange
  
}: WorkflowModalProps) {
  const [executionId, setExecutionId] = useState('');
  const {
    steps,
    currentStepIndex,
    formData,
    status,
    handleFormChange,
    handleFormSubmit,
    handleConfirm,
    isProcessing,
    setIsOpen,
    formLoading,
    execute
  } = useWorkflowExecution(executionId);
  const { isOpen: isCreateWorkflowModalOpen, onOpen: onCreateWorkflowModalOpen, onOpenChange: onCreateWorkflowModalOpenChange } = useDisclosure();

  const currentStepRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen && currentStepRef.current) {
      setTimeout(() => {
        currentStepRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [currentStepIndex, isOpen]);

  useEffect(() => {
    if (!executionId && isOpen) {
      execute({
        messageId, workflowId
      }).then(i=> {
        setExecutionId(i!)
      })
    }
    setIsOpen(isOpen)
  }, [executionId, isOpen])

  async function onFixWorkflow () {
    const errorStep = last(steps);
    await requestApi.post('/api/workflow/fix', {
      messageId,
      errMsg: `node: "${errorStep?.action}", error: "${errorStep?.markdownContent}"`
    })
    execute({
      messageId, workflowId
    }).then(i=> {
      setExecutionId(i!)
    })
  }

  async function onCreateWorkflow() {
    onOpenChange(false)
    onCreateWorkflowModalOpen()
  }
  function onRunAgain () {
    execute({
      messageId, workflowId
    }).then(i=> {
      setExecutionId(i!)
    })
  }

  return (
    <>
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      isDismissable={false}
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2 border-b border-divider pb-3">
              <Icon icon="lucide:activity" className="text-primary" />
              <span>Execution</span>
            </ModalHeader>

            <ModalBody className="py-6">
              {
                steps && steps.length < 2 && <Spinner className="my-20"></Spinner>
              }
              <div className="flex flex-col gap-6">
                {steps.length > 1 && steps.map((step, index) => (
                  <div
                    key={step.id}
                    ref={index === currentStepIndex ? currentStepRef : null}
                  >
                    <WorkflowStep
                      step={step}
                      formLoading={formLoading}
                      isActive={index === currentStepIndex}
                      isPast={index < currentStepIndex}
                      isFuture={index > currentStepIndex}
                      formData={formData}
                      isProcessing={isProcessing}
                      handleFormChange={handleFormChange}
                      handleFormSubmit={handleFormSubmit}
                      handleConfirm={handleConfirm}
                    />
                  </div>
                ))}
              </div>
            </ModalBody>

            <ModalFooter className="border-t border-divider">
              {
                status === 3 ?
                <Button color="success" size="sm" onPress={onRunAgain}>
                    Run Again
                </Button> : null
              }
              {
                status === 3 && messageId ?
                <Button color="primary" size="sm" className="ml-2" onPress={onCreateWorkflow}>
                    Save Workflow
                </Button> : null
              }
              {
                status === 4 && messageId ?
                <Button color="danger" size="sm" onPress={onFixWorkflow}>
                    Try To Fix  
                </Button> : null
              }
              <Button color="default" size="sm" className="text-white" onPress={onClose}>
                close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
    {
      messageId && <WorkflowCreationModal isOpen={isCreateWorkflowModalOpen} onOpen={onCreateWorkflowModalOpen} onOpenChange={onCreateWorkflowModalOpenChange} id={messageId}/>
    }
    
    </>
  );
}
