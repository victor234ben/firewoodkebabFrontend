import { useState } from "react";
import { Input } from "@/components/ui/input";

interface TipSelectorProps {
  subtotal: number;
  tipPercentages: number[];
  onTipChange: (amount: number) => void;
}

export function TipSelector({ subtotal, tipPercentages, onTipChange }: TipSelectorProps) {
  const [selected, setSelected] = useState<number | "custom" | null>(null);
  const [customValue, setCustomValue] = useState("");

  const selectPct = (pct: number) => {
    setSelected(pct);
    setCustomValue("");
    const tipAmount = (subtotal * pct) / 100;
    onTipChange(tipAmount);
  };

  const selectNone = () => {
    setSelected(null);
    setCustomValue("");
    onTipChange(0);
  };

  const handleCustom = (val: string) => {
    setCustomValue(val);
    setSelected("custom");
    const tipAmount = val ? Number(val) : 0;
    onTipChange(tipAmount);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Add a tip?</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={selectNone}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            selected === null 
              ? "bg-primary text-primary-foreground border-primary" 
              : "border-border hover:bg-muted"
          }`}
        >
          No tip
        </button>
        {tipPercentages.map(pct => (
          <button
            key={pct}
            onClick={() => selectPct(pct)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              selected === pct 
                ? "bg-primary text-primary-foreground border-primary" 
                : "border-border hover:bg-muted"
            }`}
          >
            {pct}% · ${((subtotal * pct) / 100).toFixed(2)}
          </button>
        ))}
        <button
          onClick={() => setSelected("custom")}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            selected === "custom" 
              ? "bg-primary text-primary-foreground border-primary" 
              : "border-border hover:bg-muted"
          }`}
        >
          Custom
        </button>
      </div>
      {selected === "custom" && (
        <Input
          type="number"
          placeholder="Enter tip amount ($)"
          className="h-9 text-sm max-w-48"
          value={customValue}
          onChange={e => handleCustom(e.target.value)}
          min="0"
          step="0.01"
        />
      )}
    </div>
  );
}