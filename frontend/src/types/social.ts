/**
 * Social Module Types
 *
 * Mirror social response shapes from 04-api-contract.md:
 * GET /social/overview, GET /social/events.
 */

export interface SocialOverview {
  participation: number;
  csr_events: number;
  volunteer_hours: number;
  training_completion?: number;
  employee_satisfaction?: number;
}

export interface SocialEvent {
  id: string;
  title: string;
  type: SocialEventType;
  date: string;
  participants: number;
  hours: number;
  status: SocialEventStatus;
  organizer?: string;
}

export type SocialEventType =
  | "csr"
  | "volunteer"
  | "training"
  | "awareness"
  | "community"
  | "other";

export type SocialEventStatus =
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface CreateSocialEventPayload {
  title: string;
  type: SocialEventType;
  date: string;
  description?: string;
  target_participants?: number;
}
