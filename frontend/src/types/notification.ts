/**
 * Notification Module Types
 *
 * Types for notification system and user preferences
 */

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  action_url?: string;
  extra_data?: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  sent_via_email: boolean;
  sent_via_app: boolean;
  email_sent_at?: string;
  app_sent_at?: string;
  error_message?: string;
  retry_count: number;
  created_at: string;
  updated_at: string;
}

export type NotificationType =
  | "compliance_issue"
  | "csr_approval"
  | "challenge_approval"
  | "policy_acknowledgement"
  | "badge_unlock"
  | "reward_redeemed"
  | "new_challenge"
  | "system_announcement";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export type NotificationStatus = "pending" | "sent" | "failed" | "read";

export interface NotificationPreference {
  id: string;
  user_id: string;
  enable_email_notifications: boolean;
  enable_app_notifications: boolean;
  enable_compliance_alerts: boolean;
  enable_csr_alerts: boolean;
  enable_challenge_alerts: boolean;
  enable_badge_alerts: boolean;
  enable_policy_reminders: boolean;
  enable_reward_alerts: boolean;
  email_digest_frequency: string; // 'immediate', 'daily', 'weekly'
  quiet_hours_start?: string; // '22:00' format
  quiet_hours_end?: string; // '08:00' format
  created_at: string;
  updated_at: string;
}

export interface NotificationSummary {
  total_notifications: number;
  unread_notifications: number;
  pending_notifications: number;
  failed_notifications: number;
  high_priority_count: number;
  urgent_count: number;
}

// Create/Update types
export interface NotificationCreate {
  user_id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  action_url?: string;
  extra_data?: Record<string, any>;
}

export interface NotificationUpdate {
  is_read?: boolean;
  status?: NotificationStatus;
}

export interface NotificationPreferenceUpdate {
  enable_email_notifications?: boolean;
  enable_app_notifications?: boolean;
  enable_compliance_alerts?: boolean;
  enable_csr_alerts?: boolean;
  enable_challenge_alerts?: boolean;
  enable_badge_alerts?: boolean;
  enable_policy_reminders?: boolean;
  enable_reward_alerts?: boolean;
  email_digest_frequency?: string;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

export interface BatchNotificationRequest {
  user_ids: string[];
  notification: NotificationCreate;
}

export interface MarkReadRequest {
  notification_ids: string[];
}

export interface DeleteNotificationsRequest {
  notification_ids: string[];
}
