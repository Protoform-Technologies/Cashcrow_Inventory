import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-cashcrow-accent bg-cashcrow-bg/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-cashcrow-primary" />
            <span className="text-xl font-bold text-cashcrow-primary tracking-tight">Cashcrow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm font-medium text-cashcrow-textmuted hover:text-cashcrow-primary transition-colors">Features</Link>
            <Link href="#" className="text-sm font-medium text-cashcrow-textmuted hover:text-cashcrow-primary transition-colors">Pricing</Link>
            <Link href="#" className="text-sm font-medium text-cashcrow-textmuted hover:text-cashcrow-primary transition-colors">About</Link>
            <Link href="#" className="text-sm font-medium text-cashcrow-textmuted hover:text-cashcrow-primary transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
<Link href="/login" className="hidden sm:block text-sm font-medium text-cashcrow-primary hover:text-cashcrow-lightgreen transition-colors">Log in</Link>
            <button className="rounded-full bg-cashcrow-primary px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-cashcrow-lightgreen transition-all hover:scale-105 active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-cashcrow-secondary py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-extrabold tracking-tight text-cashcrow-primary sm:text-7xl">
                Manage your inventory with <span className="text-cashcrow-lightgreen">precision.</span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-cashcrow-textmuted">
                The ultimate solution for scaling businesses. Track, manage, and optimize your inventory across multiple channels with our professional toolset.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <button className="rounded-full bg-cashcrow-primary px-8 py-4 text-lg font-semibold text-white shadow-xl hover:bg-cashcrow-lightgreen transition-all">
                  Start Free Trial
                </button>
                <Link href="#" className="text-lg font-semibold leading-6 text-cashcrow-primary flex items-center gap-2">
                  View Demo <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-cashcrow-accent/30 rounded-full blur-[100px] -z-10" />
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-cashcrow-lightgreen uppercase tracking-widest">Efficiency</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-cashcrow-primary sm:text-4xl">Everything you need in one place</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Real-time Tracking", desc: "Never lose track of a single item with our advanced RFID and barcode integration." },
                { title: "Smart Analytics", desc: "Gain insights into your stock turnover and predict future demands with AI." },
                { title: "Multi-channel Sync", desc: "Keep your inventory in sync across Shopify, Amazon, and your offline stores." }
              ].map((feature, i) => (
                <div key={i} className="group relative rounded-2xl border border-cashcrow-secondary p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="size-12 rounded-lg bg-cashcrow-accent/50 flex items-center justify-center mb-6">
                    <div className="size-6 rounded-sm bg-cashcrow-primary/80" />
                  </div>
                  <h3 className="text-xl font-bold text-cashcrow-primary">{feature.title}</h3>
                  <p className="mt-4 text-cashcrow-textmuted leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-cashcrow-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-cashcrow-accent text-sm">© 2026 Cashcrow Inventory Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
