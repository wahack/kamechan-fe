import React from "react";
import { Accordion, AccordionItem, Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PasswordGroup } from "./types";

interface PasswordGroupListProps {
  passwordGroups: PasswordGroup[];
  onPasswordSelect: (password: string) => void;
  onClose: () => void;
}

export function PasswordGroupList({
  passwordGroups,
  onPasswordSelect,
  onClose,
}: PasswordGroupListProps) {
  const handleSelectPassword = (password: string) => {
    onPasswordSelect(password);
    onClose();
  };

  return (
    <Accordion
      variant="bordered"
      selectionMode="multiple"
      defaultExpandedKeys={["1"]}
    >
      {passwordGroups.map((group) => (
        <AccordionItem
          key={group.id}
          aria-label={`${group.name} password group`}
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:folder" className="text-default-500" />
              <span className="font-medium">{group.name}</span>
              <span className="text-tiny text-default-400 ml-2">
                ({group.entries.length}{" "}
                {group.entries.length === 1 ? "entry" : "entries"})
              </span>
            </div>
          }
          textValue={group.name}
        >
          <div className="px-2 py-1 space-y-4">
            {group.entries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-1.5 border border-default-200 rounded-medium p-2.5"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:key" className="text-default-500" />
                    <span className="font-medium">{entry.label}</span>
                  </div>
                  <div className="flex gap-2">
                    <Tooltip content="Copy password">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="primary"
                        onPress={() => {
                          navigator.clipboard.writeText(entry.value);
                        }}
                      >
                        <Icon icon="lucide:clipboard" className="text-sm" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Use this password">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => handleSelectPassword(entry.value)}
                      >
                        <Icon icon="lucide:check" className="text-sm" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-grow flex gap-1 items-center">
                    <span className="text-tiny text-default-500">Value:</span>
                    <div className="bg-default-100 rounded px-2 py-1 flex-grow">
                      <code className="text-tiny">••••••••••••••••</code>
                    </div>
                  </div>
                </div>
                {entry.notes && (
                  <div className="text-tiny text-default-500 mt-1">
                    <span className="font-medium">Notes:</span> {entry.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
