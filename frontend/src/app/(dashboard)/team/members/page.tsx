"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { USER_ROLES, type UserRole } from "@/constants/roles";
import { FormField } from "@/features/auth/components/form-field";
import { LoadingButton } from "@/features/auth/components/loading-button";
import { SectionHeader } from "@/features/dashboard/components/section-header";
import { useWorkspaceData } from "@/features/workspace/hooks/use-workspace-data";

const inviteSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
});

type InviteInput = z.infer<typeof inviteSchema>;

export default function MembersPage() {
  const {
    members,
    departments,
    isLoading,
    isError,
    inviteMember,
    isInviting,
    refetchAll,
  } = useWorkspaceData();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteInput>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: USER_ROLES.EMPLOYEE,
      department: "Engineering",
    },
  });

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  async function onInviteSubmit(data: InviteInput) {
    try {
      await inviteMember({
        email: data.email,
        role: data.role as UserRole,
        department: data.department,
      });
      setIsInviteOpen(false);
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
          <h2 className="text-xl font-bold">
            Failed to load workspace members
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We had trouble fetching the organization members registry. Please
            refresh to try again.
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
        title="Workspace Members"
        description="Manage company roles, team access privileges, user list status, and issue invitations."
        actions={
          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <UserPlus size={14} className="mr-1.5" />
            Invite Member
          </button>
        }
      />

      {/* FILTER AND SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
        <div className="relative flex-1 w-full">
          <Search
            size={14}
            className="absolute left-3 top-3 text-muted-foreground/60"
          />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 rounded-lg border border-input bg-background/50 pl-9 pr-4 py-2 text-sm shadow-2xs placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-muted-foreground" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value={USER_ROLES.OWNER}>Owners</option>
            <option value={USER_ROLES.ADMIN}>Admins</option>
            <option value={USER_ROLES.MANAGER}>Managers</option>
            <option value={USER_ROLES.EMPLOYEE}>Employees</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-4 text-left">
          {/* MEMBERS TABLE */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-3.5 text-left">Name</th>
                    <th className="px-6 py-3.5 text-left">Email</th>
                    <th className="px-6 py-3.5 text-left">Department</th>
                    <th className="px-6 py-3.5 text-left">Role</th>
                    <th className="px-6 py-3.5 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-muted/15 transition-colors text-foreground/90 font-medium"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-foreground">
                          {member.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {member.email}
                      </td>
                      <td className="px-6 py-4">
                        {member.department || "Leadership"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                            member.role === USER_ROLES.OWNER
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : member.role === USER_ROLES.ADMIN
                                ? "bg-primary/10 text-primary border-primary/20"
                                : member.role === USER_ROLES.MANAGER
                                  ? "bg-info/10 text-info border-info/20"
                                  : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold capitalize ${
                            member.status === "pending"
                              ? "bg-warning/10 text-warning"
                              : "bg-success/10 text-success"
                          }`}
                        >
                          {member.status || "active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-muted-foreground/80 space-y-2"
                      >
                        <Users
                          className="mx-auto text-muted-foreground/50"
                          size={32}
                        />
                        <p className="text-sm font-semibold">
                          No members found
                        </p>
                        <p className="text-xs">
                          Try searching for another name or check filters.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION FOOTER */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredMembers.length)}{" "}
                  of {filteredMembers.length} members
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-accent hover:text-accent-foreground disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-accent hover:text-accent-foreground disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INVITE DIALOG OVERLAY */}
      <AnimatePresence>
        {isInviteOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-label="Invite new team member"
          >
            {/* Backdrop click dismiss */}
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute inset-0 cursor-default bg-transparent w-full h-full border-0"
              onClick={() => setIsInviteOpen(false)}
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
                  Invite Member
                </h3>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="text-muted-foreground/75 hover:text-foreground transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onInviteSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Email Address */}
                <FormField
                  label="Email Address"
                  type="email"
                  placeholder="newmember@organization.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                {/* Role select */}
                <div className="space-y-1 text-left">
                  <label
                    htmlFor="role-select"
                    className="text-xs font-semibold text-foreground/80"
                  >
                    Access Role
                  </label>
                  <select
                    id="role-select"
                    className="w-full h-10 rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-2xs placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring cursor-pointer"
                    {...register("role")}
                  >
                    <option value={USER_ROLES.EMPLOYEE}>Employee</option>
                    <option value={USER_ROLES.MANAGER}>Manager</option>
                    <option value={USER_ROLES.ADMIN}>Admin</option>
                  </select>
                </div>

                {/* Department select */}
                <div className="space-y-1 text-left">
                  <label
                    htmlFor="dept-select"
                    className="text-xs font-semibold text-foreground/80"
                  >
                    Department
                  </label>
                  <select
                    id="dept-select"
                    className="w-full h-10 rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-2xs placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring cursor-pointer"
                    {...register("department")}
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="flex-1 h-10 rounded-lg border border-input bg-background text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <LoadingButton isLoading={isInviting} className="flex-1 h-10">
                    Send Invite
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
