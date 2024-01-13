import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";

interface Props {
  ddate?: Date;
  setddate: (date: Date) => void;
}

export default function DatePicker({ ddate, setddate }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !ddate && "text-muted-foreground"
          )}
        >
          {ddate ? format(ddate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={ddate}
          onSelect={(day) => {
            if (day) {
              setddate(day);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
