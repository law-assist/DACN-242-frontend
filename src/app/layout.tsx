import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AuthProvider from "src/components/auth/AuthProvider";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "XinChaoVietNam",
    description: "Thư viện tra cứu văn bản pháp luật",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`min-h-screen`}>
                <AuthProvider>
                    <AntdRegistry>{children}</AntdRegistry>
                </AuthProvider>
            </body>
        </html>
    );
}
