import React from "react";
import { 
  Button, 
  useDisclosure, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Divider
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { CronConfigurator } from "./cron-configurator";

export default function CronModal({
  isOpen, onOpenChange, onSubmit, loading
}: {
  isOpen: boolean,
  loading: boolean,
  onOpenChange: (value: boolean) => void
  onSubmit: (value: string, text: string) => void
}) {
  const [cronExpression, setCronExpression] = React.useState("0 0 * * *");
  
  const handleSubmit = () => {
    // Mock sending data to server
    console.log("Sending cron expression to server:", cronExpression);
    onSubmit(cronExpression, getCronDescription(cronExpression))
    // In a real application, you would use fetch or axios to send data
    // fetch('https://api.example.com/set-cron', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ cronExpression }),
    // })
    //   .then(response => response.json())
    //   .then(data => console.log('Success:', data))
    //   .catch(error => console.error('Error:', error));
  };

  // Updated getCronDescription function to match crontab.guru style
  const getCronDescription = (cronExp: string): string => {
    const [minute, hour, day, month, weekday] = cronExp.split(" ");
    
    try {
      // Format time part
      let timeStr = "";
      if (minute === "*" && hour === "*") {
        timeStr = "Every minute";
      } else if (hour === "*") {
        if (minute.includes("/")) {
          const [start, step] = minute.split("/");
          timeStr = `Every ${step} minute${parseInt(step) > 1 ? 's' : ''}`;
          if (start !== "0") timeStr += ` starting at minute ${start}`;
        } else if (minute.includes(",")) {
          timeStr = `At minute ${minute.replace(/,/g, " and ")}`;
        } else if (minute.includes("-")) {
          const [start, end] = minute.split("-");
          timeStr = `Every minute from ${start} through ${end}`;
        } else {
          timeStr = `At minute ${minute}`;
        }
        timeStr += " of every hour";
      } else {
        // Format the time as HH:MM
        const hourFormatted = hour === "*" ? "*" : hour.padStart(2, "0");
        const minuteFormatted = minute === "*" ? "*" : minute.padStart(2, "0");
        
        if (hour.includes("/") || hour.includes(",") || hour.includes("-") || 
            minute.includes("/") || minute.includes(",") || minute.includes("-")) {
          timeStr = `At specific times (${hour}:${minute})`;
        } else {
          timeStr = `At ${hourFormatted}:${minuteFormatted}`;
        }
      }
      
      // Format day part
      let dayStr = "";
      const dayOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
      
      // Weekday part
      if (weekday !== "*") {
        if (weekday.includes("-")) {
          const [start, end] = weekday.split("-").map(d => parseInt(d));
          dayStr = ` on ${dayOfWeekNames[start]} through ${dayOfWeekNames[end]}`;
        } else if (weekday.includes(",")) {
          const days = weekday.split(",").map(d => dayOfWeekNames[parseInt(d)]);
          dayStr = ` on ${days.join(" and ")}`;
        } else if (weekday.includes("/")) {
          const [start, step] = weekday.split("/");
          dayStr = ` every ${step} days of the week`;
          if (start !== "0") dayStr += ` starting on ${dayOfWeekNames[parseInt(start)]}`;
        } else {
          dayStr = ` on ${dayOfWeekNames[parseInt(weekday)]}`;
        }
      }
      
      // Day of month part
      if (day !== "*") {
        if (day.includes("-")) {
          const [start, end] = day.split("-");
          dayStr += (dayStr ? " and" : " on") + ` day-of-month ${start} through ${end}`;
        } else if (day.includes(",")) {
          dayStr += (dayStr ? " and" : " on") + ` day-of-month ${day.replace(/,/g, " and ")}`;
        } else if (day.includes("/")) {
          const [start, step] = day.split("/");
          dayStr += (dayStr ? " and" : " on") + ` every ${step} days`;
          if (start !== "1") dayStr += ` starting on day ${start}`;
        } else {
          dayStr += (dayStr ? " and" : " on") + ` day-of-month ${day}`;
        }
      }
      
      // Month part
      if (month !== "*") {
        if (month.includes("-")) {
          const [start, end] = month.split("-").map(m => parseInt(m));
          dayStr += (dayStr ? " in" : " in") + ` ${monthNames[start-1]} through ${monthNames[end-1]}`;
        } else if (month.includes(",")) {
          const months = month.split(",").map(m => monthNames[parseInt(m)-1]);
          dayStr += (dayStr ? " in" : " in") + ` ${months.join(" and ")}`;
        } else if (month.includes("/")) {
          const [start, step] = month.split("/");
          dayStr += (dayStr ? " in" : " every") + ` ${step} months`;
          if (start !== "1") dayStr += ` starting in ${monthNames[parseInt(start)-1]}`;
        } else if (/^([1-9]|1[0-2])$/.test(month)) {
          dayStr += (dayStr ? " in" : " in") + ` ${monthNames[parseInt(month)-1]}`;
        }
      }
      
      // For standard expressions, provide exact format like crontab.guru
      if (cronExp === "0 0 * * *") return "At midnight.";
      if (cronExp === "0 * * * *") return "At minute 0.";
      if (cronExp === "0 9 * * *") return "At 09:00.";
      if (cronExp === "0 9 * * 1-5") return "At 09:00 on Monday through Friday.";
      if (cronExp === "0 12 * * 1") return "At 12:00 on Monday.";
      if (cronExp === "0 0 1 * *") return "At midnight on day-of-month 1.";
      
      // For every minute
      if (cronExp === "* * * * *") return "Every minute.";
      
      // For other expressions, build the description
      let description = timeStr;
      if (dayStr) description += dayStr;
      description += "."; // Add period at end for consistency with crontab.guru
      
      return description;
    } catch (error) {
      console.error("Error parsing cron expression:", error);
      return `Custom schedule (${cronExp})`;
    }
  };

  return (
      
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1 items-center">
            <Icon icon="lucide:alarm-clock" className="text-primary text-2xl mb-2" />
            Execute workflow on a schedule
          </ModalHeader>
          <Divider />
          <ModalBody>
            <CronConfigurator 
              value={cronExpression} 
              onChange={setCronExpression} 
            />
            
            {/* Updated styling for execution time display */}
            <div className="mt-4 p-4 bg-default-50 rounded-md border border-default-200">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="lucide:calendar-clock" className="text-primary" />
                <p className="text-small font-medium">Execution Schedule</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="font-mono text-default-800 text-small">{cronExpression}</p>
                  <p className="text-small text-default-600 mt-1">
                    {getCronDescription(cronExpression)}
                  </p>
                </div>
                <a 
                  href={`https://crontab.guru/#${cronExpression.replace(/ /g, '_')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary text-small flex items-center gap-1 hover:underline"
                >
                  <Icon icon="lucide:external-link" width={14} />
                  Explain
                </a>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button 
              color="primary"
              isLoading={loading}
              onPress={() => {
                handleSubmit();
                // onClose();
              }}
              startContent={<Icon icon="lucide:save" />}
            >
              Save
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
  );
}