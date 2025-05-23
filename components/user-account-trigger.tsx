import React from "react";
import {
  Avatar,
  Badge,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { signOut, useSession } from "next-auth/react";
import { shortenAddress } from "@/utils/shorten-address";

interface UserAccountTriggerProps {
  username: string;
  email: string;
  isPro?: boolean;
}

export const UserAccountTrigger: React.FC<UserAccountTriggerProps> = ({
  username,
  email,
  isPro = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: session } = useSession();

  function onSignout() {
    signOut({
      redirectTo: "/",
    });
  }
  return (
    <div>
      <Popover
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="top-start"
        shadow="md"
      >
        <PopoverTrigger>
          <Button
            className="flex w-full items-center justify-start gap-2.5 bg-transparent p-0 hover:bg-transparent"
            variant="light"
          >
            <Avatar
              name={session?.user.name}
              size="sm"
              className="h-7 w-7 border-none text-xs"
              showFallback
              fallback={session?.user.name.charAt(0).toUpperCase()}
            />
            <span className="text-sm font-medium text-default-800">
              {session?.user.name}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-46 rounded-md p-0 shadow-md">
          <div className="px-3 py-2">
            <div className="flex items-center gap-2.5">
              <Avatar
                name={session?.user.name}
                size="sm"
                className="h-6 w-6 text-xs"
                showFallback
                fallback={username.charAt(0).toUpperCase()}
              />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-default-800">
                    {session?.user.name}
                  </span>
                </div>
                <span className="text-[10px] text-default-500">
                  {shortenAddress(session?.user.address)}
                </span>
              </div>
            </div>
          </div>

          <div className="py-0.5">
            <ul className="py-0.5">
              <li>
                <Button
                  className="flex h-7 w-full justify-between px-3 py-0.5 text-xs font-normal text-black"
                  variant="light"
                >
                  <span className="text-gray-600">Settings</span>
                  <Icon
                    icon="lucide:settings"
                    className="h-3.5 w-3.5 text-default-400"
                  />
                </Button>
              </li>

              <li>
                <Button
                  className="flex h-7 w-full justify-between px-3 py-0.5 text-xs font-normal"
                  variant="light"
                >
                  <span className="text-left text-gray-600">Theme</span>
                  <div className="flex items-center gap-1">
                    <div className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-default-200 bg-default-100">
                      <Icon
                        icon="lucide:monitor"
                        width={10}
                        height={10}
                        className="text-default-500"
                      />
                    </div>
                    <div className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-default-200 bg-default-100">
                      <Icon
                        icon="lucide:sun"
                        width={10}
                        height={10}
                        className="text-default-500"
                      />
                    </div>
                    <div className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-default-200 bg-default-100">
                      <Icon
                        icon="lucide:moon"
                        width={10}
                        height={10}
                        className="text-default-500"
                      />
                    </div>
                  </div>
                </Button>
              </li>

              <li>
                <Button
                  className="flex h-7 w-full justify-between px-3 py-0.5 text-xs font-normal"
                  variant="light"
                >
                  <span className="text-left text-gray-600">Join Discord</span>
                  <Icon icon="logos:discord-icon" className="h-3.5 w-3.5" />
                </Button>
              </li>

              <li>
                <Button
                  className="flex h-7 w-full justify-between px-3 py-0.5 text-xs font-normal text-danger-500"
                  variant="light"
                  onPress={onSignout}
                >
                  <span className="text-left">Logout</span>
                  <Icon
                    icon="lucide:log-out"
                    className="h-3.5 w-3.5 text-danger-500"
                  />
                </Button>
              </li>
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
