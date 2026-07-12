"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

interface AuthVisualStageProps {
  mode: "login" | "register" | "default";
}

const LOGIN_PILLARS = [
  {
    title: "Identity Verified",
    description: "Access is protected through enterprise-grade sign-in rules.",
    icon: KeyRound,
    iconClass: "text-primary bg-primary/10",
  },
  {
    title: "Security Controls",
    description:
      "Role-aware boundaries preserve compliance and data integrity.",
    icon: ShieldCheck,
    iconClass: "text-info bg-info/10",
  },
  {
    title: "Live Intelligence",
    description: "Operational ESG signals stay available in one trusted layer.",
    icon: Sparkles,
    iconClass: "text-success bg-success/10",
  },
] as const;

const REGISTER_STEPS = [
  { title: "Create Workspace", status: "Complete" },
  { title: "Invite Team", status: "In Progress" },
  { title: "Activate ESG Modules", status: "Ready" },
] as const;

function LoginVisual() {
  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-8 lg:px-14">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl space-y-5"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/90">
          Secure Enterprise Access
        </p>
        <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground xl:text-5xl">
          Sign in to your ESG intelligence workspace
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground xl:text-lg">
          Trusted by teams that need governance confidence, compliance
          visibility, and operational sustainability data in one secure surface.
        </p>
      </motion.div>

      <div className="mt-12 grid max-w-5xl grid-cols-1 gap-4 xl:grid-cols-3">
        {LOGIN_PILLARS.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.15 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${pillar.iconClass}`}
              >
                <Icon size={18} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function RegisterVisual() {
  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-8 lg:px-14">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl space-y-5"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/90">
          Build Your ESG Operating System
        </p>
        <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground xl:text-5xl">
          Launch a workspace designed for sustainable execution
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground xl:text-lg">
          Onboard your team, unify environmental and governance workflows, and
          move from fragmented reporting to connected intelligence.
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 grid max-w-5xl grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]"
      >
        <article className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm">
          <div className="mb-5 flex items-center gap-2.5 text-foreground">
            <Workflow size={18} className="text-primary" />
            <h3 className="text-base font-semibold">Workspace Setup Flow</h3>
          </div>
          <div className="space-y-3">
            {REGISTER_STEPS.map((step, index) => (
              <div
                key={step.title}
                className="flex items-center justify-between rounded-xl border border-border/50 bg-background/50 px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">
                  {index + 1}. {step.title}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm">
          <div className="mb-5 flex items-center gap-2.5 text-foreground">
            <Users size={18} className="text-info" />
            <h3 className="text-base font-semibold">Readiness Snapshot</h3>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-border/50 bg-background/50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Teams aligned
              </p>
              <p className="mt-1 text-xl font-semibold text-foreground">12</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                ESG modules
              </p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                3 / 3
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-success">
              <CheckCircle2 size={16} />
              Ready for enterprise onboarding
            </div>
          </div>
        </article>
      </motion.section>
    </div>
  );
}

function DefaultVisual() {
  return (
    <div className="mx-auto flex h-full w-full max-w-4xl items-center justify-center px-8 text-center">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Enterprise ESG Intelligence
        </h2>
        <p className="text-muted-foreground">
          Access your workspace securely and continue your sustainability
          journey.
        </p>
      </div>
    </div>
  );
}

export function AuthVisualStage({ mode }: AuthVisualStageProps) {
  if (mode === "login") {
    return <LoginVisual />;
  }

  if (mode === "register") {
    return <RegisterVisual />;
  }

  return <DefaultVisual />;
}
