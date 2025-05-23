import React, { useState } from "react";
import {
  Spinner,
  Button,
  Code,
  Input,
  Checkbox,
  Divider,
  Form,
  useDisclosure
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ExecutionStep as LogStep } from "@/types/workflow";
import ReactMarkdown from "react-markdown";
import { get } from "radash";
import { ConnectButton , useCurrentAccount } from '@mysten/dapp-kit';

import { PasswordSelectionModal } from "./credentials/password-selection-modal";
import Link from "next/link";

interface WorkflowStepProps {
  step: LogStep;
  isActive: boolean;
  isPast: boolean;
  isFuture: boolean;
  formData?: Record<string, any>;
  isProcessing?: boolean;
  formLoading: boolean;
  handleFormChange?: (fieldId: string, value: any) => void;
  handleFormSubmit?: (e: React.FormEvent, step: LogStep) => void;
  handleConfirm?: (step: LogStep) => void;
}

export function WorkflowStep({
  step,
  isActive,
  isPast,
  isFuture,
  formData = {},
  isProcessing = false,
  handleFormChange,
  formLoading,
  handleFormSubmit,
  handleConfirm,
}: WorkflowStepProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [passwordModalField, setPasswordModalField] = useState('');
  const currentWalletAccount = useCurrentAccount();
	const [openWallet, setOpenWallet] = useState(false);
  const getStatusIcon = () => {
    if (step.status === "completed") {
      return (
        <Icon icon="lucide:check-circle" className="text-success" width={20} />
      );
    }
    if (step.status === "error") {
      return <Icon icon="lucide:x-circle" className="text-danger" width={20} />;
    }
    if (step.status === "processing") {
      return <Spinner size="sm" color="primary" />;
    }
    // Pending
    return (
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${isActive
            ? "border-primary bg-primary/10"
            : "border-default-300 bg-default-100"
          }`}
      >
        {isPast && (
          <Icon icon="lucide:check" className="text-success" width={12} />
        )}
      </div>
    );
  };

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return (
          <Icon icon="lucide:info" className="text-primary-400" width={14} />
        );
      case "warning":
        return (
          <Icon
            icon="lucide:alert-triangle"
            className="text-warning"
            width={14}
          />
        );
      case "error":
        return (
          <Icon icon="lucide:x-circle" className="text-danger" width={14} />
        );
      case "success":
        return <Icon icon="lucide:check" className="text-success" width={14} />;
      default:
        return (
          <Icon icon="lucide:minus" className="text-default-400" width={14} />
        );
    }
  };

  const formRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isActive && step.requiresInteraction && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [isActive, step.requiresInteraction]);

  function onOpenField(label: string) {
    onOpen();
    setPasswordModalField(label)
  }
  function handlePasswordSelect(value: string) {
    handleFormChange && handleFormChange(passwordModalField, value);
  }

  return (
    <div className={`flex gap-4 ${isFuture ? "opacity-50" : ""}`}>
      <div className="relative flex flex-col items-center">
        <div className="z-10 flex h-6 w-6 items-center justify-center">
          {getStatusIcon()}
        </div>
        {/* Vertical connector line */}
        {!isFuture && (
          <div className="absolute top-6 h-full w-[1px] bg-divider"></div>
        )}
      </div>

      <div
        className="flex flex-1 flex-col"
        style={{ width: "100%", overflow: "auto" }}
      >
        <div className="flex items-center justify-between">
          <h4
            className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}
          >
            {step.action}
            {/* {isActive && step.requiresInteraction && (
              <span className="ml-2 inline-flex items-center rounded-full bg-warning-100 px-1.5 py-0.5 text-[10px] text-warning-700">
                <Icon icon="lucide:alert-circle" width={10} className="mr-0.5" />
                需要操作
              </span>
            )} */}
          </h4>
          <span className="text-xs text-default-400">
            {step.status || "waiting"}
          </span>
        </div>
        <p className="mt-1 text-xs text-default-500">{step.description}</p>

        {/* Markdown content section - always visible */}
        {step.markdownContent && (
          <div className="mt-3 rounded-md bg-default-50 p-3 text-xs w-full overflow-hidden">
            <div className="markdown-content prose prose-sm max-w-none w-full prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-pre:my-1">
              <ReactMarkdown
                components={{
                  a: ({ children, ...props }) => {
                    return (
                      // @ts-expect-error - Link component expects href prop from markdown-parsed anchor tags
                      <Link
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                        {...props}
                      >
                        {children}
                      </Link>
                    );
                  },
                  code: ({ children }) => <Code>{children}</Code>,
                  pre: ({ children, ...props }) => (
                    <div className="w-full max-w-full overflow-x-auto">
                      <pre {...props}>{children}</pre>
                    </div>
                  ),
                }}
              >
                {step.markdownContent}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Legacy detailed logs section */}
        {step.detailedLogs &&
          step.detailedLogs.length > 0 &&
          !step.markdownContent && (
            <div className="mt-2 rounded-md bg-default-50 p-2 text-xs">
              {step.detailedLogs.map((log, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 py-1.5 ${index !== step.detailedLogs!.length - 1
                      ? "border-b border-divider/50"
                      : ""
                    }`}
                >
                  <div className="mt-0.5">{getLogLevelIcon(log.level)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{log.message}</span>
                      <span className="text-[10px] text-default-400">
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Form/Interaction area - show directly under the active step that needs it */}
        {isActive && step.requiresInteraction && (
          <div ref={formRef} className="mt-4 pl-0 transition-all duration-300">
            {step.interactionType === "userConfig" &&
              handleFormSubmit &&
              handleFormChange && (
                <div className="mt-3">
                  <Divider className="my-2 opacity-30" />
                  <div className="mt-3 mb-2">
                    <h5 className="text-xs font-medium text-default-700">
                      Please config the form first
                    </h5>
                  </div>
                  <Form
                    onSubmit={(e) => handleFormSubmit(e, step)}
                    className="flex flex-col gap-4"
                  >
                    {step.formFields?.map((field) => (
                      <div key={field.label} className="w-full">
                        {field.type === "checkbox" ? (
                          <Checkbox
                            name={field.label}
                            isSelected={!!formData[field.label]}
                            onValueChange={(isSelected) =>
                              handleFormChange(field.label, isSelected)
                            }
                            color="primary"
                            classNames={{
                              label: "text-default-700",
                            }}
                          >
                            {field.label}
                          </Checkbox>
                        ) : (
                          field.type === "password" ? <>
                            <div>
                              <Input
                                type="password"
                                variant="flat"
                              size="sm"
                              labelPlacement="outside"
                              classNames={{
                                label: "text-default-700 font-medium text-xs",
                                input: "bg-default-50 w-full",
                              }}
                                label={field.label}
                                placeholder="Input or Select a password"
                                value={formData[field.label] || ""}
                                onValueChange={(value) =>
                                  handleFormChange(field.label, value)
                                } className="cursor-pointer"
                                endContent={
                                  <Button
                                    size="sm"
                                    isIconOnly
                                    variant="light"
                                    onPress={() => onOpenField(field.label)}
                                    className="text-default-400 focus:outline-none"
                                  >
                                    <Icon icon="lucide:key" className="text-lg" />
                                  </Button>
                                }
                              />
                              <p className="text-tiny text-default-500 mt-1">
                                Click the right icon by the field to select or create a password
                              </p>
                            </div>
                          </> :
                            <div><Input
                              label={field.label}
                              name={field.label}
                              type={field.type}
                              value={formData[field.label] || ""}
                              onValueChange={(value) =>
                                handleFormChange(field.label, value)
                              }
                              isRequired={field.required}
                              variant="flat"
                              size="sm"
                              labelPlacement="outside"
                              classNames={{
                                label: "text-default-700 font-medium text-xs",
                                input: "bg-default-50 w-full",
                              }}
                            /></div>
                        )}
                      </div>
                    ))}
                    <div className="mt-2">
                      <Button
                        type="submit"
                        color="primary"
                        size="sm"
                        isLoading={formLoading}
                        isDisabled={isProcessing}
                        className="px-4"
                      >
                        confirm
                      </Button>
                    </div>
                  </Form>
                </div>
              )}

            {step.interactionType === "signTransaction" && handleConfirm && (
              <div className="mt-3">
                <Divider className="my-2 opacity-30" />
                <div className="mt-3 flex flex-col gap-3">
                  <div className="mt-1">
                    <ConnectButton style={{border: '1px solid #585858', background: '#fff', fontSize: 14, padding: '6px 12px', marginRight: 20}} />
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => handleConfirm(step)}
                      isDisabled={isProcessing}
                      className="px-4"
                    >
                      Sign Transaction
                    </Button>
                  </div>
                 
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <PasswordSelectionModal
        isOpen={isOpen}
        onPasswordSelect={handlePasswordSelect}
        onOpenChange={onOpenChange}
      ></PasswordSelectionModal>
    </div>
  );
}
