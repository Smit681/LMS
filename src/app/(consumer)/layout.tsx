import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/clerk";

export default function ConsumerLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Navbar() {
  return (
    <header className="flex items-center bg-background shadow z-10 h-14">
      <nav className="flex gap-4 w-full">
        <Link
          href="/"
          className="mr-auto hover:cursor-pointer flex items-center pl-10"
        >
          <Image src="/LMS_logo.png" alt="Logo" width={230} height={100} />
        </Link>

        <Suspense>
          <SignedIn>
            <AdminLink />
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/courses"
            >
              My Courses
            </Link>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/purchases"
            >
              Purchase History
            </Link>
            <div className="size-8 self-center mr-10">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: "100%", height: "100%" },
                  },
                }}
              />
            </div>
          </SignedIn>
        </Suspense>
        <Suspense>
          <SignedOut>
            <Button className="self-center hover:cursor-pointer" asChild>
              <SignInButton>Sign In</SignInButton>
            </Button>
            <Button className="self-center mr-10 hover:cursor-pointer" asChild>
              <SignUpButton>Sign Up</SignUpButton>
            </Button>
          </SignedOut>
        </Suspense>
      </nav>
    </header>
  );
}

//Determine if user is admin or not and display Admin option accordingly in the navbar.
async function AdminLink() {
  const user = await getCurrentUser();
  if (user.role === "admin")
    return (
      <Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
        Admin
      </Link>
    );
}
