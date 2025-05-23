export interface ExecutionStep {
  id: string;
  action: string;
  description: string;
  status: "processing" | "completed" | "error";
  requiresInteraction?: boolean;
  interactionType?: "userConfig" | "signTransaction";
  origin?: Record<string, unknown>;
  formFields?: Array<{
    label: string;
    type: "string" | "number" | "checkbox" | "options" | "password";
    options?: { label: string; value: string | number }[];
    required?: boolean;
  }>;
  detailedLogs?: Array<{
    timestamp: string;
    message: string;
    level: "info" | "warning" | "error" | "success";
  }>;
  markdownContent?: string;
}
