/**
 * Reward Service
 *
 * Service functions for reward redemption, points, and loyalty system
 */

import { apiClient } from "@/lib/api-client";
import type {
  Reward,
  RewardRedemption,
  UserPoints,
  PointsTransaction,
  LeaderboardEntry,
  RedemptionSummary,
  RewardCreate,
  RewardRedemptionCreate,
  PointsTransactionCreate,
} from "@/types/reward";

const REWARDS_BASE = "/api/v1/rewards";

export const rewardService = {
  // Reward Catalog
  async getRewardCatalog(params?: {
    category?: string;
    status?: string;
    min_points?: number;
    max_points?: number;
    skip?: number;
    limit?: number;
  }): Promise<Reward[]> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.min_points !== undefined) queryParams.append("min_points", params.min_points.toString());
    if (params?.max_points !== undefined) queryParams.append("max_points", params.max_points.toString());
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${REWARDS_BASE}/catalog${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<Reward[]>(endpoint);
  },

  async getRewardDetails(rewardId: string): Promise<Reward> {
    return apiClient.get<Reward>(`${REWARDS_BASE}/catalog/${rewardId}`);
  },

  async createReward(reward: RewardCreate): Promise<Reward> {
    return apiClient.post<Reward>(`${REWARDS_BASE}/catalog`, reward);
  },

  async updateReward(rewardId: string, reward: Partial<RewardCreate>): Promise<Reward> {
    return apiClient.put<Reward>(`${REWARDS_BASE}/catalog/${rewardId}`, reward);
  },

  // User Points
  async getUserPoints(): Promise<UserPoints> {
    return apiClient.get<UserPoints>(`${REWARDS_BASE}/points`);
  },

  async getPointsTransactions(params?: {
    transaction_type?: string;
    skip?: number;
    limit?: number;
  }): Promise<PointsTransaction[]> {
    const queryParams = new URLSearchParams();
    if (params?.transaction_type) queryParams.append("transaction_type", params.transaction_type);
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${REWARDS_BASE}/points/transactions${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<PointsTransaction[]>(endpoint);
  },

  async createPointsTransaction(transaction: PointsTransactionCreate): Promise<PointsTransaction> {
    return apiClient.post<PointsTransaction>(`${REWARDS_BASE}/points/transactions`, transaction);
  },

  // Reward Redemption
  async redeemReward(redemption: RewardRedemptionCreate): Promise<RewardRedemption> {
    return apiClient.post<RewardRedemption>(`${REWARDS_BASE}/redeem`, redemption);
  },

  async getUserRedemptions(params?: {
    status_filter?: string;
    skip?: number;
    limit?: number;
  }): Promise<RewardRedemption[]> {
    const queryParams = new URLSearchParams();
    if (params?.status_filter) queryParams.append("status_filter", params.status_filter);
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${REWARDS_BASE}/redemptions${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<RewardRedemption[]>(endpoint);
  },

  async updateRedemptionStatus(
    redemptionId: string,
    update: { status: string; notes?: string }
  ): Promise<RewardRedemption> {
    return apiClient.put<RewardRedemption>(`${REWARDS_BASE}/redemptions/${redemptionId}`, update);
  },

  // Leaderboard
  async getLeaderboard(params?: { skip?: number; limit?: number }): Promise<LeaderboardEntry[]> {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append("skip", params.skip.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());

    const endpoint = `${REWARDS_BASE}/leaderboard${queryParams.toString() ? `?${queryParams}` : ""}`;
    return apiClient.get<LeaderboardEntry[]>(endpoint);
  },

  // Summary
  async getRedemptionSummary(): Promise<RedemptionSummary> {
    return apiClient.get<RedemptionSummary>(`${REWARDS_BASE}/summary`);
  },
};