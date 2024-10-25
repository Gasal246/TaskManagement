import { ThemeProvider } from "@/components/theme/ThemeProviders";
import type { Metadata } from "next";
import { AR_One_Sans } from "next/font/google";
import SessionProvider from '@/lib/SessionProvider'
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Toaster } from "@/components/ui/sonner";
import TanstackProvider from "@/query/TanstackProvider";
import NotificationListener from "@/components/shared/NotificationListener";

const ar_one_sans = AR_One_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taskmanager",
  description: "a site by Muhammed Gasal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: any = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={ar_one_sans.className}>
        <SessionProvider session={session}>
          <TanstackProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <NotificationListener />
              {children}
              <Toaster />
            </ThemeProvider>
          </TanstackProvider>
        </SessionProvider>
      </body>
    </html >
  );
}
