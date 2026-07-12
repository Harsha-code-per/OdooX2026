/**
 * Department Types
 *
 * Mirror department response shapes from 04-api-contract.md:
 * GET /departments and GET /departments/{id}.
 */
import type { User } from "@/types/user";

export interface Department {
  id: string;
  name: string;
  manager: string;
  employees: number;
  esg_score: number;
  participation?: number;
  status?: DepartmentStatus;
}

export type DepartmentStatus = "active" | "archived";

export interface DepartmentDetail extends Department {
  employees_list: User[];
  scores: DepartmentScores;
  activities: DepartmentActivity[];
}

export interface DepartmentScores {
  environmental: number;
  social: number;
  governance: number;
  overall: number;
}

export interface DepartmentActivity {
  id: string;
  type: string;
  title: string;
  date: string;
}

export interface CreateDepartmentPayload {
  name: string;
}

export interface UpdateDepartmentPayload {
  name?: string;
  manager?: string;
}
