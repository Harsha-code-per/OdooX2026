/**
 * Use Rewards Hook
 *
 * React hooks for reward redemption and points system
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rewardService } from "@/services/reward-service";
import type {
  PointsTransactionCreate,
  RewardCreate,
  RewardRedemptionCreate,
} from "@/types/reward";

// Reward Catalog Hooks
export function useRewardCatalog(params?: {
  category?: string;
  status?: string;
  min_points?: number;
  max_points?: number;
  skip?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["rewards", "catalog", params],
    queryFn: () => rewardService.getRewardCatalog(params),
  });
}

export function useRewardDetails(rewardId: string) {
  return useQuery({
    queryKey: ["rewards", "details", rewardId],
    queryFn: () => rewardService.getRewardDetails(rewardId),
    enabled: !!rewardId,
  });
}

export function useCreateReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reward: RewardCreate) => rewardService.createReward(reward),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
  });
}

// User Points Hooks
export function useUserPoints() {
  return useQuery({
    queryKey: ["rewards", "points"],
    queryFn: () => rewardService.getUserPoints(),
  });
}

export function usePointsTransactions(params?: {
  transaction_type?: string;
  skip?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["rewards", "transactions", params],
    queryFn: () => rewardService.getPointsTransactions(params),
  });
}

export function useCreatePointsTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transaction: PointsTransactionCreate) =>
      rewardService.createPointsTransaction(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
  });
}

// Reward Redemption Hooks
export function useRedeemReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (redemption: RewardRedemptionCreate) =>
      rewardService.redeemReward(redemption),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["rewards", "points"] });
    },
  });
}

export function useUserRedemptions(params?: {
  status_filter?: string;
  skip?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["rewards", "redemptions", params],
    queryFn: () => rewardService.getUserRedemptions(params),
  });
}

export function useUpdateRedemptionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      redemptionId,
      update,
    }: {
      redemptionId: string;
      update: { status: string; notes?: string };
    }) => rewardService.updateRedemptionStatus(redemptionId, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards", "redemptions"] });
    },
  });
}

// Leaderboard Hook
export function useLeaderboard(params?: { skip?: number; limit?: number }) {
  return useQuery({
    queryKey: ["rewards", "leaderboard", params],
    queryFn: () => rewardService.getLeaderboard(params),
    refetchInterval: 60000, // Refetch every minute
  });
}

// Summary Hook
export function useRedemptionSummary() {
  return useQuery({
    queryKey: ["rewards", "summary"],
    queryFn: () => rewardService.getRedemptionSummary(),
  });
}
