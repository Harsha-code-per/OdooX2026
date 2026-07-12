/**
 * Use Notifications Hook
 *
 * React hooks for notification system
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification-service";
import type {
  BatchNotificationRequest,
  DeleteNotificationsRequest,
  MarkReadRequest,
  NotificationCreate,
  NotificationPreferenceUpdate,
  NotificationUpdate,
} from "@/types/notification";

// Notification Hooks
export function useNotifications(params?: {
  is_read?: boolean;
  notification_type?: string;
  priority?: string;
  skip?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["notifications", "list", params],
    queryFn: () => notificationService.getNotifications(params),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useNotificationSummary() {
  return useQuery({
    queryKey: ["notifications", "summary"],
    queryFn: () => notificationService.getNotificationSummary(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useNotification(notificationId: string) {
  return useQuery({
    queryKey: ["notifications", "details", notificationId],
    queryFn: () => notificationService.getNotification(notificationId),
    enabled: !!notificationId,
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notification: NotificationCreate) =>
      notificationService.createNotification(notification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useCreateBatchNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batch: BatchNotificationRequest) =>
      notificationService.createBatchNotifications(batch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      notificationId,
      update,
    }: {
      notificationId: string;
      update: NotificationUpdate;
    }) => notificationService.updateNotification(notificationId, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: MarkReadRequest) =>
      notificationService.markNotificationsAsRead(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "summary"] });
    },
  });
}

export function useDeleteNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DeleteNotificationsRequest) =>
      notificationService.deleteNotifications(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "summary"] });
    },
  });
}

// Notification Preferences Hooks
export function useMyNotificationPreferences() {
  return useQuery({
    queryKey: ["notifications", "preferences", "me"],
    queryFn: () => notificationService.getMyPreferences(),
  });
}

export function useUpdateMyNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: NotificationPreferenceUpdate) =>
      notificationService.updateMyPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", "preferences"],
      });
    },
  });
}

export function useUserNotificationPreferences(userId: string) {
  return useQuery({
    queryKey: ["notifications", "preferences", userId],
    queryFn: () => notificationService.getUserPreferences(userId),
    enabled: !!userId,
  });
}

// Custom hook for unread notifications with real-time updates
export function useUnreadNotifications() {
  const { data: summary, isLoading, error } = useNotificationSummary();

  return {
    unreadCount: summary?.unread_notifications || 0,
    urgentCount: summary?.urgent_count || 0,
    highPriorityCount: summary?.high_priority_count || 0,
    isLoading,
    error,
  };
}

// Custom hook for marking all as read
export function useMarkAllAsRead() {
  const { data: notifications } = useNotifications({
    is_read: false,
    limit: 100,
  });
  const markAsRead = useMarkNotificationsAsRead();

  return useMutation({
    mutationFn: () => {
      const notificationIds = notifications?.map((n) => n.id) || [];
      return markAsRead.mutateAsync({ notification_ids: notificationIds });
    },
  });
}
