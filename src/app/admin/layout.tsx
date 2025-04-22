import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
        <Link href="/" className="hover:cursor-pointer flex items-center pl-10">
          <Image
            src="/LMS_logo.png"
            alt="Logo"
            width={230}
            height={100}
            className="min-w-[230]"
          />
        </Link>
        <Badge className="mr-auto flex self-center h-6">Admin</Badge>

        <Suspense>
          <SignedIn>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/admin/"
            >
              Admin Dashboard
            </Link>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/admin/courses"
            >
              Courses
            </Link>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/admin/products"
            >
              Products
            </Link>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/admin/sales"
            >
              Sales
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
      </nav>
      <nav className="md:hidden flex w-full gap-4 items-center">
        <Sheet>
          <Link
            href="/"
            className="hover:cursor-pointer flex items-center pl-3"
          >
            <Image
              src="/LMS_logo.png"
              alt="Logo"
              width={230}
              height={150}
              className="min-w-[150]"
            />
          </Link>
          <Badge className="mr-auto flex self-center h-6">Admin</Badge>

          <div className="hidden sm:flex size-8 self-center min-w-[38px]">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: { width: "100%", height: "100%" },
                },
              }}
            />
          </div>
          <SheetTrigger asChild>
            <Button
              className="mr-6 hover:cursor-pointer self-center"
              variant="outline"
            >
              <AlignJustify />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[200px]">
            <SheetClose asChild>
              <Link
                className="px-2 h-8 flex items-center mt-10 border-b border-black"
                href="/admin/"
              >
                Admin Dashboard
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                className="px-2 h-8 flex items-center border-b border-black"
                href="/admin/courses"
              >
                Courses
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                className="px-2 h-8 flex items-center border-b border-black"
                href="/admin/products"
              >
                Products
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                className="px-2 h-8 flex items-center border-b border-black"
                href="/admin/sales"
              >
                Sales
              </Link>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
