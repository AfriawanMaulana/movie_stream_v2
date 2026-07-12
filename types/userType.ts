export interface UserType {
  id: string;
  username: string;
  email: string;
  role: string | "user" | "premium" | "admin";
  avatar?: string | null;
  createdAt?: Date;
}
