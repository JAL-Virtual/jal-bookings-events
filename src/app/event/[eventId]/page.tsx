"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EventDetailsPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to login page
        router.push('/');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Redirecting to login...</p>
            </div>
        </div>
    );
}
