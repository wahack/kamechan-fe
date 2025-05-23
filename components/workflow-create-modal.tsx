import React, { useEffect } from "react";
import {
  Modal, ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { requestApi } from "@/app/_utils/request";
import { redirect } from "next/navigation";

interface WorkflowCreateModalProps {
  isOpen: boolean;
  id: string;
  onOpen: (isOpen: boolean) => void;
  onOpenChange: (isOpen: boolean) => void;
}
export const WorkflowCreationModal: React.FC<WorkflowCreateModalProps> = ({ id,
  isOpen,
  onOpen,
  onOpenChange }) => {
  // Form state
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(true);
  const [isPaid, setIsPaid] = React.useState(false);
  const [price, setPrice] = React.useState("");
  
  // Handle public/private toggle
  const handlePublicChange = (value: boolean) => {
    setIsPublic(value);
    // Reset paid settings when switching to private
    if (!value) {
      setIsPaid(false);
    }
  };

  useEffect(() => {
    if (isOpen && id) {
      requestApi.get('/api/workflow/create?messageId=' + id).then(ret => {
        const {title, content} = ret.data.data;
        setTitle(title);
        setContent(content);
      })
    }
  }, [id, isOpen])

  // Form validation
  const isFormValid = React.useMemo(() => {
    if (!title.trim() || !content.trim()) return false;
    if (isPaid && (!price || parseFloat(price) <= 0)) return false;
    return true;
  }, [title, content, isPaid, price]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid) return;

    const formData = {
      title,
      content
      // isPublic,
      // isPaid,
      // price: isPaid ? parseFloat(price) : 0
    };

    await requestApi.post('/api/workflow/create', {
      messageId: id,
      title,
      content
    })
    onOpenChange(false);
    redirect('/workflow/manage');
  };

  return (
    <>
             <Modal 
          isOpen={isOpen} 
          onOpenChange={onOpenChange}
          size="3xl"
        >
          <ModalContent>
      <ModalHeader className="flex flex-col gap-1">
        Create New Workflow
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-4">
          <Input
            label="Title"
            placeholder="Enter title"
            value={title}
            onValueChange={setTitle}
            variant="bordered"
            isRequired
          />
          
          <div className="flex flex-col gap-1">
            <Textarea
              label="Description"
              placeholder="Enter description (Markdown supported)"
              value={content}
              onValueChange={setContent}
              variant="bordered"
              minRows={8}
              maxRows={15}
              isRequired
              description="Supports Markdown formatting"
            />
            <div className="text-tiny text-default-500 flex items-center gap-1">
              <Icon icon="lucide:info" width={14} />
              <span>You can use Markdown formatting for rich text editing</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <Switch 
                isSelected={isPublic} 
                onValueChange={handlePublicChange}
              >
                {isPublic ? "Public" : "Private"}
              </Switch>
              <span className="text-tiny text-default-500">
                {isPublic 
                  ? "Anyone can view this content" 
                  : "Only you can view this content"}
              </span>
            </div>
          </div>
          
          {isPublic && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2">
                  <Switch 
                    isSelected={isPaid} 
                    onValueChange={setIsPaid}
                  >
                    {isPaid ? "Paid content" : "Free content"}
                  </Switch>
                  <span className="text-tiny text-default-500">
                    {isPaid 
                      ? "Users need to pay to access this content" 
                      : "Content is free for everyone"}
                  </span>
                </div>
              </div>
              
              {isPaid && (
                <Input
                  type="number"
                  label="Price"
                  placeholder="Enter price"
                  value={price}
                  onValueChange={setPrice}
                  variant="bordered"
                  min="0"
                  step="0.01"
                  isRequired
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">SUI</span>
                    </div>
                  }
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <Icon icon="logos:sui" width={16} className="text-default-400" />
                    </div>
                  }
                />
              )}
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="flat" onPress={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button 
          color="primary" 
          onPress={handleSubmit} 
          isDisabled={!isFormValid}
        >
          Create
        </Button>
      </ModalFooter>
      </ModalContent>
      </Modal>
    </>
  );
};