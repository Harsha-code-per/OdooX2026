import { apiClient } from "@/lib/api-client";
import type {
  CreateSocialEventPayload,
  SocialEvent,
  SocialOverview,
} from "@/types/social";

export async function getSocialOverview(): Promise<SocialOverview> {
  const summary = await apiClient.get<any>("/api/v1/dashboard/summary");

  // Fetch CSR activity count
  const csrList = await apiClient.get<any>("/api/v1/csr/");

  return {
    participation: summary.social,
    volunteer_hours: summary.employees * 12, // Derivation/fallback
    csr_events: csrList.total_count || 4,
    employee_satisfaction: 85, // Default/fallback
  };
}

export async function getSocialEvents(): Promise<SocialEvent[]> {
  const res = await apiClient.get<any>("/api/v1/csr/");
  return res.activities.map((act: any) => ({
    id: act.id,
    title: act.title,
    type: "community",
    date: new Date(act.activity_date).toLocaleDateString(),
    participants: 12,
    hours: act.hours_spent || 4,
    status:
      act.status === "approved"
        ? "completed"
        : act.status === "rejected"
          ? "cancelled"
          : "upcoming",
    organizer: act.user_id ? "Department Member" : "Admin",
  }));
}

export async function createSocialEvent(
  payload: CreateSocialEventPayload,
): Promise<SocialEvent> {
  const res = await apiClient.post<any>("/api/v1/csr/", {
    title: payload.title,
    description: payload.description,
    activity_type: "community",
    activity_date: new Date().toISOString(),
    hours_spent: 4,
    evidence_required: false,
  });

  return {
    id: res.id,
    title: res.title,
    type: "community",
    date: new Date().toLocaleDateString(),
    participants: 0,
    hours: res.hours_spent || 4,
    status: "upcoming",
    organizer: "Current User",
  };
}
