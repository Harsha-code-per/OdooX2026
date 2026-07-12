/**
 * Department Service
 */
import { delay } from "@/lib/helpers";
import { mockDepartments } from "@/mocks/departments";
import type {
  CreateDepartmentPayload,
  Department,
  UpdateDepartmentPayload,
} from "@/types/department";

const SIMULATED_DELAY = 600;

export async function getDepartments(): Promise<Department[]> {
  await delay(SIMULATED_DELAY);
  return mockDepartments;
}

export async function getDepartmentById(id: string): Promise<Department> {
  await delay(SIMULATED_DELAY);
  const dept = mockDepartments.find((d) => d.id === id);
  if (!dept) throw new Error(`Department ${id} not found`);
  return dept;
}

export async function createDepartment(
  payload: CreateDepartmentPayload,
): Promise<Department> {
  await delay(SIMULATED_DELAY);
  return {
    id: `dept-${Date.now()}`,
    ...payload,
    manager: "Unassigned",
    employees: 0,
    esg_score: 0,
  };
}

export async function updateDepartment(
  id: string,
  payload: UpdateDepartmentPayload,
): Promise<Department> {
  await delay(SIMULATED_DELAY);
  const dept = mockDepartments.find((d) => d.id === id);
  if (!dept) throw new Error(`Department ${id} not found`);
  return { ...dept, ...payload };
}

export async function deleteDepartment(id: string): Promise<void> {
  await delay(SIMULATED_DELAY);
  console.info(`[Mock] Archive department ${id}`);
}
