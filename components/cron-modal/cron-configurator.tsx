import React from "react";
import { 
  Select, 
  SelectItem, 
  Input,
  Tabs,
  Tab,
  Card,
  CardBody,
  RadioGroup,
  Radio,
  Button,
  Chip
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface CronConfiguratorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CronConfigurator: React.FC<CronConfiguratorProps> = ({ value, onChange }) => {
  const [minute, hour, day, month, weekday] = value.split(" ");
  const [selectedTab, setSelectedTab] = React.useState("simple");
  
  // Simple configuration values
  const [simpleConfig, setSimpleConfig] = React.useState({
    frequency: "daily",
    hour: hour === "*" ? "0" : hour,
    minute: minute === "*" ? "0" : minute,
    dayOfWeek: weekday === "*" ? "1" : weekday,
    dayOfMonth: day === "*" ? "1" : day,
  });

  // Define common scheduling patterns for quick selection
  const quickPatterns = [
    { label: "Daily Midnight", cron: "0 0 * * *", description: "Every day at 00:00" },
    { label: "Daily Morning", cron: "0 9 * * *", description: "Every day at 09:00" },
    { label: "Weekdays", cron: "0 9 * * 1-5", description: "Mon-Fri at 09:00" },
    { label: "Weekly", cron: "0 12 * * 1", description: "Every Monday at 12:00" },
    { label: "Monthly", cron: "0 0 1 * *", description: "First day of month at 00:00" },
  ];

  // Update the cron expression when simple config changes
  const updateCronFromSimple = (newConfig: typeof simpleConfig) => {
    setSimpleConfig(newConfig);
    let newCron = "";
    
    switch (newConfig.frequency) {
      case "everyMinute":
        newCron = "* * * * *";
        break;
      case "hourly":
        newCron = `${newConfig.minute} * * * *`;
        break;
      case "daily":
        newCron = `${newConfig.minute} ${newConfig.hour} * * *`;
        break;
      case "weekly":
        newCron = `${newConfig.minute} ${newConfig.hour} * * ${newConfig.dayOfWeek}`;
        break;
      case "monthly":
        newCron = `${newConfig.minute} ${newConfig.hour} ${newConfig.dayOfMonth} * *`;
        break;
      default:
        newCron = "0 0 * * *";
    }
    
    onChange(newCron);
  };

  // Handle tab changes
  const handleTabChange = (key: React.Key) => {
    setSelectedTab(key.toString());
  };

  // Generate options for select components
  const generateOptions = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div>
      {/* Replace tabs with a simpler interface */}
      <div className="mb-4">
        <p className="text-medium font-medium mb-3">Select Execution Time</p>
        
        {/* Quick patterns section */}
        <div className="mb-6">
          <p className="text-small text-default-600 mb-2">Quick Select:</p>
          <div className="flex flex-wrap gap-2">
            {quickPatterns.map((pattern) => (
              <Button
                key={pattern.cron}
                size="sm"
                variant={value === pattern.cron ? "solid" : "flat"}
                color={value === pattern.cron ? "primary" : "default"}
                onPress={() => onChange(pattern.cron)}
                className="mb-1"
              >
                {pattern.label}
              </Button>
            ))}
          </div>
        </div>
        
        <Card shadow="none" className="border border-default-200">
          <CardBody>
            <div className="space-y-4">
              <RadioGroup
                label="Frequency"
                orientation="horizontal"
                value={simpleConfig.frequency}
                onValueChange={(value) => updateCronFromSimple({ ...simpleConfig, frequency: value })}
              >
                <Radio value="everyMinute">Every Minute</Radio>
                <Radio value="hourly">Hourly</Radio>
                <Radio value="daily">Daily</Radio>
                <Radio value="weekly">Weekly</Radio>
                <Radio value="monthly">Monthly</Radio>
              </RadioGroup>
              
              <div className="border-t border-default-200 pt-3">
                {simpleConfig.frequency === "everyMinute" && (
                  <div className="flex items-center gap-2">
                    <p className="text-default-700">Runs every minute (highest frequency)</p>
                    <div className="ml-2">
                      <Chip color="danger" size="sm" variant="flat">High CPU usage</Chip>
                    </div>
                  </div>
                )}
                
                {simpleConfig.frequency === "hourly" && (
                  <div className="flex items-center gap-2">
                    <p className="text-default-700">At minute</p>
                    <Select
                      label=" "
                      labelPlacement="outside-left"
                      selectedKeys={[simpleConfig.minute]}
                      onSelectionChange={(keys) => {
                        const minute = Array.from(keys)[0]?.toString() || "0";
                        updateCronFromSimple({ ...simpleConfig, minute });
                      }}
                      className="w-24"
                    >
                      {generateOptions(0, 59).map((minute) => (
                        <SelectItem key={minute.toString()}>
                          {minute}
                        </SelectItem>
                      ))}
                    </Select>
                    <p className="text-default-700">of every hour</p>
                  </div>
                )}
                
                {simpleConfig.frequency === "daily" && (
                  <div className="flex items-center gap-2">
                    <p className="text-default-700">Every day at</p>
                    <Select
                      aria-label="Hour"
                      selectedKeys={[simpleConfig.hour]}
                      onSelectionChange={(keys) => {
                        const hour = Array.from(keys)[0]?.toString() || "0";
                        updateCronFromSimple({ ...simpleConfig, hour });
                      }}
                      className="w-24"
                    >
                      {generateOptions(0, 23).map((hour) => (
                        <SelectItem key={hour.toString()}>
                          {hour < 10 ? `0${hour}` : hour}
                        </SelectItem>
                      ))}
                    </Select>
                    <p className="text-default-700">:</p>
                    <Select
                      aria-label="Minute"
                      selectedKeys={[simpleConfig.minute]}
                      onSelectionChange={(keys) => {
                        const minute = Array.from(keys)[0]?.toString() || "0";
                        updateCronFromSimple({ ...simpleConfig, minute });
                      }}
                      className="w-24"
                    >
                      {generateOptions(0, 59).map((minute) => (
                        <SelectItem key={minute.toString()}>
                          {minute < 10 ? `0${minute}` : minute}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}
                
                {simpleConfig.frequency === "weekly" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <p className="text-default-700">Every</p>
                      <Select
                        aria-label="Day of week"
                        selectedKeys={[simpleConfig.dayOfWeek]}
                        onSelectionChange={(keys) => {
                          const dayOfWeek = Array.from(keys)[0]?.toString() || "1";
                          updateCronFromSimple({ ...simpleConfig, dayOfWeek });
                        }}
                        className="w-28"
                      >
                        <SelectItem key="1">Monday</SelectItem>
                        <SelectItem key="2">Tuesday</SelectItem>
                        <SelectItem key="3">Wednesday</SelectItem>
                        <SelectItem key="4">Thursday</SelectItem>
                        <SelectItem key="5">Friday</SelectItem>
                        <SelectItem key="6">Saturday</SelectItem>
                        <SelectItem key="0">Sunday</SelectItem>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-default-700">At:</p>
                      <Select
                        aria-label="Hour"
                        selectedKeys={[simpleConfig.hour]}
                        onSelectionChange={(keys) => {
                          const hour = Array.from(keys)[0]?.toString() || "0";
                          updateCronFromSimple({ ...simpleConfig, hour });
                        }}
                        className="w-24"
                      >
                        {generateOptions(0, 23).map((hour) => (
                          <SelectItem key={hour.toString()}>
                            {hour < 10 ? `0${hour}` : hour}
                          </SelectItem>
                        ))}
                      </Select>
                      <p className="text-default-700">:</p>
                      <Select
                        aria-label="Minute"
                        selectedKeys={[simpleConfig.minute]}
                        onSelectionChange={(keys) => {
                          const minute = Array.from(keys)[0]?.toString() || "0";
                          updateCronFromSimple({ ...simpleConfig, minute });
                        }}
                        className="w-24"
                      >
                        {generateOptions(0, 59).map((minute) => (
                          <SelectItem key={minute.toString()}>
                            {minute < 10 ? `0${minute}` : minute}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                )}
                
                {simpleConfig.frequency === "monthly" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <p className="text-default-700">Day</p>
                      <Select
                        aria-label="Day of month"
                        selectedKeys={[simpleConfig.dayOfMonth]}
                        onSelectionChange={(keys) => {
                          const dayOfMonth = Array.from(keys)[0]?.toString() || "1";
                          updateCronFromSimple({ ...simpleConfig, dayOfMonth });
                        }}
                        className="w-24"
                      >
                        {generateOptions(1, 31).map((day) => (
                          <SelectItem key={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </Select>
                      <p className="text-default-700">of each month</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-default-700">At:</p>
                      <Select
                        aria-label="Hour"
                        selectedKeys={[simpleConfig.hour]}
                        onSelectionChange={(keys) => {
                          const hour = Array.from(keys)[0]?.toString() || "0";
                          updateCronFromSimple({ ...simpleConfig, hour });
                        }}
                        className="w-24"
                      >
                        {generateOptions(0, 23).map((hour) => (
                          <SelectItem key={hour.toString()}>
                            {hour < 10 ? `0${hour}` : hour}
                          </SelectItem>
                        ))}
                      </Select>
                      <p className="text-default-700">:</p>
                      <Select
                        aria-label="Minute"
                        selectedKeys={[simpleConfig.minute]}
                        onSelectionChange={(keys) => {
                          const minute = Array.from(keys)[0]?.toString() || "0";
                          updateCronFromSimple({ ...simpleConfig, minute });
                        }}
                        className="w-24"
                      >
                        {generateOptions(0, 59).map((minute) => (
                          <SelectItem key={minute.toString()}>
                            {minute < 10 ? `0${minute}` : minute}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Summary section */}
              <div className="mt-4 p-3 bg-default-50 rounded-md border-default-200 border">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:info" className="text-primary" />
                  <p className="text-small font-medium">Schedule Preview</p>
                </div>
                <p className="text-small text-default-600 mt-1">
                  {simpleConfig.frequency === "everyMinute" && "Executes every minute of every day"}
                  {simpleConfig.frequency === "hourly" && `Executes at minute ${simpleConfig.minute} of every hour`}
                  {simpleConfig.frequency === "daily" && `Executes daily at ${simpleConfig.hour}:${simpleConfig.minute.padStart(2, '0')}`}
                  {simpleConfig.frequency === "weekly" && `Executes every ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][parseInt(simpleConfig.dayOfWeek)]} at ${simpleConfig.hour}:${simpleConfig.minute.padStart(2, '0')}`}
                  {simpleConfig.frequency === "monthly" && `Executes on day ${simpleConfig.dayOfMonth} of each month at ${simpleConfig.hour}:${simpleConfig.minute.padStart(2, '0')}`}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Expert mode button */}
        <div className="flex justify-end mt-3">
          <Button 
            variant="light" 
            color="default" 
            size="sm" 
            onPress={() => setSelectedTab(selectedTab === "advanced" ? "simple" : "advanced")}
            endContent={<Icon icon={selectedTab === "advanced" ? "lucide:eye-off" : "lucide:code"} width={16} />}
          >
            {selectedTab === "advanced" ? "Hide" : "Show"} Advanced Mode
          </Button>
        </div>
        
        {/* Show advanced mode only when selected */}
        {selectedTab === "advanced" && (
          <Card shadow="none" className="border border-default-200 mt-3">
            <CardBody>
              <div>
                <p className="text-small text-default-700 mb-2">Cron Expression (Advanced Users):</p>
                <div className="grid grid-cols-5 gap-2">
                  <Input 
                    label="Minute" 
                    placeholder="*" 
                    value={value.split(" ")[0]} 
                    onValueChange={(v) => onChange(`${v} ${value.split(" ").slice(1).join(" ")}`)}
                    className="text-center"
                  />
                  <Input 
                    label="Hour" 
                    placeholder="*" 
                    value={value.split(" ")[1]} 
                    onValueChange={(v) => {
                      const parts = value.split(" ");
                      parts[1] = v;
                      onChange(parts.join(" "));
                    }}
                    className="text-center"
                  />
                  <Input 
                    label="Day" 
                    placeholder="*" 
                    value={value.split(" ")[2]} 
                    onValueChange={(v) => {
                      const parts = value.split(" ");
                      parts[2] = v;
                      onChange(parts.join(" "));
                    }}
                    className="text-center"
                  />
                  <Input 
                    label="Month" 
                    placeholder="*" 
                    value={value.split(" ")[3]} 
                    onValueChange={(v) => {
                      const parts = value.split(" ");
                      parts[3] = v;
                      onChange(parts.join(" "));
                    }}
                    className="text-center"
                  />
                  <Input 
                    label="Weekday" 
                    placeholder="*" 
                    value={value.split(" ")[4]} 
                    onValueChange={(v) => {
                      const parts = value.split(" ");
                      parts[4] = v;
                      onChange(parts.join(" "));
                    }}
                    className="text-center"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};