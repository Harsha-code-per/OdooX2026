import Link from "next/link";

interface AuthFooterProps {
  message: string;
  linkText: string;
  linkHref: string;
}

export function AuthFooter({ message, linkText, linkHref }: AuthFooterProps) {
  return (
    <div className="text-center text-xs text-muted-foreground mt-6 pt-4 border-t border-border/40">
      <span>{message} </span>
      <Link
        href={linkHref}
        className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring rounded px-0.5"
      >
        {linkText}
      </Link>
    </div>
  );
}
