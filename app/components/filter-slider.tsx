import { useState } from "react";
import { cn } from "~/lib/utils";
import { Slider } from "~/components/ui/slider";

interface FilterSliderProps {
  value?: number[];
  onChange?: (value: number[]) => void;
  className?: string;
}

export default function FilterSlider(props: FilterSliderProps) {
  const [value] = useState<number[]>([0, 10]);

  return (
    <div className={cn("flex flex-row", props.className)}>
      <div className="flex-grow">
        <Slider defaultValue={[0, 10]} max={10} step={1} value={value} />
      </div>
      <div className="flex-shrink-0 w-8">{value}</div>
    </div>
  );
}
