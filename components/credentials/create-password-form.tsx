import React from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { PasswordGroup } from "./types";
import { generateId } from "ai";

interface CreatePasswordFormProps {
  passwordGroups: PasswordGroup[];
  onAddPasswordGroup: (group: PasswordGroup) => void;
  onAddPasswordEntry: (
    groupId: string,
    entry: { label: string; value: string; notes: string; id: string },
  ) => void;
}

export function CreatePasswordForm({
  passwordGroups,
  onAddPasswordGroup,
  onAddPasswordEntry,
}: CreatePasswordFormProps) {
  const [formMode, setFormMode] = React.useState<"group" | "entry">("entry");
  const [newGroupName, setNewGroupName] = React.useState("");
  const [selectedGroupId, setSelectedGroupId] = React.useState("");
  const [newEntryLabel, setNewEntryLabel] = React.useState("");
  const [newEntryValue, setNewEntryValue] = React.useState("");
  const [newEntryNotes, setNewEntryNotes] = React.useState("");
  const [showEntryPassword, setShowEntryPassword] = React.useState(false);

  // Reset form when switching modes
  React.useEffect(() => {
    setNewGroupName("");
    setSelectedGroupId(passwordGroups[0]?.id || "");
    setNewEntryLabel("");
    setNewEntryValue("");
    setNewEntryNotes("");
    setShowEntryPassword(false);
  }, [formMode, passwordGroups]);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroup: PasswordGroup = {
      id: generateId(),
      name: newGroupName.trim(),
      entries: [],
    };

    onAddPasswordGroup(newGroup);
    setNewGroupName("");
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId || !newEntryLabel.trim() || !newEntryValue.trim())
      return;

    onAddPasswordEntry(selectedGroupId, {
      id: generateId(),
      label: newEntryLabel.trim(),
      value: newEntryValue.trim(),
      notes: newEntryNotes.trim(),
    });

    setNewEntryLabel("");
    setNewEntryValue("");
    setNewEntryNotes("");
  };

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewEntryValue(password);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={formMode === "entry" ? "solid" : "flat"}
          color={formMode === "entry" ? "primary" : "default"}
          onPress={() => setFormMode("entry")}
          startContent={<Icon icon="lucide:key" />}
          className="flex-1"
        >
          Add Password Entry
        </Button>
        <Button
          variant={formMode === "group" ? "solid" : "flat"}
          color={formMode === "group" ? "primary" : "default"}
          onPress={() => setFormMode("group")}
          startContent={<Icon icon="lucide:folder-plus" />}
          className="flex-1"
        >
          Create Group
        </Button>
      </div>

      <Divider />

      {formMode === "group" ? (
        <form onSubmit={handleCreateGroup} className="space-y-4 pt-2">
          <Input
            label="Group Name"
            placeholder="Enter group name"
            value={newGroupName}
            onValueChange={setNewGroupName}
            isRequired
            startContent={
              <Icon icon="lucide:folder" className="text-default-400" />
            }
          />

          <div className="flex justify-end">
            <Button
              color="primary"
              type="submit"
              isDisabled={!newGroupName.trim()}
              startContent={<Icon icon="lucide:save" />}
            >
              Create Group
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleCreateEntry} className="space-y-4 pt-2">
          <Select
            label="Password Group"
            placeholder="Select a group"
            selectedKeys={[selectedGroupId]}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            isRequired
            isDisabled={passwordGroups.length === 0}
          >
            {passwordGroups.map((group) => (
              <SelectItem key={group.id}>{group.name}</SelectItem>
            ))}
          </Select>

          {passwordGroups.length === 0 && (
            <div className="text-center p-3 bg-default-50 rounded-medium border border-default-200">
              <p className="text-default-600 text-sm">
                No password groups available.
              </p>
              <Button
                color="primary"
                variant="flat"
                size="sm"
                className="mt-2"
                onPress={() => setFormMode("group")}
              >
                Create a group first
              </Button>
            </div>
          )}

          {passwordGroups.length > 0 && (
            <>
              <Input
                label="Label"
                placeholder="e.g., apikey, token, password"
                value={newEntryLabel}
                onValueChange={setNewEntryLabel}
                isRequired
                startContent={
                  <Icon icon="lucide:tag" className="text-default-400" />
                }
              />

              <Input
                label="Password Value"
                placeholder="Enter password value"
                value={newEntryValue}
                onValueChange={setNewEntryValue}
                type={showEntryPassword ? "text" : "password"}
                isRequired
                startContent={
                  <Icon icon="lucide:key" className="text-default-400" />
                }
                endContent={
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      isIconOnly
                      variant="flat"
                      onPress={() => setShowEntryPassword(!showEntryPassword)}
                      className="min-w-8"
                    >
                      <Icon
                        icon={
                          showEntryPassword ? "lucide:eye-off" : "lucide:eye"
                        }
                        className="text-default-400"
                      />
                    </Button>
                    <Divider orientation="vertical" className="h-5" />
                    <Button
                      size="sm"
                      isIconOnly
                      variant="flat"
                      onPress={generateRandomPassword}
                      className="min-w-8"
                    >
                      <Icon
                        icon="lucide:refresh-cw"
                        className="text-default-400"
                      />
                    </Button>
                  </div>
                }
              />

              <Textarea
                label="Notes (Optional)"
                placeholder="Add notes about this password"
                value={newEntryNotes}
                onValueChange={setNewEntryNotes}
                maxRows={3}
                startContent={
                  <Icon
                    icon="lucide:file-text"
                    className="text-default-400 mt-1.5"
                  />
                }
              />

              <div className="flex justify-end">
                <Button
                  color="primary"
                  type="submit"
                  isDisabled={
                    !selectedGroupId ||
                    !newEntryLabel.trim() ||
                    !newEntryValue.trim()
                  }
                  startContent={<Icon icon="lucide:save" />}
                >
                  Save Password
                </Button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}
