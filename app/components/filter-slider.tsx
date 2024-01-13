import { useState } from "react";
import { cn } from "~/lib/utils";
import { Slider } from "~/components/ui/slider";

interface FilterSliderProps {
  value?: number[];
  onChange?: (value: number[]) => void;
  className?: string;
}

export default function FilterSlider(props: FilterSliderProps) {
  const [value, setValue] = useState<number[]>([0, 10]);

  return (
    <div
      className={cn(
        "flex flex-row w-full items-center justify-between",
        props.className
      )}
    >
      <div className="flex-grow">
        <Slider
          defaultValue={[0, 10]}
          max={10}
          step={1}
          value={value}
          onValueCommit={setValue}
        />
      </div>
      <h3 className="flex-shrink-0 w-8 pl-2">{value}</h3>
    </div>
  );
}
