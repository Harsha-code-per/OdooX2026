import { CheckCircle2 } from "lucide-react";

interface SuccessMessageProps {
  title: string;
  message: string;
}

export function SuccessMessage({ title, message }: SuccessMessageProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 py-4 animate-scale-in">
      <div className="h-12 w-12 rounded-full bg-success/15 text-success flex items-center justify-center shadow-lg shadow-success/10">
        <CheckCircle2 size={24} />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
