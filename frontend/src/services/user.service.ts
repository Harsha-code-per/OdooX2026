import { delay } from "@/lib/helpers";
import { mockUsers } from "@/mocks/users";
import type { InviteUserPayload, UpdateUserPayload, User } from "@/types/user";

const SIMULATED_DELAY = 600;

export async function getUsers(): Promise<User[]> {
  await delay(SIMULATED_DELAY);
  return mockUsers;
}

export async function inviteUser(payload: InviteUserPayload): Promise<User> {
  await delay(800);
  return {
    id: `user-${Date.now()}`,
    name: payload.email.split("@")[0],
    email: payload.email,
    role: payload.role,
    department: payload.department,
    status: "pending",
  };
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<User> {
  await delay(SIMULATED_DELAY);
  const user = mockUsers.find((u) => u.id === id);
  if (!user) throw new Error(`User ${id} not found`);
  return { ...user, ...payload };
}
