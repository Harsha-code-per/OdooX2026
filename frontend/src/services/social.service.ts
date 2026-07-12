/**
 * Social Service
 */
import { delay } from "@/lib/helpers";
import { mockSocialEvents, mockSocialOverview } from "@/mocks/social";
import type {
  CreateSocialEventPayload,
  SocialEvent,
  SocialOverview,
} from "@/types/social";

const SIMULATED_DELAY = 600;

export async function getSocialOverview(): Promise<SocialOverview> {
  await delay(SIMULATED_DELAY);
  return mockSocialOverview;
}

export async function getSocialEvents(): Promise<SocialEvent[]> {
  await delay(SIMULATED_DELAY);
  return mockSocialEvents;
}

export async function createSocialEvent(
  payload: CreateSocialEventPayload,
): Promise<SocialEvent> {
  await delay(800);
  return {
    id: `soc-${Date.now()}`,
    ...payload,
    participants: 0,
    hours: 0,
    status: "upcoming",
  };
}
