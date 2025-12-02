import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Twitter,
  Linkedin,
  Github,
  Mail,
  Shield,
  Users,
  ArrowRight,
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center">
              <span className="text-foreground text-2xl font-bold">
                JobNexus
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md text-sm leading-relaxed">
              Connecting talented professionals with their dream opportunities.
              Your next career move starts here with our advanced job matching
              platform.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
              For Job Seekers
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/jobs', label: 'Browse Jobs' },
                { href: '/companies', label: 'Companies' },
                { href: '/career-advice', label: 'Career Advice' },
                { href: '/resume-builder', label: 'Resume Builder' },
              ].map((item) => (
                <li key={item.href}>
                  <Button
                    variant="link"
                    className="text-muted-foreground hover:text-foreground h-auto justify-start p-0 font-normal"
                    asChild
                  >
                    <a href={item.href}>{item.label}</a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
              ].map((item) => (
                <li key={item.href}>
                  <Button
                    variant="link"
                    className="text-muted-foreground hover:text-foreground h-auto justify-start p-0 font-normal"
                    asChild
                  >
                    <a href={item.href}>{item.label}</a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Newsletter Subscription */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="mb-6 text-center">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Stay Updated with Job Opportunities
            </h3>
            <p className="text-muted-foreground text-sm">
              Get the latest job openings and career tips delivered to your
              inbox weekly.
            </p>
          </div>
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="flex-1"
            />
            <Button>
              Subscribe
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-muted-foreground text-center text-sm md:text-left">
            © {new Date().getFullYear()} JobNexus. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="text-muted-foreground flex items-center">
              <Shield className="mr-1 h-4 w-4 text-green-500" />
              <span>Secure & Verified</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="text-muted-foreground flex items-center">
              <Users className="mr-1 h-4 w-4 text-blue-500" />
              <span>10,000+ Professionals</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
