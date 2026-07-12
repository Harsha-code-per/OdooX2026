import { apiClient } from "@/lib/api-client";
import type { Challenge, ChallengeProgress } from "@/types/challenge";

const CHALLENGES_BASE = "/api/v1/challenges";

export const challengeService = {
  async getChallenges(params?: {
    category?: string;
    status?: string;
  }): Promise<Challenge[]> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append("category", params.category);
    if (params?.status) queryParams.append("status", params.status);

    const endpoint = `${CHALLENGES_BASE}${queryParams.toString() ? `?${queryParams}` : ""}`;
    const res = await apiClient.get<any[]>(endpoint);
    return res.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      type: c.category as any,
      status: c.status as any,
      points: c.points_reward,
      deadline: c.deadline,
      participants: 15,
      completionRate: 85,
    }));
  },

  async getMyParticipations(): Promise<ChallengeProgress[]> {
    const res = await apiClient.get<any[]>(`${CHALLENGES_BASE}/participations`);
    return res.map((p) => ({
      challengeId: p.challenge_id,
      userId: p.user_id,
      progress: p.progress,
      completedAt: p.completed_at,
      points_earned: p.points_awarded,
      status: p.status,
    }));
  },

  async getChallengeDetails(challengeId: string): Promise<Challenge> {
    const c = await apiClient.get<any>(`${CHALLENGES_BASE}/${challengeId}`);
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      type: c.category as any,
      status: c.status as any,
      points: c.points_reward,
      deadline: c.deadline,
      participants: 15,
      completionRate: 85,
    };
  },

  async joinChallenge(challengeId: string): Promise<ChallengeProgress> {
    const res = await apiClient.post<any>(
      `${CHALLENGES_BASE}/${challengeId}/join`,
    );
    return {
      challengeId: res.challenge_id,
      userId: res.user_id,
      progress: res.progress,
      completedAt: res.completed_at,
      points_earned: res.points_awarded,
      status: res.status,
    };
  },

  async updateChallengeProgress(
    challengeId: string,
    progress: number,
    status: string,
    proofFile?: string,
  ): Promise<ChallengeProgress> {
    const res = await apiClient.post<any>(
      `${CHALLENGES_BASE}/${challengeId}/progress`,
      {
        progress,
        status,
        proof_file: proofFile,
      },
    );
    return {
      challengeId: res.challenge_id,
      userId: res.user_id,
      progress: res.progress,
      completedAt: res.completed_at,
      points_earned: res.points_awarded,
      status: res.status,
    };
  },
};
