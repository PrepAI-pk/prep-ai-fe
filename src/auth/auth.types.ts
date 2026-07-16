import type { Role } from "./permissions";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export type Session = {
  user: SessionUser;
  roles: Role[];
};
