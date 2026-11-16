
"use client"

import { useMemo, useState, useEffect } from "react"
import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation"
import {
  Search,
  Globe,
  BriefcaseBusiness,
  Bookmark,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react"

// Job type
type Job = {
  _id: string
  jobTitle?: string
  title?: string
  companyName?: string
  company?: string
  category?: string
  dept?: string
  jobType?: string
  type?: string
  location?: string
  isRemote?: boolean
  minimumSalary?: number
  maximumSalary?: number
  compensation?: string
  salaryFrequency?: string
  createdAt?: string
  postedAt?: string
  image?: string
}

// Job type filter options
const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
]

// Get job information
function getJobTitle(job: Job) {
  return job.jobTitle || job.title || "Untitled Job"
}

function getCompany(job: Job) {
  return job.companyName || job.company || "Unknown Company"
}

function getJobType(job: Job) {
  return job.jobType || job.type || "Not specified"
}

function getSalary(job: Job) {
  if (job.compensation) return job.compensation

  if (job.minimumSalary == null && job.maximumSalary == null) {
    return "Salary not disclosed"
  }

  const min = job.minimumSalary?.toLocaleString() || ""
  const max = job.maximumSalary?.toLocaleString() || ""

  const amount = min && max ? `${min} - ${max}` : min || max

  const frequency: Record<string, string> = {
    hourly: "/hr",
    daily: "/day",
    weekly: "/week",
    monthly: "/month",
    yearly: "/year",
  }

  return `${amount} ${frequency[job.salaryFrequency || ""] || ""}`
}

// Main component
export default function BrowseJobsClient({ jobs }: { jobs: Job[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams
      .getAll("jobType")
      .map(
        (type) =>
          jobTypes.find(
            (item) => item.toLowerCase() === type.toLowerCase()
          ) || type
      )
  )

  const [sortBy, setSortBy] = useState("recent")

  // Navigate to job details
  const handleJobView = (jobId: string) => {
    router.push(`/browse-jobs/${jobId}`)
  }

  // Update state when URL changes
  useEffect(() => {
    setSearch(searchParams.get("search") || "")

    setSelectedTypes(
      searchParams
        .getAll("jobType")
        .map(
          (type) =>
            jobTypes.find(
              (item) => item.toLowerCase() === type.toLowerCase()
            ) || type
        )
    )
  }, [searchParams])

  // Update URL
  const updateURL = (searchText: string, types: string[]) => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete("search")
    params.delete("jobType")

    if (searchText.trim()) {
      params.set("search", searchText.trim())
    }

    types.forEach((type) => {
      params.append("jobType", type.toLowerCase())
    })

    const query = params.toString()

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    })
  }

  // Handle job type filter
  const handleTypeChange = (type: string) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((item) => item !== type)
      : [...selectedTypes, type]

    setSelectedTypes(updatedTypes)
    updateURL(search, updatedTypes)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearch("")
    setSelectedTypes([])
    updateURL("", [])
  }

  // Search, filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const title = getJobTitle(job).toLowerCase()
      const company = getCompany(job).toLowerCase()
      const location = (job.location || "").toLowerCase()
      const category = (job.category || job.dept || "").toLowerCase()
      const searchText = search.toLowerCase()

      const matchesSearch =
        title.includes(searchText) ||
        company.includes(searchText) ||
        location.includes(searchText) ||
        category.includes(searchText)

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.some(
          (type) => getJobType(job).toLowerCase() === type.toLowerCase()
        )

      return matchesSearch && matchesType
    })

    // Sorting
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.postedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.postedAt || b.createdAt || 0).getTime()

      if (sortBy === "recent") return dateB - dateA
      if (sortBy === "oldest") return dateA - dateB

      if (sortBy === "salary-high") {
        return (b.maximumSalary || 0) - (a.maximumSalary || 0)
      }

      if (sortBy === "salary-low") {
        return (a.minimumSalary || 0) - (b.minimumSalary || 0)
      }

      return 0
    })

    return result
  }, [jobs, search, selectedTypes, sortBy])

  return (
    <main className="min-h-screen bg-[#08080d] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updateURL(search, selectedTypes)
          }}
          className="flex gap-2 rounded-xl border border-white/10 bg-[#111118] p-2"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
            <Search size={18} className="shrink-0 text-neutral-500" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, company, keywords..."
              className="h-9 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-neutral-600"
            />
          </div>

          <button
            type="submit"
            className="shrink-0 rounded-lg bg-violet-600 px-4 text-xs font-semibold transition hover:bg-violet-500 sm:px-6 sm:text-sm"
          >
            Search Jobs
          </button>
        </form>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[190px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]">

          {/* Filters Sidebar */}
          <aside className="sticky top-5 h-fit self-start rounded-xl border border-white/10 bg-[#111118] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Filters</h2>
              <SlidersHorizontal size={15} className="text-neutral-500" />
            </div>

            <div>
              <h3 className="mb-3 text-xs font-medium text-neutral-400">
                Job Type
              </h3>

              <div className="space-y-3">
                {jobTypes.map((type) => {
                  const count = jobs.filter(
                    (job) =>
                      getJobType(job).toLowerCase() === type.toLowerCase()
                  ).length

                  return (
                    <label
                      key={type}
                      className="flex cursor-pointer items-center justify-between gap-2 text-xs"
                    >
                      <span className="flex items-center gap-2 text-neutral-300">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeChange(type)}
                          className="h-3.5 w-3.5 accent-violet-500"
                        />
                        {type}
                      </span>

                      <span className="text-[10px] text-neutral-600">
                        {count}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {(selectedTypes.length > 0 || search) && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-xs text-violet-400 hover:text-violet-300"
              >
                Clear filters
              </button>
            )}
          </aside>

          {/* Job Listings */}
          <section className="min-w-0">

            {/* Result Header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-sm font-semibold sm:text-base">
                  Found {filteredJobs.length.toLocaleString()} Professional Jobs
                </h1>

                <p className="mt-1 text-[11px] text-neutral-500">
                  Explore opportunities that match your skills.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-[10px] text-neutral-500">
                  Sort by:
                </label>

                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-white/10 bg-[#111118] px-2 py-2 text-[11px] text-neutral-300 outline-none focus:border-violet-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest</option>
                  <option value="salary-high">Highest Salary</option>
                  <option value="salary-low">Lowest Salary</option>
                </select>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <article
                  key={job._id}
                  onClick={() => handleJobView(job._id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleJobView(job._id)
                    }
                  }}
                  role="link"
                  tabIndex={0}
                  aria-label={`View details for ${getJobTitle(job)}`}
                  className="group flex min-w-0 cursor-pointer gap-3 rounded-xl border border-white/10 bg-[#111118] p-3 transition duration-200 hover:border-violet-500/50 hover:bg-[#151520] sm:gap-4 sm:p-4"
                >
                  {/* Job Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#1b1b25] text-violet-400 transition group-hover:border-violet-500/30 group-hover:bg-violet-500/10">
                    <BriefcaseBusiness size={19} />
                  </div>

                  {/* Job Information */}
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold text-white transition group-hover:text-violet-300">
                      {getJobTitle(job)}
                    </h2>

                    <p className="mt-1 truncate text-xs text-neutral-500">
                      {getCompany(job)}
                      {" • "}
                      {job.location || "Location not specified"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-neutral-300">
                        {getSalary(job)}
                      </span>

                      <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-neutral-300">
                        {getJobType(job)}
                      </span>

                      {(job.isRemote ||
                        job.location?.toLowerCase().includes("remote")) && (
                        <span className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-400">
                          <Globe size={11} />
                          Remote
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Save Job Button */}
                  <button
                    type="button"
                    title="Save job"
                    aria-label="Save job"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="h-fit shrink-0 rounded-md p-1.5 text-neutral-500 transition hover:bg-white/5 hover:text-violet-400"
                  >
                    <Bookmark size={16} />
                  </button>

                  {/* View Details Icon */}
                  {/* <div className="hidden shrink-0 items-center text-neutral-600 transition group-hover:translate-x-0.5 group-hover:text-violet-400 sm:flex">
                    <ArrowUpRight size={18} />
                  </div> */}
                </article>
              ))}

              {/* Empty State */}
              {filteredJobs.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-[#111118] px-4 py-14 text-center">
                  <BriefcaseBusiness
                    size={30}
                    className="mx-auto text-neutral-600"
                  />

                  <h3 className="mt-3 text-sm font-semibold">
                    No jobs found
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    Try another keyword or change your filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 text-xs text-violet-400 hover:text-violet-300"
                  >
                    Clear search and filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
