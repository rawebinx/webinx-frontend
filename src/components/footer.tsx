import { Link } from "wouter";
import { Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer w-fit">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                  <Video className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  Webin<span className="text-primary">X</span>
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground max-w-xs">
              The world's leading webinar discovery platform. Connect with expert hosts and level up your knowledge.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Platform</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/webinars" className="hover:text-foreground transition-colors">
                Browse Webinars
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Company</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              
              {/* FIXED LINKS */}
              <Link href="/about" className="hover:text-foreground transition-colors">
                About
              </Link>

              <Link href="/host" className="hover:text-foreground transition-colors">
                Become a Host
              </Link>

              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>

            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          
          <p>© {new Date().getFullYear()} WebinX. All rights reserved.</p>

          <div className="flex gap-4">

            {/* FIXED LEGAL LINKS */}
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}
