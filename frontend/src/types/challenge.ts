/**
 * Challenge Types
 *
 * ESG gamification challenge types used across the platform.
 */

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  status: ChallengeStatus;
  points: number;
  deadline: string;
  participants: number;
  completionRate: number;
  createdBy?: string;
}

export type ChallengeType =
  | "environmental"
  | "social"
  | "governance"
  | "team"
  | "individual";

export type ChallengeStatus = "active" | "upcoming" | "completed" | "expired";

export interface ChallengeProgress {
  challengeId: string;
  userId: string;
  progress: number;
  completedAt?: string;
  points_earned?: number;
  status?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ChallengeType;
  earnedAt?: string;
}
