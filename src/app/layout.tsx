// layout.tsx files are wrappers around the routes it's created under. This files is created directly under the app directory, so it will be a wrapper around the entire app. layout files are used to minimize rendering and to share components between routes. For example, if you have a header and a footer that are the same across all pages, you can put them in the layout file. This way, they will only be rendered once, instead of on every page.

// page.tsx files are the actual pages that are rendered.
// app > about > page.tsx will be the page that is rendered when you go to /about.

// Folder name in round brackets are used to group routes. It allows layout nesting. Notice the folder (consumer). There are courses, products and purchases folder under that. I don't want /consumer/ in the ulr. So routes will be "/", "courses", "products" and "purchases". Also notice that that all three routes are expected to have the same navbar so I grouped them under a folder (consumer) and created a layout file with the component navbar.

// Folder name with square brackets are used to create dynamic routes. For example, if you have a folder [id], it will create a dynamic route. So if you go to /10 or /15, it will render the same page in that folder.

// Catch-all routes are used to catch all the routes that are not defined. For example, if you have a folder [...sign-in] in sign-in folder, it will catch all the routes that are not defined after /sign-in. So if you go to /sign-in or /sign-in/abcd or /sign-in/asdf/234sdf, it will render the same page in that folder. This is useful for creating a 404 page or a catch-all page.

import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Brainstormr",
  description: "LMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <ClerkProvider>
        <html lang="en">
          <body className="antialiased">
            {children}
            <Toaster position="top-center" />
          </body>
        </html>
      </ClerkProvider>
    </Suspense>
  );
}
