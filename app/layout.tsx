import type { Metadata } from "next";
import { Fira_Code, Fira_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { MasterLayout } from "../components/layout";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hotel Management System",
  description: "Quản lý khách sạn chuyên nghiệp - Professional Hotel Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${firaCode.variable} ${firaSans.variable} antialiased`}
        style={{ fontFamily: "var(--font-fira-sans), 'Fira Sans', sans-serif" }}
      >
        <MasterLayout>
          {children}
        </MasterLayout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#1E3A8A',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
