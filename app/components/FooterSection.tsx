
import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#09090d] text-gray-400">
      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* Footer Content */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

          {/* Logo and Description */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <BriefcaseBusiness className="text-violet-500" size={25} />
              <span className="text-xl font-bold text-white">
                Hire<span className="text-violet-500">Loop</span>
              </span>
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6">
              Find your dream job and connect with the right opportunities.
              Build your career with HireLoop.
            </p>
          </div>
          {/* Copyright */}
        <div className="mt-2 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} HireLoop. All rights reserved.
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
