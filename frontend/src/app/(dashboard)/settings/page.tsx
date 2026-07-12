"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bell,
  Building2,
  CheckCircle2,
  Eye,
  Lock,
  Settings,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageContainer } from "@/components/layout/page-container";
import { FormField } from "@/features/auth/components/form-field";
import { LoadingButton } from "@/features/auth/components/loading-button";
import { SectionHeader } from "@/features/dashboard/components/section-header";
import { cn } from "@/lib/utils";

const orgSettingsSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .min(2, "Name must be at least 2 characters"),
  domain: z.string().min(1, "Primary domain is required"),
});

type OrgSettingsInput = z.infer<typeof orgSettingsSchema>;

const SETTINGS_TABS = [
  { id: "org", label: "Organization", icon: Building2 },
  { id: "appearance", label: "Appearance", icon: Eye },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security & SSO", icon: Lock },
  { id: "preferences", label: "Preferences", icon: Settings },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("org");
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrgSettingsInput>({
    resolver: zodResolver(orgSettingsSchema),
    defaultValues: {
      name: "EcoSphere Corp",
      domain: "ecosphere.io",
    },
  });

  async function onSubmitOrg(_data: OrgSettingsInput) {
    setIsUpdating(true);
    setSuccessMsg(null);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsUpdating(false);
    setSuccessMsg("Organization details updated successfully.");
  }

  return (
    <PageContainer className="space-y-8">
      {/* Header */}
      <SectionHeader
        title="Settings Workspace"
        description="Configure organization details, appearance modes, notification routing, SSO keys, and region preferences."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 text-left">
        {/* TABS SIDEBAR LIST */}
        <nav
          className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-border/60 pb-3 lg:pb-0 lg:pr-4 gap-1.5"
          aria-label="Settings categories"
        >
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSuccessMsg(null);
                }}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* TAB WORKSPACE */}
        <div className="space-y-6">
          {/* SUCCESS BANNER */}
          {successMsg && (
            <div className="p-3 rounded-lg bg-success/15 border border-success/30 text-success text-xs flex items-center gap-2 animate-fade-in font-medium">
              <CheckCircle2 size={14} className="flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB: ORG SETTINGS */}
          {activeTab === "org" && (
            <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-6 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Organization Settings
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Update public profile credentials and domain authorizations.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmitOrg)}
                className="space-y-4"
                noValidate
              >
                <FormField
                  label="Organization Name"
                  type="text"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <FormField
                  label="Primary Authorized Domain"
                  type="text"
                  error={errors.domain?.message}
                  {...register("domain")}
                />

                <div className="pt-2 text-right">
                  <LoadingButton isLoading={isUpdating} className="w-auto px-6">
                    Save Changes
                  </LoadingButton>
                </div>
              </form>
            </div>
          )}

          {/* TAB: APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-6 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Theme & Interface Settings
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Switch between light and dark display preferences.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Light Mode Preview */}
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={cn(
                    "p-4 rounded-xl border flex flex-col items-center gap-3 bg-white text-slate-800 transition-all cursor-pointer hover:border-primary/50 text-xs font-semibold",
                    theme === "light"
                      ? "ring-2 ring-primary border-primary"
                      : "border-border",
                  )}
                >
                  <div className="h-16 w-full rounded bg-slate-100 border border-slate-200 flex flex-col justify-between p-2">
                    <div className="h-2 w-1/2 bg-slate-300 rounded" />
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-slate-200 rounded" />
                      <div className="h-1 w-3/4 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <span>Light Theme</span>
                </button>

                {/* Dark Mode Preview */}
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "p-4 rounded-xl border flex flex-col items-center gap-3 bg-slate-900 text-slate-100 transition-all cursor-pointer hover:border-primary/50 text-xs font-semibold",
                    theme === "dark"
                      ? "ring-2 ring-primary border-primary"
                      : "border-border",
                  )}
                >
                  <div className="h-16 w-full rounded bg-slate-800 border border-slate-700 flex flex-col justify-between p-2">
                    <div className="h-2 w-1/2 bg-slate-600 rounded" />
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-slate-700 rounded" />
                      <div className="h-1 w-3/4 bg-slate-700 rounded" />
                    </div>
                  </div>
                  <span>Dark Theme</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-6 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Email & Desktop Notifications
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Select which activity events trigger dispatch messages.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Compliance Alerts",
                    desc: "Notify when governance score flags drop or updates require attention.",
                  },
                  {
                    title: "Reports Compiling Completed",
                    desc: "Send email links when PDF sustainability reports are ready for download.",
                  },
                  {
                    title: "Team Registration Invites",
                    desc: "Notify administrators when invited members register profiles.",
                  },
                ].map((item, idx) => (
                  <label
                    key={item.title}
                    className="flex items-start gap-3.5 p-3 rounded-lg border border-border/60 hover:bg-muted/10 transition-colors cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={idx < 2}
                      className="rounded border-input text-primary focus:ring-ring mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground">
                        {item.title}
                      </span>
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SECURITY */}
          {activeTab === "security" && (
            <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-6 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Two-Factor Authentication & Single Sign-On
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Enforce secure identity management settings.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground">
                      Require Two-Factor Auth
                    </span>
                    <p className="text-[10px] text-muted-foreground max-w-xs leading-normal">
                      Enforce Google Authenticator MFA for all workspace
                      members.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="h-8 px-3 rounded-md bg-accent text-[11px] font-semibold text-accent-foreground hover:bg-accent/80 transition-colors"
                  >
                    Configure
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground">
                      SAML / OpenID Connect SSO
                    </span>
                    <p className="text-[10px] text-muted-foreground max-w-xs leading-normal">
                      Enable enterprise Single Sign-On via Okta, Entra, or
                      Google Workspaces.
                    </p>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold uppercase tracking-wider">
                    Enterprise
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PREFERENCES */}
          {activeTab === "preferences" && (
            <div className="p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-6 max-w-xl">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Regional Preferences
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Configure language localization and reporting timezones.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="lang-select"
                    className="text-xs font-semibold text-foreground/80"
                  >
                    Language
                  </label>
                  <select
                    id="lang-select"
                    className="w-full h-10 rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring cursor-pointer"
                  >
                    <option value="en">English (US)</option>
                    <option value="de">German (Deutsch)</option>
                    <option value="fr">French (Français)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="tz-select"
                    className="text-xs font-semibold text-foreground/80"
                  >
                    Timezone
                  </label>
                  <select
                    id="tz-select"
                    className="w-full h-10 rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring cursor-pointer"
                  >
                    <option value="utc">
                      UTC (Coordinated Universal Time)
                    </option>
                    <option value="est">EST (Eastern Standard Time)</option>
                    <option value="ist">IST (Indian Standard Time)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
