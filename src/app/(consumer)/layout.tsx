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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";

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
      <nav className="hidden md:flex gap-4 w-full">
        <Link
          href="/"
          className="mr-auto hover:cursor-pointer flex items-center pl-10"
        >
          <Image
            src="/LMS_logo.png"
            alt="Logo"
            width={230}
            height={100}
            className="min-w-[230]"
          />
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
            <div className="size-8 self-center mr-10 min-w-[38px]">
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
      <nav className="md:hidden flex w-full items-center gap-4">
        <Sheet>
          <Link
            href="/"
            className="mr-auto hover:cursor-pointer flex items-center pl-3"
          >
            <Image
              src="/LMS_logo.png"
              alt="Logo"
              width={230}
              height={150}
              className="min-w-[150]"
            />
          </Link>
          <Suspense>
            <SignedOut>
              <Button className="self-center hover:cursor-pointer mr-3" asChild>
                <SignInButton>Sign In</SignInButton>
              </Button>
            </SignedOut>
          </Suspense>
          <Suspense>
            <SignedIn>
              <div className="size-8 self-center min-w-[38px]">
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
          <SignedIn>
            <SheetTrigger asChild>
              <Button className="mr-6 hover:cursor-pointer" variant="outline">
                <AlignJustify />
              </Button>
            </SheetTrigger>
          </SignedIn>
          <SheetContent className="w-[200px]">
            <SheetHeader>
              <Suspense>
                <SignedIn>
                  <div className="h-10"></div>
                  <AdminLink />
                  <SheetClose asChild>
                    <Link
                      className="px-2 h-8 flex items-center border-y border-black"
                      href="/courses"
                    >
                      My Courses
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      className="flex items-center px-2 h-8 border-b border-black"
                      href="/purchases"
                    >
                      Purchase History
                    </Link>
                  </SheetClose>
                </SignedIn>
              </Suspense>
              <Suspense>
                <SignedOut>
                  <SheetClose asChild>
                    <Button
                      className="hover:cursor-pointer mt-7 w-[100px] self-center"
                      asChild
                    >
                      <SignInButton>Sign In</SignInButton>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      className="hover:cursor-pointer w-[100px] self-center"
                      asChild
                    >
                      <SignUpButton>Sign Up</SignUpButton>
                    </Button>
                  </SheetClose>
                </SignedOut>
              </Suspense>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

//Determine if user is admin or not and display Admin option accordingly in the navbar.
async function AdminLink() {
  const user = await getCurrentUser();
  if (user.role === "admin")
    return (
      <Link
        className="hover:bg-accent/10 flex items-center px-2 h-8 md:h-auto"
        href="/admin"
      >
        Admin
      </Link>
    );
}
