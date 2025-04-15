"use client";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import React, { useState, useEffect } from "react";
import Loader from "./components/common/Loader";

import HomeLayout from "./home";
import {usePathname, useRouter} from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname()

  const isLayoutNotNeeded = [`/auth/signin`].includes(pathname);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? (
            <Loader />
          ) :
                  isLayoutNotNeeded ?
                      <div className="h-screen w-auto md:flex md:items-center md:justify-center">
                        {children}
                      </div>
                      :
                      (
                        <HomeLayout>
                          {children}
                        </HomeLayout>
                      )
          }
        </div>
      </body>
    </html>
  );
}
