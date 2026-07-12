import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      className="flex items-center gap-1.5 text-xs text-destructive mt-1.5 animate-fade-in"
      role="alert"
    >
      <AlertCircle size={13} className="flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
