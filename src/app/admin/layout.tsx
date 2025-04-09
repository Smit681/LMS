import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { Badge } from "@/components/ui/badge";

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
        <Link href="/" className="hover:cursor-pointer flex items-center pl-10">
          <Image src="/LMS_logo.png" alt="Logo" width={230} height={100} />
        </Link>
        <Badge className="mr-auto flex self-center h-6">Admin</Badge>

        <Suspense>
          <SignedIn>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/admin/courses"
            >
              Courses
            </Link>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/admin/purchases"
            >
              Products
            </Link>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/admin/sales"
            >
              Sales
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
      </nav>
    </header>
  );
}
