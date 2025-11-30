import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface UserProfile {
  nick: string;
  email: string;
  image?: string | null;
  streak: number;
  stats: {
    totalTasks: number;
    completedTasks: number;
    progress: number;
    likesReceived: number;
  };
  activeGoals: Goal[];
  activeGoalsCount: number;
  lastCompletedGoal?: Goal | null;
  registrationDate: string;
  lastActivity: string;
  interests: string[];
}

export interface Goal {
  id: number;
  activityId: number;
  title: string;
  description?: string;
  categoryId?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
  progress?: { isCompleted: boolean }[];
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
  goals?: Goal[];
}

export interface RadarUser {
  id: string;
  name: string;
  image?: string | null;
  isOnline: boolean;
  commonInterestsCount: number;
  interests: string[];
}

export interface RadarActivity {
  id: number;
  name: string;
  description?: string | null;
  participantsCount: number;
  commonInterestsCount: number;
  interests: string[];
  hasPendingRequest: boolean;
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

export function useUserProfile(userId: string) {
  return useQuery<UserProfile>({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user profile");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useUpdateInterests() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (interests: string[]) => {
      const res = await fetch("/api/users/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests }),
      });
      if (!res.ok) throw new Error("Failed to update interests");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["radar"] });
    },
  });
}

// Goals
export function useGoals(activityId?: number) {
  return useQuery<Goal[]>({
    queryKey: ["goals", activityId],
    queryFn: async () => {
      const url = activityId ? `/api/goals?activityId=${activityId}` : "/api/goals";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch goals");
      return res.json();
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newGoal: { activityId: number; title: string; description?: string; startDate: string; endDate: string; categoryId?: number }) => {
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
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// Goal Progress
export function useGoalProgress(goalId: number) {
  return useQuery<{ isCompleted: boolean }>({
    queryKey: ["goalProgress", goalId],
    queryFn: async () => {
      const res = await fetch(`/api/goals/${goalId}/progress`);
      if (!res.ok) throw new Error("Failed to fetch goal progress");
      return res.json();
    },
  });
}

export function useUpdateGoalProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ goalId, isCompleted }: { goalId: number; isCompleted: boolean }) => {
      const res = await fetch(`/api/goals/${goalId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });
      if (!res.ok) throw new Error("Failed to update goal progress");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goalProgress", variables.goalId] });
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
export function useActivities(userId?: string) {
  return useQuery<Activity[]>({
    queryKey: ["activities", userId],
    queryFn: async () => {
      const url = userId ? `/api/activities?userId=${userId}` : "/api/activities";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch activities");
      return res.json();
    },
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string; interestIds?: number[] }) => {
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

export function useInviteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ activityId, email }: { activityId: number, email: string }) => {
            const res = await fetch(`/api/activities/${activityId}/invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to invite user");
            }
            return res.json();
        },
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ["activities"] });
        }
    })
}

// Radar
export function useRadar() {
  return useQuery<RadarUser[]>({
    queryKey: ["radar"],
    queryFn: async () => {
      const res = await fetch("/api/radar");
      if (!res.ok) throw new Error("Failed to fetch radar matches");
      return res.json();
    },
  });
}

export function useRadarActivity() {
  return useQuery<RadarActivity[]>({
    queryKey: ["radar-activity"],
    queryFn: async () => {
      const res = await fetch("/api/radar/activity");
      if (!res.ok) throw new Error("Failed to fetch activity radar matches");
      return res.json();
    },
  });
}