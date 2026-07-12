"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  Download,
  FileText,
  Layers,
  Plus,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField } from "@/features/auth/components/form-field";
import { LoadingButton } from "@/features/auth/components/loading-button";
import { SectionHeader } from "@/features/dashboard/components/section-header";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { useReportsData } from "@/features/reports/hooks/use-reports-data";
import type { ReportFormat, ReportType } from "@/types/report";

const reportSchema = z.object({
  title: z
    .string()
    .min(1, "Report title is required")
    .min(3, "Title must be at least 3 characters"),
  type: z.string().min(1, "Report type is required"),
  format: z.string().min(1, "Report format is required"),
});

type ReportInput = z.infer<typeof reportSchema>;

const TEMPLATES = [
  {
    title: "Annual ESG Platform Summary",
    description: "Consolidated emissions, CSR metrics, and policy audits.",
    type: "esg",
  },
  {
    title: "Environmental Utilities Audit",
    description: "Detailed report covering energy, water, and waste outputs.",
    type: "environmental",
  },
  {
    title: "Social Operations Index",
    description:
      "Review volunteer contributions, CSR events, and satisfaction.",
    type: "social",
  },
  {
    title: "Corporate Governance Declaration",
    description: "Audit timelines, policy sign-offs, and compliance ratings.",
    type: "governance",
  },
];

export default function ReportsPage() {
  const { reports, isLoading, isError, generateReport, isGenerating, refetch } =
    useReportsData();

  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportInput>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      type: "environment",
      format: "pdf",
    },
  });

  async function onReportSubmit(data: ReportInput) {
    try {
      await generateReport({
        type: data.type as ReportType,
        format: data.format as ReportFormat,
      });
      setIsGenerateOpen(false);
      reset();
    } catch (err) {
      console.error(err);
    }
  }

  if (isError) {
    return (
      <PageContainer className="py-12 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
          <AlertTriangle size={32} />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h2 className="text-xl font-bold">Failed to load reports</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An error occurred while loading your sustainability reports and
            logs. Please try again.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <RefreshCw size={14} className="mr-2" />
          Retry Request
        </button>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-8">
      {/* Header */}
      <SectionHeader
        title="Reports Workspace"
        description="Compile organizational sustainability performance indexes, download compliance records, and configure exports."
        actions={
          <button
            type="button"
            onClick={() => setIsGenerateOpen(true)}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Plus size={14} className="mr-1.5" />
            Generate Report
          </button>
        }
      />

      {isLoading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-border bg-card space-y-4"
              >
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-60 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-8 text-left">
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Reports Compiled"
              value={reports.length}
              icon={FileText}
              iconColorClass="text-primary bg-primary/10"
              subtext="Total logs generated"
            />
            <StatCard
              title="Active Templates"
              value={TEMPLATES.length}
              icon={Layers}
              iconColorClass="text-info bg-info/10"
              subtext="Preconfigured schemas"
            />
            <StatCard
              title="Exports Pending"
              value={reports.filter((r) => r.status === "generating").length}
              icon={RefreshCw}
              iconColorClass="text-warning bg-warning/10"
              subtext="Currently processing"
            />
            <StatCard
              title="Shared Reports"
              value={reports.filter((r) => r.status === "ready").length}
              icon={Sparkles}
              iconColorClass="text-success bg-success/10"
              subtext="Signed exports ready"
            />
          </div>

          {/* REPORT TEMPLATES SECTION */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-border/40 pb-2">
              Compliance Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.title}
                  className="p-4 rounded-xl border border-border bg-card/40 hover:bg-card hover:shadow-2xs transition-all flex items-start gap-4"
                >
                  <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <FileText size={14} />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate">
                      {tmpl.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT REPORTS TABLE */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-border/40 pb-2">
              Recent Activity Exports
            </h3>
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                      <th className="px-6 py-3.5 text-left">Report Name</th>
                      <th className="px-6 py-3.5 text-left">Type</th>
                      <th className="px-6 py-3.5 text-left">Format</th>
                      <th className="px-6 py-3.5 text-left">Date Compiled</th>
                      <th className="px-6 py-3.5 text-left">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {reports.map((report) => {
                      const reportName = `${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report (${report.format.toUpperCase()})`;
                      return (
                        <tr
                          key={report.id}
                          className="hover:bg-muted/15 transition-colors text-foreground/90 font-medium"
                        >
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                              <FileText size={12} />
                            </div>
                            <span className="font-semibold text-foreground truncate max-w-[180px] sm:max-w-none">
                              {reportName}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground capitalize">
                            {report.type}
                          </td>
                          <td className="px-6 py-4 uppercase">
                            {report.format}
                          </td>
                          <td className="px-6 py-4 flex items-center gap-1.5 text-muted-foreground">
                            <Calendar size={12} />
                            <span>{report.createdAt.split("T")[0]}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold capitalize ${
                                report.status === "ready"
                                  ? "bg-success/15 text-success"
                                  : "bg-warning/15 text-warning"
                              }`}
                            >
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {report.status === "ready" ? (
                              <a
                                href={report.download_url || "#"}
                                className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                                title="Download Report"
                              >
                                <Download size={12} />
                              </a>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-background/50 text-muted-foreground opacity-50"
                                title="Compiling..."
                              >
                                <RefreshCw size={12} className="animate-spin" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {reports.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-muted-foreground/80 space-y-2"
                        >
                          <FileText
                            className="mx-auto text-muted-foreground/50"
                            size={32}
                          />
                          <p className="text-sm font-semibold">
                            No reports generated
                          </p>
                          <p className="text-xs">
                            Compile your first report to get started.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE DIALOG OVERLAY */}
      <AnimatePresence>
        {isGenerateOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-label="Generate new report"
          >
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute inset-0 cursor-default bg-transparent w-full h-full border-0"
              onClick={() => setIsGenerateOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-foreground">
                  Generate Report
                </h3>
                <button
                  type="button"
                  onClick={() => setIsGenerateOpen(false)}
                  className="text-muted-foreground/75 hover:text-foreground transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onReportSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Title */}
                <FormField
                  label="Report Title"
                  type="text"
                  placeholder="e.g. Q2 Energy Audit Log"
                  error={errors.title?.message}
                  {...register("title")}
                />

                {/* Report Type */}
                <div className="space-y-1 text-left">
                  <label
                    htmlFor="type-select"
                    className="text-xs font-semibold text-foreground/80"
                  >
                    Report Category
                  </label>
                  <select
                    id="type-select"
                    className="w-full h-10 rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-2xs placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring cursor-pointer"
                    {...register("type")}
                  >
                    <option value="environment">Environmental Utilities</option>
                    <option value="social">Social Engagement</option>
                    <option value="governance">Governance Compliance</option>
                    <option value="organization">Unified Corporate ESG</option>
                  </select>
                </div>

                {/* Format */}
                <div className="space-y-1 text-left">
                  <label
                    htmlFor="format-select"
                    className="text-xs font-semibold text-foreground/80"
                  >
                    Export Format
                  </label>
                  <select
                    id="format-select"
                    className="w-full h-10 rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-2xs placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring cursor-pointer"
                    {...register("format")}
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="excel">Excel Sheet</option>
                    <option value="csv">CSV Flatfile</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsGenerateOpen(false)}
                    className="flex-1 h-10 rounded-lg border border-input bg-background text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    isLoading={isGenerating}
                    className="flex-1 h-10"
                  >
                    Generate
                  </LoadingButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
