'use client'

import Link from 'next/link'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { logout } from '@/lib/logout'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null) // remove user from navbar
    window.location.href = '/' // redirect to homepage
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          JobNexus
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 font-medium md:flex">
          <Link
            href="/jobs"
            className="text-foreground/80 hover:text-foreground"
          >
            Browse Jobs
          </Link>
          <Link
            href="/companies"
            className="text-foreground/80 hover:text-foreground"
          >
            Companies
          </Link>
          <Link
            href="/career-advice"
            className="text-foreground/80 hover:text-foreground"
          >
            Resources
          </Link>

          {/* If NOT logged in */}
          {!user && (
            <div className="ml-4 flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          )}

          {/* If logged in */}
          {user && (
            <div className="ml-4 flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.email}
              </span>

              <Button size="sm" variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}

          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>
    </header>
  )
}
