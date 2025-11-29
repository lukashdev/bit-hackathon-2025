"use client"
import { useProfile } from "@/hooks/use-api"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { toaster } from "@/components/ui/toaster"

export function InterestGuard({ children }: { children: React.ReactNode }) {
    const { data: profile, isLoading, isError, isFetching } = useProfile()
    const pathname = usePathname()
    const router = useRouter()
    const hasNotified = useRef(false)

    useEffect(() => {
        if (isLoading || isFetching) return
        
        // Allow access to public pages
        const publicPaths = ['/login', '/register', '/']
        if (publicPaths.includes(pathname)) return

        // If we have a profile (user is logged in)
        if (profile) {
            // Check if interests are empty
            if (!profile.interests || profile.interests.length === 0) {
                // If not already on the interests page
                if (pathname !== '/interests') {
                    if (!hasNotified.current) {
                         toaster.create({
                            title: "Wymagane działanie",
                            description: "Aby korzystać z aplikacji, musisz wybrać swoje zainteresowania.",
                            type: "info",
                            duration: 5000,
                        })
                        hasNotified.current = true
                    }
                    router.push('/interests')
                }
            }
        }
    }, [profile, isLoading, isFetching, pathname, router])

    return <>{children}</>
}
