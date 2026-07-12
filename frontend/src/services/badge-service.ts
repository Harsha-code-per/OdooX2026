/**
 * Badge Service
 *
 * Service functions for badge system and user achievements
 */

import { apiClient } from "@/lib/api-client";
import type {
  Badge,
  BadgeUnlockRule,
  UserBadge,
  BadgeProgress,
  BadgeUserStats,
  BadgeAutoAwardResult,
  BadgeCreate,
  BadgeUnlockRuleCreate,
  BadgeAwardRequest,
} from "@/types/badge";

const BADGES_BASE = "/api/v1/badges";

export const badgeService = {
  // Badges
  async getBadges(params?: {
    category?: string;
    is_active?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<Badge[]> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.is_active !== undefined) queryParams.append("is_active", params.is_active.toString());
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${BADGES_BASE}${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<Badge[]>(endpoint);
  },

  async getBadge(badgeId: string): Promise<Badge> {
    return apiClient.get<Badge>(`${BADGES_BASE}/${badgeId}`);
  },

  async createBadge(badge: BadgeCreate): Promise<Badge> {
    return apiClient.post<Badge>(`${BADGES_BASE}`, badge);
  },

  async updateBadge(badgeId: string, badge: Partial<BadgeCreate>): Promise<Badge> {
    return apiClient.put<Badge>(`${BADGES_BASE}/${badgeId}`, badge);
  },

  async deleteBadge(badgeId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`${BADGES_BASE}/${badgeId}`);
  },

  // Badge Unlock Rules
  async getBadgeUnlockRules(badgeId: string): Promise<BadgeUnlockRule[]> {
    return apiClient.get<BadgeUnlockRule[]>(`${BADGES_BASE}/${badgeId}/rules`);
  },

  async createBadgeUnlockRule(badgeId: string, rule: BadgeUnlockRuleCreate): Promise<BadgeUnlockRule> {
    return apiClient.post<BadgeUnlockRule>(`${BADGES_BASE}/${badgeId}/rules`, rule);
  },

  // User Badges
  async getUserBadges(
    userId: string,
    params?: { is_displayed?: boolean; skip?: number; limit?: number }
  ): Promise<UserBadge[]> {
    const queryParams = new URLSearchParams();
    if (params?.is_displayed !== undefined) queryParams.append("is_displayed", params.is_displayed.toString());
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${BADGES_BASE}/user/${userId}${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<UserBadge[]>(endpoint);
  },

  async getUserBadgeProgress(
    userId: string,
    params?: { is_unlocked?: boolean; skip?: number; limit?: number }
  ): Promise<BadgeProgress[]> {
    const queryParams = new URLSearchParams();
    if (params?.is_unlocked !== undefined) queryParams.append("is_unlocked", params.is_unlocked.toString());
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${BADGES_BASE}/user/${userId}/progress${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<BadgeProgress[]>(endpoint);
  },

  async getUserBadgeStats(userId: string): Promise<BadgeUserStats> {
    return apiClient.get<BadgeUserStats>(`${BADGES_BASE}/user/${userId}/stats`);
  },

  // Badge Award
  async awardBadge(award: BadgeAwardRequest): Promise<UserBadge> {
    return apiClient.post<UserBadge>(`${BADGES_BASE}/award`, award);
  },

  // Auto-Award
  async autoAwardBadges(userId?: string): Promise<BadgeAutoAwardResult> {
    const queryParams = userId ? `?user_id=${userId}` : "";
    return apiClient.post<BadgeAutoAwardResult>(`${BADGES_BASE}/auto-award${queryParams}`);
  },
};