import { Header } from "../../components/Header";
import { NavMenu } from "../../components/NavMenu";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div
            className="flex flex-col items-center w-full h-full"
        >
            <Header />
            <div className="flex align-items-center justify-center w-full h-full bg-primary-100">
                <NavMenu />

                <div className="flex w-full h-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
  