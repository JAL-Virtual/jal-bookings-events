"use client";

import { FunctionComponent } from "react";
import { usePathname } from "next/navigation";
import { EventSidebar } from "../components/EventSidebar";
import { Footer } from "../components/Footer";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout: FunctionComponent<SidebarLayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const isAtEventDetailsPage = pathname?.includes("/event/") || false;

    return (
        <div className="flex flex-col lg:flex-row">
            <div className="lg:flex-none lg:fixed lg:h-screen lg:z-50">
                <EventSidebar />
            </div>
            <div className={`flex flex-col min-h-screen ${isAtEventDetailsPage ? "container lg:ml-32 2xl:ml-auto" : "lg:ml-28 w-full"}`}>
                <main className="h-full">
                    {children}
                </main>
                {isAtEventDetailsPage && <Footer />}
            </div>
        </div>
    )
}