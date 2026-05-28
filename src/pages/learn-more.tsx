import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CircleCheck,
  DraftingCompass,
  Leaf,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";

const principles = [
  {
    icon: DraftingCompass,
    title: "Design Clarity",
    description:
      "We help translate early ideas into practical architectural direction, from layout thinking to style choices.",
  },
  {
    icon: MessagesSquare,
    title: "Accessible Consultation",
    description:
      "Architectural guidance should be easy to reach, especially when you are still shaping questions and options.",
  },
  {
    icon: Leaf,
    title: "Responsible Planning",
    description:
      "We encourage sustainable decisions, efficient space use, and long-term value in every recommendation.",
  },
  {
    icon: ShieldCheck,
    title: "Private By Design",
    description:
      "Your project conversations stay focused on your needs, with privacy treated as a core part of the experience.",
  },
];

const steps = [
  "Ask about your site, concept, layout, materials, budget, or planning challenge.",
  "Get structured guidance that explains tradeoffs in plain language.",
  "Use the recommendations as a stronger starting point for decisions with your design team.",
];

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-white text-brown-900">
      <header className="bg-brown-900 text-white px-4 sm:px-6 lg:px-8">
        <nav className="max-w-6xl mx-auto py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-8 h-8 bg-brown-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5" aria-hidden="true" />
            </span>
            ArchitectAI
          </Link>

          <Link
            href="/chat"
            className="px-5 py-2 bg-white text-brown-800 rounded-lg font-semibold hover:bg-brown-50 transition-colors"
          >
            Start Chat
          </Link>
        </nav>
      </header>

      <main>
        <section className="bg-gradient-to-br from-brown-900 via-brown-800 to-brown-700 text-white px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-brown-100 hover:text-white transition-colors mb-10"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to home
            </Link>

            <div className="max-w-3xl">
              <p className="text-brown-100 font-semibold mb-4">
                About ArchitectAI
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Architectural thinking, available whenever your project needs
                momentum.
              </h1>
              <p className="text-lg sm:text-xl text-brown-100 leading-relaxed">
                ArchitectAI is an AI-powered consultant built to support
                homeowners, builders, designers, and project teams with clear
                architectural guidance before, during, and after planning.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-brown-50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-5">
                Why we exist
              </h2>
              <p className="text-brown-700 leading-relaxed text-lg mb-5">
                Many architecture questions arrive before a formal consultant is
                involved: what layout works, which style fits, how to plan
                sustainably, or what should be prepared before meeting a
                professional.
              </p>
              <p className="text-brown-700 leading-relaxed text-lg">
                We make that early thinking easier. The goal is not to replace
                architects, but to help you arrive better prepared, with clearer
                questions and stronger options.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {principles.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-brown-100"
                >
                  <Icon className="w-8 h-8 text-brown-700 mb-4" aria-hidden="true" />
                  <h3 className="font-bold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-brown-700 leading-relaxed">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              How it helps your project
            </h2>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brown-700 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-brown-700 text-lg leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-brown-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <CircleCheck className="w-12 h-12 mx-auto mb-6 text-brown-100" aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-5">
              Start with one question.
            </h2>
            <p className="text-brown-100 text-lg leading-relaxed mb-8">
              Share what you are designing, renovating, or planning. ArchitectAI
              will help you organize the next step.
            </p>
            <Link
              href="/chat"
              className="inline-block px-8 py-4 bg-white text-brown-800 rounded-xl font-semibold text-lg hover:bg-brown-50 transition-colors"
            >
              Talk to ArchitectAI
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
