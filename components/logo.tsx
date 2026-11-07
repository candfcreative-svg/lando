import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/lando-ripsday-logo.jpg";
import { site } from "@/data/site";

export function LogoLink({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`} aria-label={`${site.name} home`}>
      <Image src={logo} alt="" priority className="h-11 w-auto rounded-md sm:h-12" sizes="64px" />
      <span className="display whitespace-nowrap text-[1.35rem] leading-none sm:text-3xl">
        <span className="text-chrome-grad">Lando</span> <span className="text-blaze">Ripsday</span>
      </span>
    </Link>
  );
}
