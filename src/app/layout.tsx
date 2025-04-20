import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import ReactQueryProvider from "../utils/ReactQueryProvider";
import { AuthProvider } from "../Contexts/AuthContext";

export const metadata: Metadata = {
  title: "Viagens AM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="flex flex-col items-center justify-center"
      >
          <ReactQueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ReactQueryProvider>
        <ToastContainer autoClose={8000} draggable style={{fontSize: '0.8rem'}}/>
      </body>
    </html>
  );
}
