export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface AdminsListResponse {
  success: boolean;
  message: string;
  count: number;
  admins: AdminUser[];
}

export interface AdminResponse {
  success: boolean;
  message: string;
  admin: AdminUser;
}

export interface AdminCreatePayload {
  email: string;
  password: string;
  displayName?: string;
}

export interface AdminUpdatePayload {
  displayName?: string;
  email?: string;
  password?: string;
  disabled?: boolean;
}
