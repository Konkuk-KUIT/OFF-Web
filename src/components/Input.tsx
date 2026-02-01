import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseInputProps = {
  label?: string;
  required?: boolean;
  error?: string;
};

type InputProps = BaseInputProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
    as?: "input";
  };

type TextareaProps = BaseInputProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
    as: "textarea";
  };

type Props = InputProps | TextareaProps;

export default function Input(props: Props) {
  const { label, required, error, className = "", ...rest } = props;
  const isTextarea = props.as === "textarea";

  const baseClassName =
    "input-field w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white";
  const finalClassName = `${baseClassName} ${className}`.trim();

  const inputId = rest.id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="login-label block">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {isTextarea ? (
        <textarea
          id={inputId}
          className={finalClassName}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          type={rest.type || "text"}
          className={finalClassName}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
