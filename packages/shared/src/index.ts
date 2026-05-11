export enum UserRole {
  ADMIN = 'admin',
  PLANNER = 'planner',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface Signal {
  id: string;
  name: string;
  path: string;
  type: 'location' | 'transaction' | 'cg';
}

export interface AudienceEstimate {
  signals: Signal[];
  reachableUsers: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
