
import Image from "next/image";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Building2,
  Users,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    icon: BriefcaseBusiness,
    number: "50K",
    label: "Active Jobs",
  },
  {
    icon: Building2,
    number: "12K",
    label: "Companies",
  },
  {
    icon: Users,
    number: "2M",
    label: "Job Seekers",
  },
  {
    icon: Star,
    number: "97%",
    label: "Satisfaction Rate",
  },
];

const trendingSearches = [
  "React Developer",
  "UI/UX Designer",
  "Digital Marketing",
];

const JobBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#050505] text-white">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-[300px] h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-purple-700/30 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col items-center px-4 pt-12 sm:px-6 md:pt-16">

        {/* Top Badge */}
        <div className="mb-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[10px] text-gray-300">
          <span>🔥</span>
          <span className="font-semibold text-white">50,000+</span>
          NEW JOBS THIS MONTH
        </div>

        {/* Heading */}
        <div className="z-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Find Your Dream Job Today
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-gray-400 sm:text-sm">
            HireLoop connects top talent with world-class companies.
            Browse thousands of curated opportunities and land your
            next role — faster.
          </p>
        </div>

        {/* Search Bar */}
        <div className="z-20 mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-xl border border-white/10 bg-[#111111] p-2 shadow-[0_0_30px_rgba(124,58,237,0.12)] sm:flex-row sm:items-center">

          {/* Job Search */}
          <div className="flex flex-1 items-center gap-2 px-2">
            <Search size={17} className="shrink-0 text-gray-400" />

            <Input
              placeholder="Job title, skill or company"
              className="h-10 border-0 bg-transparent text-xs text-white shadow-none placeholder:text-gray-500 focus-visible:ring-0"
            />
          </div>

          <div className="hidden h-7 w-px bg-white/10 sm:block" />

          {/* Location Search */}
          <div className="flex flex-1 items-center gap-2 px-2">
            <MapPin size={17} className="shrink-0 text-gray-400" />

            <Input
              placeholder="Location or Remote"
              className="h-10 border-0 bg-transparent text-xs text-white shadow-none placeholder:text-gray-500 focus-visible:ring-0"
            />
          </div>

          {/* Search Button */}
          <Button
            size="icon"
            className="h-10 w-full shrink-0 bg-[#6545ff] text-white hover:bg-[#5435e8] sm:w-10"
          >
            <Search size={18} />
            <span className="sm:hidden">Search Jobs</span>
          </Button>
        </div>

        {/* Trending Searches */}
        <div className="z-20 mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px]">
          <span className="text-gray-500">Trending:</span>

          {trendingSearches.map((item) => (
            <button
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-gray-300 transition hover:border-purple-500 hover:text-white"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Globe Background Image */}
        <div className="pointer-events-none absolute bottom-[5px] left-1/2 z-0 h-[750px] w-[950px] max-w-[200%] -translate-x-1/2">
          <Image
            src="/images/globe.png"
            alt="Glowing globe background"
            fill
            priority
            className="object-contain object-bottom opacity-90"
          />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-transparent" />
        </div>

        {/* Globe Text */}
        <div className="absolute bottom-[205px] z-10 w-full px-4 text-center">
          <h2 className="text-base font-medium leading-7 text-gray-200 sm:text-xl">
            Assisting over 15,000 job seekers
            <br />
            find their dream positions.
          </h2>
        </div>

        {/* Statistics Cards */}
        <div className="absolute bottom-7 z-20 grid w-[calc(100%-32px)] max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="border border-white/[0.08] bg-gradient-to-b from-black/95 to-[#1b1b1b] text-white shadow-xl backdrop-blur-md"
              >
                <CardContent className="p-3 sm:p-4">
                  <Icon
                    size={15}
                    className="mb-5 text-gray-300"
                  />

                  <h3 className="text-2xl font-semibold sm:text-3xl">
                    {stat.number}
                  </h3>

                  <p className="mt-1 text-[9px] text-gray-400 sm:text-[11px]">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default JobBanner;
