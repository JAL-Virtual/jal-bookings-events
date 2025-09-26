import { FunctionComponent } from "react";
import Image from 'next/image';

interface LogoProps {
    sidebar?: boolean;
    className?: string;
}

export const Logo: FunctionComponent<LogoProps> = ({ sidebar = false, className = '' }) => {
    // Use the existing JAL logo from the public folder
    const logoSrc = "/img/jal-logo.png";
    const logoSrcDark = "/img/jal-logo-dark.png";

    return (
        <div className={`relative ${className}`}>
            <Image
                src={logoSrc}
                alt="Japan Airlines Logo"
                width={214}
                height={56}
                className={`w-54 h-14 ${sidebar ? "" : "-ml-5"} dark:hidden`}
                priority
            />
            <Image
                src={logoSrcDark}
                alt="Japan Airlines Logo"
                width={214}
                height={56}
                className={`w-54 h-14 ${sidebar ? "" : "-ml-5"} hidden dark:block`}
                priority
            />
        </div>
    );
}
