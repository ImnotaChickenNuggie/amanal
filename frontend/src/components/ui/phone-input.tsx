import { ChevronDown } from "lucide-react";
import React, { forwardRef } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
  onChange?: (value: RPNInput.Value | undefined) => void;
  error?: boolean;
};

const PhoneInput = forwardRef<React.ComponentRef<typeof RPNInput.default>, PhoneInputProps>(
  ({ className, onChange, error, ...props }, ref) => {
    return (
      <RPNInput.default
        ref={ref}
        className={cn("flex", className)}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        onChange={(value) => onChange?.(value)}
        data-error={error || undefined}
        {...props}
      />
    );
  },
);
PhoneInput.displayName = "PhoneInput";

const InputComponent = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    const parentError = (props as any)["data-error"];
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-transparent px-4 py-3 text-niebla font-product text-sm placeholder:text-musgo/50 focus:outline-none transition-colors",
          className,
        )}
        {...props}
      />
    );
  },
);
InputComponent.displayName = "InputComponent";

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
};

function CountrySelect({ disabled, value, onChange, options }: CountrySelectProps) {
  return (
    <div className="relative flex items-center self-stretch">
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value as RPNInput.Country)}
        className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
      >
        <option value="">Selecciona un pais</option>
        {options
          .filter((x) => x.value)
          .map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} +{RPNInput.getCountryCallingCode(option.value!)}
            </option>
          ))}
      </select>
      <div className="flex items-center gap-1.5 px-3 border-r border-raiz">
        <FlagComponent country={value} countryName={value} />
        <ChevronDown className="size-3.5 text-musgo/70" />
      </div>
    </div>
  );
}

function FlagComponent({ country, countryName }: RPNInput.FlagProps) {
  const Flag = flags[country];
  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag ? <Flag title={countryName} /> : <span className="bg-corteza h-full w-full" />}
    </span>
  );
}

export { PhoneInput };
export type { PhoneInputProps };
