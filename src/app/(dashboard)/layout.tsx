import { Header } from "../../components/Header";
import { NavMenu } from "../../components/NavMenu";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="flex flex-col items-center w-full h-screen">
            <Header />
            <div className="flex align-items-center justify-center w-full flex-1 bg-primary-100 overflow-y-hidden">
                <NavMenu />
                <div className="flex w-full h-full p-2">
                    {children}
                </div>
            </div>
        </div>
    );
}
  