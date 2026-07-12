/**
 * Mock Social Data
 */
import type { SocialEvent, SocialOverview } from "@/types/social";

export const mockSocialOverview: SocialOverview = {
  participation: 81,
  csr_events: 12,
  volunteer_hours: 450,
  training_completion: 78,
  employee_satisfaction: 85,
};

export const mockSocialEvents: SocialEvent[] = [
  {
    id: "soc-1",
    title: "Community Tree Planting",
    type: "community",
    date: "2026-07-15",
    participants: 45,
    hours: 4,
    status: "upcoming",
    organizer: "HR",
  },
  {
    id: "soc-2",
    title: "ESG Awareness Workshop",
    type: "training",
    date: "2026-07-08",
    participants: 120,
    hours: 2,
    status: "completed",
    organizer: "Admin",
  },
  {
    id: "soc-3",
    title: "Food Bank Volunteering",
    type: "volunteer",
    date: "2026-07-05",
    participants: 30,
    hours: 5,
    status: "completed",
    organizer: "HR",
  },
  {
    id: "soc-4",
    title: "Sustainability Hackathon",
    type: "csr",
    date: "2026-07-20",
    participants: 80,
    hours: 8,
    status: "upcoming",
    organizer: "Engineering",
  },
];
