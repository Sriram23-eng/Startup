import { ReactNode } from "react";

const inputCls =
  "w-full rounded-xl border border-navy-700/12 bg-white px-4 py-3 text-sm text-navy-800 outline-none transition placeholder:text-navy-700/35 focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export function Label({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="mb-1.5 flex items-center justify-between text-sm font-semibold text-navy-800">
      <span>{children}</span>
      {hint && <span className="text-xs font-normal text-navy-700/40">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`${inputCls} resize-none ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}
