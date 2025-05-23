import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  Select,
  SelectItem,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface ConfigModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  configGroups: ConfigGroup[];
  onSubmit: (formData: Record<string, any>) => void;
  loading: boolean;
}
export interface ConfigField {
  label: string;
  type: "string" | "number" | "checkbox" | "options" | "password";
  options?: { label: string; value: string | number }[];
  required?: boolean;
}

export interface ConfigGroup {
  name: string;
  fields: ConfigField[];
}

export function ConfigModal({
  isOpen,
  onOpenChange,
  configGroups,
  loading,
  onSubmit,
}: ConfigModalProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [passwordVisibility, setPasswordVisibility] = React.useState<Record<string, boolean>>({});

  // Initialize form data with empty values
  React.useEffect(() => {
    if (isOpen) {
      const initialData: Record<string, any> = {};
      configGroups.forEach((group) => {
        group.fields.forEach((field) => {
          const fieldId = `${group.name}:${field.label}`;
          
          // Set default values based on field type
          if (field.type === "checkbox") {
            initialData[fieldId] = false;
          } else if (field.type === "number") {
            initialData[fieldId] = "";
          } else if (field.type === "options" && field.options && field.options.length > 0) {
            initialData[fieldId] = field.options[0].value;
          } else {
            initialData[fieldId] = "";
          }
        });
      });
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, configGroups]);

  const handleValueChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    
    // Clear error when field is updated
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const togglePasswordVisibility = (fieldId: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    configGroups.forEach((group) => {
      group.fields.forEach((field) => {
        const fieldId = `${group.name}:${field.label}`;
        const value = formData[fieldId];
        
        if (field.required && 
            (value === undefined || value === null || value === "")) {
          newErrors[fieldId] = "This field is required";
        }
      });
    });
    
    setErrors(newErrors);    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {   
    if (validateForm()) {
      let formated = {} as any;     
      Object.entries(formData).map(field => {
        const groupName = field[0].split(':')[0]
        const keyname = field[0].split(':')[1]
        const value = field[1]
        if (!formated[groupName]) formated[groupName] = {result: {}}
        formated[groupName]['result'][keyname] = value;
      })
      onSubmit(formated);
      // onOpenChange(false);
    }
  };

  // Add function to handle the second icon click
  const handleCustomPasswordAction = (fieldId: string) => {
    console.log(`Custom action triggered for password field: ${fieldId}`);
    // Replace this with your custom function implementation
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Configuration Settings
            </ModalHeader>
            
            <ModalBody>
              <form className="space-y-8">
                {configGroups.map((group, groupIndex) => (
                  <div key={group.name} className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">{group.name}</h3>
                    <Divider className="my-2" />
                    
                    <div className="space-y-4">
                      {group.fields.map((field, fieldIndex) => {
                        const fieldId = `${group.name}:${field.label}`;
                        const errorMessage = errors[fieldId];
                        const isPasswordVisible = passwordVisibility[fieldId] || false;
                        
                        return (
                          <div key={fieldId} className="space-y-1">
                            {field.type === "checkbox" ? (
                              <Checkbox
                                isSelected={formData[fieldId]}
                                onValueChange={(isSelected) => handleValueChange(fieldId, isSelected)}
                              >
                                {field.label}
                                {field.required && <span className="text-danger ml-1">*</span>}
                              </Checkbox>
                            ) : field.type === "options" && field.options ? (
                              <Select
                                label={field.label + (field.required ? " *" : "")}
                                placeholder="Select an option"
                                selectedKeys={[formData[fieldId]]}
                                onChange={(e) => handleValueChange(fieldId, e.target.value)}
                                isInvalid={!!errorMessage}
                                errorMessage={errorMessage}
                                className="w-full"
                              >
                                {field.options.map((option) => (
                                  <SelectItem key={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </Select>
                            ) : field.type === "password" ? (
                              <Input
                                type={isPasswordVisible ? "text" : "password"}
                                label={field.label + (field.required ? " *" : "")}
                                value={formData[fieldId] || ""}
                                onValueChange={(value) => handleValueChange(fieldId, value)}
                                isInvalid={!!errorMessage}
                                errorMessage={errorMessage}
                                className="w-full"
                                endContent={
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => togglePasswordVisibility(fieldId)}
                                      className="focus:outline-none"
                                    >
                                      <Icon 
                                        icon={isPasswordVisible ? "lucide:eye-off" : "lucide:eye"} 
                                        className="text-default-400 hover:text-default-600 cursor-pointer w-5 h-5"
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleCustomPasswordAction(fieldId)}
                                      className="focus:outline-none"
                                    >
                                      <Icon 
                                        icon="lucide:key" 
                                        className="text-default-400 hover:text-default-600 cursor-pointer w-5 h-5"
                                      />
                                    </button>
                                  </div>
                                }
                              />
                            ) : (
                              <Input
                                type={field.type === "number" ? "number" : field.type}
                                label={field.label + (field.required ? " *" : "")}
                                value={formData[fieldId] || ""}
                                onValueChange={(value) => handleValueChange(fieldId, value)}
                                isInvalid={!!errorMessage}
                                errorMessage={errorMessage}
                                className="w-full"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </form>
            </ModalBody>
            
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit} isLoading={loading}>
                Save Configuration
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}