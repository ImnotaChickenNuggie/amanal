import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { cn } from "@/lib/utils";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
};

export function Select({
  options,
  value,
  onChange,
  placeholder = "Selecciona una opcion",
  error,
  disabled,
  id,
  name,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <div ref={ref} className="relative" id={id}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center justify-between bg-obsidiana/60 border rounded-lg px-4 py-3 text-left font-product text-sm transition-all duration-200",
          "focus:outline-none focus:border-manantial/50 focus:ring-1 focus:ring-manantial/20",
          error
            ? "border-fuego/70 ring-1 ring-fuego/20"
            : "border-raiz hover:border-raiz/80",
          !selected ? "text-musgo/50" : "text-niebla",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown
          className={cn(
            "size-4 text-musgo/70 transition-transform duration-200 shrink-0 ml-2",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1.5 py-1 bg-obsidiana border border-raiz rounded-lg shadow-xl shadow-black/30 animate-in fade-in-0 zoom-in-95 duration-150">
          <ul role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 cursor-pointer text-sm font-product transition-colors duration-100",
                  value === option.value
                    ? "text-manantial bg-manantial/10"
                    : "text-niebla hover:bg-corteza/60 hover:text-niebla",
                )}
              >
                <Check
                  className={cn(
                    "size-3.5 shrink-0 transition-opacity",
                    value === option.value ? "opacity-100 text-manantial" : "opacity-0",
                  )}
                />
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
