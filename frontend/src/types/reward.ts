/**
 * Reward Module Types
 *
 * Types for reward redemption, user points, and loyalty system
 */

export interface Reward {
  id: string;
  name: string;
  description?: string;
  category: RewardCategory;
  points_required: number;
  image_url?: string;
  stock_quantity: number;
  status: RewardStatus;
  created_at: string;
  updated_at: string;
}

export type RewardCategory =
  | "merchandise"
  | "gift_card"
  | "experience"
  | "donation"
  | "time_off";

export type RewardStatus = "available" | "out_of_stock" | "discontinued";

export interface RewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  points_used: number;
  status: RedemptionStatus;
  notes?: string;
  processed_by?: string;
  processed_at?: string;
  fulfilled_at?: string;
  created_at: string;
  updated_at: string;
  reward?: Reward;
}

export type RedemptionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "fulfilled"
  | "cancelled";

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  total_xp: number;
  available_points: number;
  redeemed_points: number;
  created_at: string;
  updated_at: string;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  xp: number;
  transaction_type: string;
  source?: string;
  source_id?: string;
  description?: string;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  total_points: number;
  total_xp: number;
  rank: number;
  department_name?: string;
}

export interface RedemptionSummary {
  total_redemptions: number;
  pending_redemptions: number;
  approved_redemptions: number;
  rejected_redemptions: number;
  fulfilled_redemptions: number;
  points_redeemed: number;
}

export interface RewardCatalogResponse {
  rewards: Reward[];
  total_count: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

// Create/Update types
export interface RewardCreate {
  name: string;
  description?: string;
  category: RewardCategory;
  points_required: number;
  image_url?: string;
  stock_quantity: number;
}

export interface RewardRedemptionCreate {
  reward_id: string;
  notes?: string;
}

export interface PointsTransactionCreate {
  user_id: string;
  points: number;
  xp: number;
  transaction_type: string;
  source?: string;
  source_id?: string;
  description?: string;
}
