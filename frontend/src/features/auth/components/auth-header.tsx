import { Leaf } from "lucide-react";
import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-6">
      {/* Brand logo redirection link */}
      <Link
        href="/"
        className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-ring rounded-lg w-fit"
      >
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
          <Leaf size={16} className="text-primary-foreground" />
        </div>
        <span className="font-semibold text-foreground tracking-tight text-lg">
          EcoSphere
        </span>
      </Link>

      <div className="space-y-1.5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
