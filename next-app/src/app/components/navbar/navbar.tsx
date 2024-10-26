import { type Session } from "next-auth";
import { NavbarMenu } from "./navbarMenu";

export function Navbar({ session }: { session: Session | null }) {
  return <NavbarMenu session={session}></NavbarMenu>;
}
