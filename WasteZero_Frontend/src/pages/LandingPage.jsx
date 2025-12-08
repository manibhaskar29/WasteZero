import React from "react";
import {
  ShieldCheck,
  Trash2,
  Leaf,
  Cpu,
  GlassWater,
  FileText,
  Wrench,
  CalendarCheck,
  MapPin,
  Gauge,
  ArrowRight,
  User,
  Recycle,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function LandingPage({ onLogin }) {
  const navigate = useNavigate();

  // Header + Footer assumed to be 64px each → 128px total
  const sectionHeight = "calc(100vh - 128px)";

  const features = [
    {
      icon: (
        <CalendarCheck size={40} className="text-green-700 dark:text-green-400" />
      ),
      title: "Smart Scheduling",
      description:
        "Schedule pickups at your convenience with flexible time slots and recurring options",
    },
    {
      icon: <MapPin size={40} className="text-green-700 dark:text-green-400" />,
      title: "Agent Matching",
      description:
        "Intelligent location-based assignment connects you with the nearest available agent",
    },
    {
      icon: <Gauge size={40} className="text-green-700 dark:text-green-400" />,
      title: "Real-time Tracking",
      description:
        "Monitor your pickup status from scheduling to completion with live updates",
    },
    {
      icon: <BarChart3 size={40} className="text-green-700 dark:text-green-400" />,
      title: "Impact Dashboard",
      description:
        "Track your environmental contribution with detailed waste statistics and CO₂ savings",
    },
  ];

  const categories = [
    { icon: <Trash2 size={32} className="text-blue-500" />, title: "Plastic", desc: "Bottles, containers, packaging" },
    { icon: <Leaf size={32} className="text-green-500" />, title: "Organic", desc: "Food waste, garden clippings" },
    { icon: <Cpu size={32} className="text-purple-500" />, title: "E-Waste", desc: "Electronics, batteries, gadgets" },
    { icon: <GlassWater size={32} className="text-amber-500" />, title: "Glass", desc: "Bottles, jars, containers" },
    { icon: <FileText size={32} className="text-orange-500" />, title: "Paper", desc: "Newspapers, cardboard, documents" },
    { icon: <Wrench size={32} className="text-gray-500" />, title: "Metal", desc: "Cans, tools, scrap metal" },
  ];

  const steps = [
    {
      icon: <CalendarCheck size={48} className="text-green-700 dark:text-green-400" />,
      title: "Schedule",
      description: "Choose your pickup date, time, and waste categories",
    },
    {
      icon: <Recycle size={48} className="text-green-700 dark:text-green-400" />,
      title: "Categorize",
      description:
        "Separate waste into plastic, organic, e-waste, glass, paper, or metal",
    },
    {
      icon: <BarChart3 size={48} className="text-green-700 dark:text-green-400" />,
      title: "Track",
      description:
        "Monitor your pickup status and see your environmental impact grow",
    },
  ];

  // ✅ Handle navigation to login (or dashboard if already signed in)
  const handleGetStarted = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="h-screen w-full pt-16">
      {/* 🌍 Hero Section */}
      <section
        className="flex flex-col items-center justify-center text-center px-6 py-10 bg-green-100 dark:bg-zinc-800 snap-start transition-colors"
        style={{ minHeight: sectionHeight }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
          Transform Waste Into <br />
          <span className="text-green-700 dark:text-green-400">
            Environmental Impact
          </span>
        </h1>

        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mb-8">
          Join thousands of eco-conscious users in making waste management simple,
          efficient, and environmentally responsible with intelligent pickup scheduling.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* ✅ Navigates to login */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition"
          >
            Schedule Your First Pickup <ArrowRight size={18} />
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 border border-gray-400 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Learn More
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <ShieldCheck size={18} />
          <span>Serving 50,000+ eco-conscious users</span>
        </div>
      </section>

      {/* ♻️ Waste Categories Section */}
      <section
        className="flex items-center justify-center bg-green-100 dark:bg-zinc-800 snap-start transition-colors"
        style={{ minHeight: sectionHeight }}
      >
        <section className="py-20 transition-colors text-center px-6 min-h-screen min-w-screen">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            We Handle All Waste Types
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Comprehensive waste management across six categories for complete recycling coverage
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="bg-white dark:bg-zinc-700 rounded-2xl shadow-md hover:shadow-lg p-7 flex flex-col items-center text-center transition-all"
              >
                <div className="mb-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-xl">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {cat.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{cat.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      {/* ⚙️ How It Works Section */}
      <section
        className="flex items-center justify-center bg-green-100 dark:bg-zinc-800 snap-start transition-colors"
        style={{ minHeight: sectionHeight }}
      >
        <div className="w-full text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
            Three simple steps to responsible waste management
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10 px-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-white dark:bg-zinc-700 rounded-2xl shadow-md p-7 w-64 transition"
              >
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 Features Section */}
      <section
        className="flex items-center justify-center bg-green-100 dark:bg-zinc-800 snap-start transition-colors"
        style={{ minHeight: sectionHeight }}
      >
        <div className="w-full text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
            Everything you need for efficient and eco-friendly waste management
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-start text-left bg-white dark:bg-zinc-700 p-7 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌱 Call to Action Section */}
      <section
        className="flex flex-col items-center justify-center bg-green-100 dark:bg-zinc-800 snap-start transition-colors"
        style={{ minHeight: sectionHeight }}
      >
        <div className="flex flex-col items-center justify-center text-center min-h-screen min-w-screen px-6">
          <div className="bg-white dark:bg-zinc-700 p-12 rounded-2xl shadow-lg min-h-1/2">
            <User size={48} className="text-green-700 dark:text-green-400 mb-4 mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Join our community of eco-conscious users and start tracking your environmental impact today.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition mx-auto"
            >
              Get Started Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}