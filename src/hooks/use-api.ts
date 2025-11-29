import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface UserProfile {
  nick: string;
  email: string;
  streak: number;
  stats: {
    totalTasks: number;
    completedTasks: number;
    progress: number;
  };
  activeGoals: Goal[];
  activeGoalsCount: number;
  registrationDate: string;
  lastActivity: string;
  interests: string[];
}

export interface Goal {
  id: number;
  userId: string;
  title: string;
  description?: string;
  categoryId?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

export interface Task {
  id: number;
  goalId: number;
  userId: string;
  dueDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskProof {
  id: number;
  taskId: number;
  createdAt: string;
}

export interface ActivityParticipant {
  userId: string;
  activityId: number;
  joinedAt: string;
  role: string;
  user?: {
    id: string;
    name: string;
    image?: string | null;
  };
}

export interface Activity {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  participants?: ActivityParticipant[];
}

// --- Hooks ---

// Profile
export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
  });
}

// Goals
export function useGoals() {
  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      const res = await fetch("/api/goals");
      if (!res.ok) throw new Error("Failed to fetch goals");
      return res.json();
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newGoal: { title: string; description?: string; startDate: string; endDate: string; categoryId?: number }) => {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoal),
      });
      if (!res.ok) throw new Error("Failed to create goal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// Tasks
export function useTasks(goalId?: number) {
  return useQuery<Task[]>({
    queryKey: ["tasks", goalId],
    queryFn: async () => {
      const url = goalId ? `/api/tasks?goalId=${goalId}` : "/api/tasks";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTask: { goalId: number; dueDate: string; status?: string }) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error("Failed to create task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// Proofs
export function useProofs(taskId: number) {
  return useQuery<TaskProof[]>({
    queryKey: ["proofs", taskId],
    queryFn: async () => {
      if (!taskId) return [];
      const res = await fetch(`/api/proofs?taskId=${taskId}`);
      if (!res.ok) throw new Error("Failed to fetch proofs");
      return res.json();
    },
    enabled: !!taskId,
  });
}

export function useCreateProof() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, file }: { taskId: number; file: File }) => {
      const formData = new FormData();
      formData.append("taskId", taskId.toString());
      formData.append("file", file);

      const res = await fetch("/api/proofs", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload proof");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["proofs", variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// Activities
export function useActivities() {
  return useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      const res = await fetch("/api/activities");
      if (!res.ok) throw new Error("Failed to fetch activities");
      return res.json();
    },
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create activity");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}
