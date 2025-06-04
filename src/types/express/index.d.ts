import { Role } from "@prisma/client"; // if you use enum Role
import { JwtPayload } from "../auth";

declare global {
  namespace Express {
    interface User extends JwtPayload {
      id: string;
      email: string;
      role: Role;
    }
  }
}
