import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  Card,
  CardBody,
  Divider,
  Spinner,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { PasswordEntry, PasswordGroup } from "./types";
import { PasswordGroupList } from "./password-group-list";
import { CreatePasswordForm } from "./create-password-form";
import { PasswordManager } from "./passwordManager";
import { useSession } from "next-auth/react";

interface PasswordSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPasswordSelect?: (password: string) => void;
}

export function PasswordSelectionModal({
  isOpen,
  onOpenChange,
  onPasswordSelect,
}: PasswordSelectionModalProps) {
  const [selectedTab, setSelectedTab] = React.useState("select");
  const [passwordGroups, setPasswordGroups] = useState<PasswordGroup[]>([]);
  const { data: session } = useSession();
  const [isLoadingSecrets, setIsLoadingSecrets] = useState(false);
  const handleTabChange = (key: React.Key) => {
    setSelectedTab(key.toString());
  };

  async function onAddPasswordGroup(group: PasswordGroup) {
    if (!session?.user.name) return;
    console.log("on add group", group);
    const newGroups = [...passwordGroups, group];
    await PasswordManager.setCredentials(session.user.name, newGroups);
    setPasswordGroups(newGroups);
  }
  async function onAddPasswordEntry(groupId: string, entry: PasswordEntry) {
    if (!session?.user.name) return;
    const newGroups = [...passwordGroups];

    const groupIndex = newGroups.findIndex((i) => i.id === groupId);
    if (groupIndex === -1) return;
    newGroups[groupIndex].entries.push(entry);
    await PasswordManager.setCredentials(session.user.name, newGroups);
    setPasswordGroups(newGroups);
  }

  useEffect(() => {
    if (isOpen && session?.user.name) {
      setIsLoadingSecrets(true);
      PasswordManager.getCredentials(session.user.name).then((groups) => {
        setIsLoadingSecrets(false);
        setPasswordGroups(groups);
      });
    }
  }, [isOpen]);

  // Reset to select tab when closing modal
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setSelectedTab("select"), 300);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Credentials Manager
            </ModalHeader>
            <Divider />
            {
            isLoadingSecrets ? <Spinner className="mt-10"></Spinner> : 
            <ModalBody>
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={handleTabChange}
                className="w-full"
                aria-label="Password Manager tabs"
              >
                <Tab
                  key="select"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:key" />
                      <span>Select Password</span>
                    </div>
                  }
                >
                  <Card shadow="none" className="border border-default-200">
                    <CardBody>
                      {passwordGroups.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Icon
                            icon="lucide:file-lock"
                            className="text-4xl text-default-400 mb-2"
                          />
                          <p className="text-default-600">
                            No password groups available.
                          </p>
                          <Button
                            color="primary"
                            variant="flat"
                            className="mt-4"
                            onPress={() => setSelectedTab("create")}
                          >
                            Create a password
                          </Button>
                        </div>
                      ) : (
                        <PasswordGroupList
                          passwordGroups={passwordGroups}
                          onPasswordSelect={
                            onPasswordSelect || function noop() {}
                          }
                          onClose={onClose}
                        />
                      )}
                    </CardBody>
                  </Card>
                </Tab>
                <Tab
                  key="create"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:plus-circle" />
                      <span>Create Password</span>
                    </div>
                  }
                >
                  <Card shadow="none" className="border border-default-200">
                    <CardBody>
                      <CreatePasswordForm
                        passwordGroups={passwordGroups}
                        onAddPasswordGroup={onAddPasswordGroup}
                        onAddPasswordEntry={onAddPasswordEntry}
                      />
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </ModalBody>
            }
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                Close
              </Button>
              {selectedTab === "create" && (
                <Button
                  color="primary"
                  onPress={() => setSelectedTab("select")}
                >
                  View Passwords
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
