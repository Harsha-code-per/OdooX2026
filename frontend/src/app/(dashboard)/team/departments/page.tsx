"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Award,
  Building2,
  Plus,
  RefreshCw,
  Shield,
  Users,
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
import { useWorkspaceData } from "@/features/workspace/hooks/use-workspace-data";

const deptSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Department name must be at least 2 characters"),
  manager: z.string().min(1, "Manager name is required"),
});

type DeptInput = z.infer<typeof deptSchema>;

export default function DepartmentsPage() {
  const {
    departments,
    isLoading,
    isError,
    createDept,
    isCreatingDept,
    refetchAll,
  } = useWorkspaceData();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeptInput>({
    resolver: zodResolver(deptSchema),
    defaultValues: {
      name: "",
      manager: "",
    },
  });

  const totalEmployees = departments.reduce(
    (acc, curr) => acc + curr.employees,
    0,
  );
  const avgEsg = departments.length
    ? Math.round(
        departments.reduce((acc, curr) => acc + curr.esg_score, 0) /
          departments.length,
      )
    : 0;
  const avgPart = departments.length
    ? Math.round(
        departments.reduce((acc, curr) => acc + (curr.participation ?? 0), 0) /
          departments.length,
      )
    : 0;

  async function onDeptSubmit(data: DeptInput) {
    try {
      await createDept({
        name: data.name,
      });
      setIsCreateOpen(false);
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
          <h2 className="text-xl font-bold">Failed to load departments</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An error occurred while loading your department structure. Please
            try refreshing.
          </p>
        </div>
        <button
          type="button"
          onClick={refetchAll}
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
        title="Workspace Departments"
        description="Monitor department operational units, managers assignments, ESG ranking details, and member involvement rates."
        actions={
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Plus size={14} className="mr-1.5" />
            Add Department
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
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* STATS OVERVIEW GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Departments Count"
              value={departments.length}
              icon={Building2}
              iconColorClass="text-primary bg-primary/10"
              subtext="Registered cost centers"
            />
            <StatCard
              title="Average ESG Score"
              value={`${avgEsg}/100`}
              icon={Shield}
              iconColorClass="text-success bg-success/10"
              subtext="Performance index target"
            />
            <StatCard
              title="Avg Participation"
              value={`${avgPart}%`}
              icon={Activity}
              iconColorClass="text-info bg-info/10"
              subtext="Involved employees rate"
            />
            <StatCard
              title="Total Employees"
              value={totalEmployees}
              icon={Users}
              iconColorClass="text-warning bg-warning/10"
              subtext="Active workspace members"
            />
          </div>

          {/* DEPARTMENTS TABLE */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs text-left">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-3.5 text-left">Department</th>
                    <th className="px-6 py-3.5 text-left">Manager</th>
                    <th className="px-6 py-3.5 text-left">Employees Count</th>
                    <th className="px-6 py-3.5 text-left">ESG Score Rating</th>
                    <th className="px-6 py-3.5 text-left">Participation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {departments.map((dept) => (
                    <tr
                      key={dept.id}
                      className="hover:bg-muted/15 transition-colors text-foreground/90 font-medium"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                          <Building2 size={14} />
                        </div>
                        <span className="font-semibold text-foreground">
                          {dept.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {dept.manager || "Unassigned"}
                      </td>
                      <td className="px-6 py-4">{dept.employees} employees</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Award size={13} className="text-primary" />
                          <span className="font-bold text-foreground">
                            {dept.esg_score || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {dept.participation || 0}%
                          </span>
                          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-success rounded-full"
                              style={{ width: `${dept.participation || 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {departments.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-muted-foreground/80 space-y-2"
                      >
                        <Building2
                          className="mx-auto text-muted-foreground/50"
                          size={32}
                        />
                        <p className="text-sm font-semibold">
                          No departments found
                        </p>
                        <p className="text-xs">
                          Create your first department to get started.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE DIALOG OVERLAY */}
      <AnimatePresence>
        {isCreateOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-label="Add new department unit"
          >
            {/* Backdrop click dismiss */}
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute inset-0 cursor-default bg-transparent w-full h-full border-0"
              onClick={() => setIsCreateOpen(false)}
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
                  Add Department
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-muted-foreground/75 hover:text-foreground transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onDeptSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Department Name */}
                <FormField
                  label="Department Name"
                  type="text"
                  placeholder="e.g. Legal, Security"
                  error={errors.name?.message}
                  {...register("name")}
                />

                {/* Manager Name */}
                <FormField
                  label="Assign Manager"
                  type="text"
                  placeholder="Manager Full Name"
                  error={errors.manager?.message}
                  {...register("manager")}
                />

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 h-10 rounded-lg border border-input bg-background text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <LoadingButton
                    isLoading={isCreatingDept}
                    className="flex-1 h-10"
                  >
                    Create
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
