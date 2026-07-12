/**
 * Notification Service
 *
 * Service functions for notifications and user preferences
 */

import { apiClient } from "@/lib/api-client";
import type {
  Notification,
  NotificationPreference,
  NotificationSummary,
  NotificationCreate,
  NotificationUpdate,
  NotificationPreferenceUpdate,
  BatchNotificationRequest,
  MarkReadRequest,
  DeleteNotificationsRequest,
} from "@/types/notification";

const NOTIFICATIONS_BASE = "/api/v1/notifications";

export const notificationService = {
  // Notifications
  async getNotifications(params?: {
    is_read?: boolean;
    notification_type?: string;
    priority?: string;
    skip?: number;
    limit?: number;
  }): Promise<Notification[]> {
    const queryParams = new URLSearchParams();
    if (params?.is_read !== undefined) queryParams.append("is_read", params.is_read.toString());
    if (params?.notification_type) queryParams.append("notification_type", params.notification_type);
    if (params?.priority) queryParams.append("priority", params.priority);
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${NOTIFICATIONS_BASE}${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<Notification[]>(endpoint);
  },

  async getNotificationSummary(): Promise<NotificationSummary> {
    return apiClient.get<NotificationSummary>(`${NOTIFICATIONS_BASE}/summary`);
  },

  async getNotification(notificationId: string): Promise<Notification> {
    return apiClient.get<Notification>(`${NOTIFICATIONS_BASE}/${notificationId}`);
  },

  async createNotification(notification: NotificationCreate): Promise<Notification> {
    return apiClient.post<Notification>(`${NOTIFICATIONS_BASE}`, notification);
  },

  async createBatchNotifications(batch: BatchNotificationRequest): Promise<Notification[]> {
    return apiClient.post<Notification[]>(`${NOTIFICATIONS_BASE}/batch`, batch);
  },

  async updateNotification(notificationId: string, update: NotificationUpdate): Promise<Notification> {
    return apiClient.put<Notification>(`${NOTIFICATIONS_BASE}/${notificationId}`, update);
  },

  async markNotificationsAsRead(request: MarkReadRequest): Promise<{ message: string; updated_count: number }> {
    return apiClient.post<{ message: string; updated_count: number }>(`${NOTIFICATIONS_BASE}/mark-read`, request);
  },

  async deleteNotifications(request: DeleteNotificationsRequest): Promise<{ message: string; deleted_count: number }> {
    return apiClient.delete<{ message: string; deleted_count: number }>(`${NOTIFICATIONS_BASE}/batch`, request);
  },

  // Notification Preferences
  async getMyPreferences(): Promise<NotificationPreference> {
    return apiClient.get<NotificationPreference>(`${NOTIFICATIONS_BASE}/preferences/me`);
  },

  async updateMyPreferences(preferences: NotificationPreferenceUpdate): Promise<NotificationPreference> {
    return apiClient.put<NotificationPreference>(`${NOTIFICATIONS_BASE}/preferences/me`, preferences);
  },

  async getUserPreferences(userId: string): Promise<NotificationPreference> {
    return apiClient.get<NotificationPreference>(`${NOTIFICATIONS_BASE}/preferences/${userId}`);
  },
};