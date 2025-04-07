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
      <nav className="flex gap-4 w-full container">
        <Link
          href="/"
          className="mr-auto hover:cursor-pointer flex items-center pl-10"
        >
          <Image src="/LMS_logo.png" alt="Logo" width={230} height={100} />
        </Link>

        <Suspense>
          <SignedIn>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/admin"
            >
              Admin
            </Link>
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
            <div className="size-8 self-center">
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
            <Button className="self-center" asChild>
              <SignInButton>Sign In</SignInButton>
            </Button>
            <Button className="self-center" asChild>
              <SignUpButton>Sign Up</SignUpButton>
            </Button>
          </SignedOut>
        </Suspense>
      </nav>
    </header>
  );
}
