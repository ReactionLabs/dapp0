import type { Metadata } from "next";
import { WalletContextProvider } from "@/components/providers/wallet-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "dApp0 - V0 for Multi-Chain",
  description: "Build multi-chain dApps and AI agents with natural language prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletContextProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
