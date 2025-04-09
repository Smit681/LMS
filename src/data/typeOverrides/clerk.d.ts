import { UserRole } from "@/drizzle/schema";

export {};

//delared a global type
declare global {
  interface CustomJwtSessionClaims {
    dbId?: string;
    role?: UserRole;
  }

  interface UserPublicMetadata {
    dbId?: string;
    role?: UserRole;
  }
}
