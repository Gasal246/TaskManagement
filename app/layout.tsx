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
  description: "A site by Wideline IT solutions, Designed to simplify task and staff management in a business environment. Built with ease of use in mind, it allows teams to seamlessly assign, track, and complete tasks while keeping all staff data organized in one central hub. Each employee has a unique profile showcasing their roles, task history, and performance metrics. Managers can monitor task progress, set priorities, and identify bottlenecks at a glance.",
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
