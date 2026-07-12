/**
 * Badge Module Types
 *
 * Types for badge system and user achievements
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  category: BadgeCategory;
  unlock_metric: BadgeUnlockMetric;
  unlock_threshold: number;
  unlock_rule?: Record<string, any>;
  auto_award: boolean;
  points_reward: number;
  xp_reward: number;
  is_active: boolean;
  is_limited: boolean;
  max_awards?: number;
  total_awarded: number;
  display_order: number;
  rarity: string; // 'common', 'rare', 'epic', 'legendary'
  requirements?: string;
  created_at: string;
  updated_at: string;
}

export type BadgeCategory =
  | "environmental"
  | "social"
  | "governance"
  | "leadership"
  | "innovation"
  | "community"
  | "milestone";

export type BadgeUnlockMetric =
  | "total_xp"
  | "completed_challenges"
  | "csr_activities"
  | "volunteer_hours"
  | "carbon_reduction"
  | "streak_days"
  | "team_contributions"
  | "policy_acknowledgements"
  | "custom";

export interface BadgeUnlockRule {
  id: string;
  badge_id: string;
  rule_name: string;
  metric_type: string;
  threshold_value: number;
  operator: string; // '>=', '>', '=', '<=', '<'
  conditions?: Record<string, any>;
  time_period_days?: number;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_by?: string;
  auto_awarded: boolean;
  is_displayed: boolean;
  current_value: number;
  target_value: number;
  progress_percentage: number;
  awarded_at: string;
  earned_date?: string;
  award_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  badge?: Badge;
}

export interface BadgeProgress {
  id: string;
  user_id: string;
  badge_id: string;
  metric_type: string;
  current_value: number;
  target_value: number;
  progress_percentage: number;
  is_unlocked: boolean;
  unlocked_at?: string;
  last_updated_at: string;
  streak_count: number;
  created_at: string;
  updated_at: string;
  badge?: Badge;
}

export interface BadgeUserStats {
  user_id: string;
  total_badges: number;
  unlocked_badges: number;
  in_progress_badges: number;
  locked_badges: number;
  latest_badges: Badge[];
  rarest_badges: Badge[];
}

export interface BadgeAutoAwardResult {
  success: boolean;
  awarded_count: number;
  skipped_count: number;
  failed_count: number;
  awarded_badges: UserBadge[];
  errors: string[];
}

// Create types
export interface BadgeCreate {
  name: string;
  description: string;
  icon?: string;
  category: BadgeCategory;
  unlock_metric: BadgeUnlockMetric;
  unlock_threshold: number;
  unlock_rule?: Record<string, any>;
  auto_award?: boolean;
  points_reward?: number;
  xp_reward?: number;
  is_active?: boolean;
  is_limited?: boolean;
  max_awards?: number;
  display_order?: number;
  rarity?: string;
  requirements?: string;
}

export interface BadgeUnlockRuleCreate {
  badge_id: string;
  rule_name: string;
  metric_type: string;
  threshold_value: number;
  operator?: string;
  conditions?: Record<string, any>;
  time_period_days?: number;
  is_active?: boolean;
  priority?: number;
}

export interface BadgeAwardRequest {
  user_id: string;
  badge_id: string;
  awarded_by?: string;
  auto_awarded?: boolean;
  award_metadata?: Record<string, any>;
}