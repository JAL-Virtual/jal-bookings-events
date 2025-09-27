import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/img/jal-logo.png"
        alt="JAL Logo"
        width={120}
        height={40}
        className="h-8 w-auto"
      />
    </div>
  );
}