import Link from "next/link";
import {
  Building2,
  CircleCheck,
  ClipboardList,
  DraftingCompass,
  Recycle,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brown-50 to-brown-100">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-brown-800 bg-opacity-95 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brown-700 rounded-lg flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <span
                className={`font-bold text-lg transition-colors ${
                  isScrolled ? "text-white" : "text-brown-900"
                }`}
              >
                ArchitectAI
              </span>
            </div>
            <Link
              href="/chat"
              className="px-6 py-2 bg-brown-600 hover:bg-brown-700 text-white rounded-lg font-semibold transition-colors"
            >
              Start Chat
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-brown-600 to-brown-800 rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-900 mb-6 leading-tight">
            Your AI Consultant <span className="text-brown-700">Architect</span>
          </h1>

          <p className="text-lg sm:text-xl text-brown-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get expert architectural guidance, design recommendations, and
            planning insights powered by artificial intelligence. Available
            24/7 to help with your architectural projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/chat"
              className="px-8 py-4 bg-brown-700 hover:bg-brown-800 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Start Consulting Now
            </Link>
            <Link
              href="/learn-more"
              className="px-8 py-4 border-2 border-brown-700 text-brown-700 hover:bg-brown-50 rounded-xl font-semibold text-lg transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <DraftingCompass
                className="w-8 h-8 text-brown-700 mb-3 mx-auto"
                aria-hidden="true"
              />
              <h3 className="font-bold text-brown-900 mb-2">Design Expert</h3>
              <p className="text-sm text-brown-700">
                Get guidance on architectural styles and design principles
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <ClipboardList
                className="w-8 h-8 text-brown-700 mb-3 mx-auto"
                aria-hidden="true"
              />
              <h3 className="font-bold text-brown-900 mb-2">
                Project Planning
              </h3>
              <p className="text-sm text-brown-700">
                Plan your projects with professional architectural strategies
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <Recycle
                className="w-8 h-8 text-brown-700 mb-3 mx-auto"
                aria-hidden="true"
              />
              <h3 className="font-bold text-brown-900 mb-2">Sustainable</h3>
              <p className="text-sm text-brown-700">
                Learn about eco-friendly and sustainable architectural practices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-brown-900 mb-12">
            Why Choose Our Consultant?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-brown-700 rounded-lg flex items-center justify-center text-white font-bold">
                  <CircleCheck className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brown-900 mb-2">
                  Instant Response
                </h3>
                <p className="text-brown-700">
                  Get immediate architectural advice without waiting for
                  consultants
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-brown-700 rounded-lg flex items-center justify-center text-white font-bold">
                  <CircleCheck className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brown-900 mb-2">
                  24/7 Available
                </h3>
                <p className="text-brown-700">
                  Access expert guidance anytime, anywhere you need it
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-brown-700 rounded-lg flex items-center justify-center text-white font-bold">
                  <CircleCheck className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brown-900 mb-2">
                  Expert Knowledge
                </h3>
                <p className="text-brown-700">
                  Trained on architectural best practices and principles
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-brown-700 rounded-lg flex items-center justify-center text-white font-bold">
                  <CircleCheck className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brown-900 mb-2">
                  Privacy First
                </h3>
                <p className="text-brown-700">
                  Your conversations are private and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brown-700 to-brown-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to consult with your AI Architect?
          </h2>
          <p className="text-lg text-brown-100 mb-8">
            Start a conversation now and get instant architectural insights
          </p>
          <Link
            href="/chat"
            className="inline-block px-8 py-4 bg-white text-brown-800 rounded-xl font-semibold text-lg hover:bg-brown-50 transition-colors"
          >
            Start Chatting
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brown-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-brown-300 text-sm">
                <li>
                  <a href="/chat" className="hover:text-white transition">
                    Chat
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-brown-300 text-sm">
                <li>
                  <a href="/learn-more" className="hover:text-white transition">
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-brown-300 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-brown-300 text-sm">
                <li>Email: info@architectai.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-brown-800 pt-8 text-center text-brown-400 text-sm">
            <p>
              &copy; 2026 ArchitectAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
