import { ChangeEvent } from "react";

interface GenericInputProps {
  id?: string;
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: any;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: any) => void;
  disabled?: boolean;
  min?: string;
  max?: string;
  step?: string;
  className?: string;
  onBlur?: () => void;
  onMouseMove?: () => void;
  maxLength?: any;
  checked?: boolean;
  ref?: any;
  width?: any;
  height?: any;
  error?: string; // ✅ Error prop
}

const GenericInput: React.FC<GenericInputProps> = (props) => {
  return (
    <div>
      <label className="font-bold mb-0.5 block text-black dark:text-white">
        {props.label}
      </label>
      <input
        id={props.id || ""}
        name={props.name}
        type={props.type || "text"}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        onClick={props.onClick}
        onMouseMove={props.onMouseMove}
        className={
          props.className ||
          `sm: min-w-full md:w-10 rounded-lg border-[1.5px] ${
            props.error ? 'border-red-500' : 'border-stroke'
          } bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`
        }
        disabled={props.disabled || false}
        min={props.min || "00:00"}
        max={props.max || "23:59"}
        step={props.step}
        checked={props.checked || undefined}
        onBlur={props.onBlur}
        maxLength={props.maxLength}
        style={{
          width: props.width,
          height: props.height,
          backgroundColor: "white",
          color: "black",
        }}
      />
      {/* ✅ Error message */}
      {props.error && (
        <p className="mt-1 text-sm text-red-500">{props.error}</p>
      )}
    </div>
  );
};

export default GenericInput;
