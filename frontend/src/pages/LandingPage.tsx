import { ArrowDownRight, ArrowRight, Check, ChevronDown, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import pasabuyLogo from "../assets/pasabuy-logo.svg";

const feedItems = [
  { initials: "MS", name: "Miguel S.", item: "Camera lens · Cebu", status: "Taken", tone: "peach" },
  { initials: "AN", name: "Ana R.", item: "Spare seat · Manila–Cebu", status: "Open", tone: "green" },
  { initials: "JL", name: "Joel L.", item: "Pastries · Davao", status: "Open", tone: "blue" },
  { initials: "KT", name: "Kara T.", item: "Watercolor set · 2 kg", status: "Taken", tone: "sand" },
  { initials: "RM", name: "Rico M.", item: "10 kg free · Pasig–QC", status: "Open", tone: "rose" },
  { initials: "SG", name: "Sara G.", item: "Running shoes · size 9", status: "Open", tone: "green" },
];

const routeMatches = [
  ["Sat 22 Nov · Manila → Cebu", "14 kg free · Miguel S.", "Open"],
  ["Sat 22 Nov · Manila → Cebu", "8 kg free · Ana R.", "Open"],
  ["Sun 23 Nov · Manila → Cebu", "6 kg free · Bea P.", "Open"],
  ["Mon 24 Nov · Manila → Cebu", "3 kg free · Rico M.", "Taken"],
  ["Tue 25 Nov · Manila → Cebu", "5 kg free · Joel L.", "Open"],
];

const faqs = [
  ["What does Pasabuy match?", "Trips on the same route as your request, so the item travels with someone already going that way."],
  ["How do I post a trip?", "Add your route, dates and kilos free. Matching requests appear beside your trip."],
  ["How do I post a request?", "Name the item, price and address. Trips on that route appear beside it."],
  ["How is the price agreed?", "The buyer sets an estimated price. Both sides confirm before anything is sent."],
  ["Where does Pasabuy work?", "Across the Philippines, matched by route and date."],
];

function ArrowButton({ children, muted = false }: { children: string; muted?: boolean }) {
  return (
    <span
      className={`inline-flex h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-semibold transition-transform hover:-translate-y-0.5 active:translate-y-0 ${
        muted ? "bg-black/7 text-[#191a17] hover:bg-black/12" : "bg-[#ff6500] text-[#171914] hover:bg-[#ff7a21]"
      }`}
    >
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </span>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff6500]">{children}</p>;
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaf7] text-[#191a17] selection:bg-[#ff6500] selection:text-white">
      <header className="sticky top-0 z-30 border-b border-black/8 bg-[#fbfaf7]/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link to="/" className="w-24 shrink-0" aria-label="Pasabuy home">
            <img src={pasabuyLogo} alt="Pasabuy" className="h-auto w-full" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Main navigation">
            <a href="#product" className="transition-colors hover:text-[#ff6500]">Product <ChevronDown size={14} className="ml-1 inline" aria-hidden="true" /></a>
            <a href="#how-it-works" className="transition-colors hover:text-[#ff6500]">How it works</a>
            <a href="#questions" className="transition-colors hover:text-[#ff6500]">Questions</a>
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <Link to="/login" className="text-sm font-medium hover:text-[#ff6500]">Sign in</Link>
            <Link to="/register"><ArrowButton>Create an account</ArrowButton></Link>
          </div>

          <button type="button" className="rounded-full p-2 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-black/8 px-5 py-5 md:hidden" aria-label="Mobile navigation">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-4 text-sm font-medium">
              <a href="#product" onClick={() => setMenuOpen(false)}>Product</a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
              <a href="#questions" onClick={() => setMenuOpen(false)}>Questions</a>
              <div className="mt-2 flex gap-3 border-t border-black/8 pt-4">
                <Link to="/login" className="flex h-11 flex-1 items-center justify-center rounded-full border border-black/15">Sign in</Link>
                <Link to="/register" className="flex h-11 flex-1 items-center justify-center rounded-full bg-[#ff6500] font-semibold">Create account</Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <section className="relative bg-[linear-gradient(115deg,#fffdfa_5%,#fff5ed_100%)]" data-enter>
        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1200px] items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10 lg:py-20">
          <div className="max-w-[550px]">
            <SectionLabel>Across the Philippines</SectionLabel>
            <h1 className="max-w-[600px] text-[clamp(3.2rem,7vw,6.8rem)] font-medium leading-[0.91] tracking-[-0.065em]">Marketplace for travelers and buyers.</h1>
            <p className="mt-8 max-w-[460px] text-lg leading-8 text-black/65 sm:text-xl">Post the kilos you have spare or the item you need. Pasabuy matches both sides on the same route, with capacity and dates in view.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/register"><ArrowButton>Create an account</ArrowButton></Link>
              <a href="#how-it-works"><ArrowButton muted>See how it works</ArrowButton></a>
            </div>
            <div className="mt-10 flex items-center gap-3 text-sm text-black/55">
              <span className="flex -space-x-2">
                {["bg-[#edc9b9]", "bg-[#c6dfc7]", "bg-[#c7dce5]"].map((tone, index) => <span key={tone} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#fff7f0] text-[10px] font-bold ${tone}`}>{["MS", "AR", "JL"][index]}</span>)}
              </span>
              <span>One feed for every route.</span>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-[#e8e8e4] p-5 shadow-[0_24px_70px_rgba(29,30,24,0.12)] sm:min-h-[560px] sm:p-8 lg:min-h-[620px]">
            <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:45px_45px]" />
            <div className="absolute left-[13%] top-[15%] h-44 w-44 rounded-full bg-[#ffc29b]/70 blur-3xl" />
            <div className="absolute right-[8%] top-[30%] h-52 w-52 rounded-full bg-[#b9d8c0]/70 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-semibold text-black/45"><span>Pasabuy feed</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#ff6500]" /> Live matches</span></div>
              <div className="mx-auto w-full max-w-[340px] rounded-xl border border-black/10 bg-white/90 p-4 shadow-xl backdrop-blur sm:p-5">
                <div className="flex items-center justify-between border-b border-black/8 pb-4"><div><p className="text-xs text-black/45">Trip</p><p className="mt-1 font-semibold">Manila → Cebu</p></div><span className="rounded-full bg-[#fff0e7] px-2.5 py-1 text-[11px] font-semibold text-[#d95700]">14 kg free</span></div>
                <div className="space-y-4 pt-4">
                  {routeMatches.slice(0, 3).map(([route, details, status]) => <div key={`${route}-${details}`} className="flex items-center justify-between gap-3 text-xs"><div><p className="font-semibold">{route}</p><p className="mt-1 text-black/45">{details}</p></div><span className={`rounded-full border px-2 py-1 font-semibold ${status === "Taken" ? "border-black/15 bg-black/5" : "border-black/10 text-black/50"}`}>{status}</span></div>)}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-black/45"><span>Match by route and date</span><ArrowDownRight size={17} aria-hidden="true" /></div>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="grid items-end gap-8 lg:grid-cols-2"><h2 className="max-w-[560px] text-4xl font-medium tracking-[-0.05em] sm:text-6xl">Every match in one feed.</h2><div className="max-w-[480px]"><p className="text-lg leading-8 text-black/55">Requests and open trips sit side by side on the same route. Open one to see the item, the kilos free and the dates before you take it.</p><a href="#how-it-works" className="mt-5 inline-flex items-center gap-2 border-b border-black/25 pb-1 text-sm font-semibold hover:border-[#ff6500] hover:text-[#ff6500]">See what a match checks <ArrowRight size={15} /></a></div></div>
        <div className="mt-16 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_20px_60px_rgba(29,30,24,0.08)]">
          <div className="flex items-center gap-2 border-b border-black/8 px-4 py-3 text-xs text-black/45"><span className="h-2 w-2 rounded-full bg-black/15" /><span className="h-2 w-2 rounded-full bg-black/15" /><span className="h-2 w-2 rounded-full bg-black/15" /><span className="ml-4 font-semibold">Feed / Open</span><div className="ml-auto flex items-center gap-2 rounded-md border border-black/10 px-3 py-1.5"><Search size={13} /> Search</div></div>
          <div className="grid min-h-[430px] lg:grid-cols-[110px_340px_1fr]">
            <aside className="hidden border-r border-black/8 bg-[#f7f7f5] p-4 text-xs text-black/55 lg:block"><p className="mb-5 font-semibold text-black">Views</p><p className="mb-3">▣ &nbsp; Trips <span className="float-right">8</span></p><p className="mb-3">♙ &nbsp; Requests <span className="float-right">12</span></p><p className="mb-3">◷ &nbsp; Taken <span className="float-right">5</span></p><p>✓ &nbsp; Done</p><p className="mb-3 mt-8 font-semibold text-black">Routes</p><p className="mb-3"># Manila</p><p># Cebu</p></aside>
            <div className="border-b border-black/8 lg:border-b-0 lg:border-r">
              {feedItems.map((item, index) => <div key={item.name} className={`flex items-center gap-3 border-b border-black/8 px-4 py-3.5 ${index === 0 ? "bg-black/[.035]" : ""}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${item.tone === "peach" ? "bg-[#f1d8ce]" : item.tone === "green" ? "bg-[#cfe2d1]" : item.tone === "blue" ? "bg-[#d0e5ec]" : item.tone === "sand" ? "bg-[#e6ddc9]" : "bg-[#f0d7d4]"}`}>{item.initials}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.name}</p><p className="truncate text-xs text-black/45">{item.item}</p></div><span className="rounded-md border border-black/10 px-2 py-1 text-[10px] font-semibold text-black/55">{item.status}</span></div>)}
            </div>
            <div className="hidden p-5 sm:block"><div className="flex items-start justify-between border-b border-black/8 pb-4"><div><p className="text-xs text-black/45">Request</p><h3 className="mt-1 text-xl font-semibold">Camera lens for Cebu</h3><p className="mt-2 text-sm text-black/45">Est. ₱2,500 · Deliver to Mandaue, Cebu</p></div><span className="rounded-md bg-[#fff0e7] px-2 py-1 text-xs font-semibold text-[#d95700]">Matched</span></div><p className="mt-5 text-xs font-semibold text-black/45">Trips on this route</p>{routeMatches.map(([route, details, status]) => <div key={`${route}-${details}`} className="flex items-center justify-between border-b border-black/8 py-3"><div><p className="text-sm font-semibold">{route}</p><p className="text-xs text-black/45">{details}</p></div><span className="rounded-md border border-black/10 px-2 py-1 text-[10px] font-semibold text-black/50">{status}</span></div>)}</div>
          </div>
        </div>
      </section>

      <section className="bg-[#f1f0ec]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-32">
          <div><SectionLabel>A clearer handoff</SectionLabel><h2 className="max-w-[540px] text-4xl font-medium leading-[1.05] tracking-[-0.05em] sm:text-6xl">Match by route. <span className="text-black/40">Both sides see capacity, dates and the item before either commits.</span></h2><p className="mt-8 max-w-[470px] text-lg leading-8 text-black/60">Open a request and the trips on that route line up beside it. Take one and the item, kilos and dates travel with the match.</p><ul className="mt-8 max-w-[460px] divide-y divide-black/10 border-y border-black/10 text-sm font-semibold">{["Kilos free on every trip", "Dates on both sides", "Estimated price before you take it"].map((item) => <li key={item} className="flex items-center gap-3 py-4"><Check size={17} className="text-[#ff6500]" />{item}</li>)}</ul></div>
          <div className="relative min-h-[500px] overflow-hidden rounded-xl border border-black/10 bg-[#e5e9e1] p-6 sm:p-10"><div className="absolute inset-y-0 right-[10%] w-20 bg-[#ffb487]/45 blur-2xl" /><div className="relative mx-auto mt-8 max-w-[330px] rounded-xl border border-black/10 bg-white p-5 shadow-xl"><div className="flex items-center justify-between border-b border-black/8 pb-4 text-sm font-semibold"><span>Matches on this route</span><span className="rounded-md bg-[#fff0e7] px-2 py-1 text-[10px] text-[#d95700]">6 new</span></div><p className="py-4 text-xs text-black/45">Manila → Cebu · Sat 22 Nov</p>{["Request · Camera lens", "Trip · Miguel S.", "Request · Running shoes", "Trip · Rico M."].map((item, index) => <div key={item} className="flex items-center justify-between border-t border-black/8 py-4 text-xs"><span><span className="block font-semibold">{item}</span><span className="mt-1 block text-black/45">{index % 2 ? "14 kg free · lands 8:40" : "Est. ₱2,500 · Mandaue"}</span></span><span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${index === 3 ? "bg-black/8" : "border border-black/10 text-black/45"}`}>{index === 3 ? "Taken" : "Open"}</span></div>)}</div></div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#fff0e7]">
        <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32"><h2 className="text-4xl font-medium tracking-[-0.05em] sm:text-6xl">Three steps to a match.</h2><div className="mt-12 grid gap-5 lg:grid-cols-3">{[["1", "Post your trip", "Add the route, your dates and how many kilos are free.", "Route", "Manila → Cebu", "14 kg free"], ["2", "Post your request", "Name the item, the price you expect and where it goes.", "Item", "Camera lens", "₱2,500"], ["3", "Take the match", "Open the trip beside your request and confirm the kilos.", "Match found", "Camera lens", "8 of 14 kg"]].map(([number, title, copy, label, value, meta]) => <article key={number} className="overflow-hidden rounded-xl border border-black/8 bg-white p-7"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 text-sm font-semibold">{number}</span><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-black/60">{copy}</p><div className="mt-7 flex min-h-56 items-end rounded-lg bg-[#c4d7bd] p-5"><div className="w-full max-w-[220px] rounded-xl border border-black/10 bg-white p-4 shadow-lg"><p className="text-xs font-semibold">{label}</p><div className="mt-4 flex items-center justify-between border-t border-black/8 pt-3 text-xs"><span className="text-black/50">{value}</span><span className="font-semibold">{meta}</span></div><div className="mt-4 h-7 rounded-md bg-[#191a17] text-center text-[10px] leading-7 text-white">{title}</div></div></div></article>)}</div></div>
      </section>

      <section id="questions" className="bg-[#e5ecdf]">
        <div className="mx-auto grid max-w-[1200px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-32"><div><SectionLabel>Before signing up</SectionLabel><h2 className="text-5xl font-medium tracking-[-0.06em] sm:text-7xl">Questions.</h2><Link to="/register" className="mt-10 inline-flex items-center gap-2 border-b border-black/25 pb-1 text-sm font-semibold hover:border-[#ff6500] hover:text-[#ff6500]">Create an account <ArrowRight size={15} /></Link></div><div>{faqs.map(([question, answer]) => <details key={question} className="group border-b border-black/10 py-5 first:border-t"><summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium"><span>{question}</span><span className="text-2xl font-light transition-transform group-open:rotate-45">+</span></summary><p className="max-w-[600px] pt-3 text-sm leading-6 text-black/60">{answer}</p></details>)}</div></div>
      </section>

      <footer className="bg-[#d5dfd0]">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24"><div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-start"><h2 className="max-w-[650px] text-6xl font-medium tracking-[-0.08em] sm:text-8xl lg:text-9xl">Pasabuy</h2><Link to="/register"><ArrowButton>Create an account</ArrowButton></Link></div><div className="mt-20 grid gap-8 border-t border-black/15 pt-7 sm:grid-cols-3"><p className="text-sm">A marketplace for travelers and buyers.</p><div className="text-sm text-black/60"><p className="font-semibold text-black">Explore</p><a href="#product" className="mt-3 block hover:text-black">The feed</a><a href="#how-it-works" className="mt-2 block hover:text-black">How it works</a><a href="#questions" className="mt-2 block hover:text-black">Questions</a></div><div className="text-sm text-black/60"><p className="font-semibold text-black">Account</p><Link to="/login" className="mt-3 block hover:text-black">Sign in</Link><Link to="/register" className="mt-2 block hover:text-black">Create an account</Link></div></div><div className="mt-12 border-t border-black/15 pt-5 text-xs text-black/55">© 2026 Pasabuy</div></div>
      </footer>
    </main>
  );
}
