"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDepartment,
  getDepartments,
} from "@/services/department.service";
import { getUsers, inviteUser } from "@/services/user.service";
import type { CreateDepartmentPayload } from "@/types/department";
import type { InviteUserPayload } from "@/types/user";

export function useWorkspaceData() {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ["workspace", "members"],
    queryFn: getUsers,
  });

  const departmentsQuery = useQuery({
    queryKey: ["workspace", "departments"],
    queryFn: getDepartments,
  });

  const inviteMemberMutation = useMutation({
    mutationFn: (payload: InviteUserPayload) => inviteUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", "members"] });
    },
  });

  const createDeptMutation = useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => createDepartment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", "departments"] });
    },
  });

  const isLoading = membersQuery.isLoading || departmentsQuery.isLoading;
  const isError = membersQuery.isError || departmentsQuery.isError;

  return {
    members: membersQuery.data || [],
    departments: departmentsQuery.data || [],
    isLoading,
    isError,
    inviteMember: inviteMemberMutation.mutateAsync,
    isInviting: inviteMemberMutation.isPending,
    createDept: createDeptMutation.mutateAsync,
    isCreatingDept: createDeptMutation.isPending,
    refetchAll: () => {
      membersQuery.refetch();
      departmentsQuery.refetch();
    },
  };
}
