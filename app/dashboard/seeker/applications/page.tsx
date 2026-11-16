"use client"

import { useEffect, useState } from "react"
import { Bell, Mail, Loader2 } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { getMyApplications } from "@/lib/actions/application"
import {
  Application,
  ApplicationsHeader,
  ApplicationsList,
  ApplicationsStats,
} from "../../applications/ApplicationsComponents"

export default function MyApplicationsPage() {
  const { data: session, isPending } = useSession()

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("active")

  // Fetch Applications
  useEffect(() => {
    const fetchApplications = async () => {
      const userId = session?.user?.id

      if (!userId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        const data = await getMyApplications(userId)

        setApplications(data)
      } catch (error) {
        console.error("Applications Error:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!isPending) {
      fetchApplications()
    }
  }, [session?.user?.id, isPending])

  // Search and Filter
  const filteredApplications = applications.filter((application) => {
    const jobTitle = application.jobTitle || ""
    const companyName = application.companyName || ""

    const matchesSearch =
      jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      companyName.toLowerCase().includes(search.toLowerCase())

    const matchesTab =
      activeTab === "active"
        ? !application.archived
        : application.archived === true

    return matchesSearch && matchesTab
  })

  // Loading Session
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090d]">
        <Loader2 className="animate-spin text-violet-400" size={30} />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#09090d] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#09090d]/95 backdrop-blur-xl print:hidden">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-white">HireLoop</p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="text-neutral-400 transition hover:text-white"
            >
              <Bell size={18} />
            </button>

            <button
              type="button"
              aria-label="Messages"
              className="text-neutral-400 transition hover:text-white"
            >
              <Mail size={18} />
            </button>

            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-violet-500/30 bg-violet-500/10 text-sm font-semibold text-violet-300">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                session?.user?.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <ApplicationsHeader
          search={search}
          setSearch={setSearch}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <ApplicationsStats applications={applications} />

        <ApplicationsList
          applications={filteredApplications}
          loading={loading}
        />

        <p className="mt-6 text-center text-xs text-neutral-600">
          Keep moving forward. Your next opportunity could be just one
          application away.
        </p>
      </div>
    </main>
  )
}
