import React, { useState } from "react";

export default function HelpPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5173/api";
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !message) {
      setStatusMsg("Please fill in both fields.");
      return;
    }

    setLoading(true);
    setStatusMsg("");

    try {
      const res = await fetch(`${API_URL}/support/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMsg(data.error || "Failed to send message.");
      } else {
        setStatusMsg("Your message has been sent successfully!");
        setEmail("");
        setMessage("");
      }
    } catch (error) {
      console.error(error);
      setStatusMsg("Something went wrong. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 p-8 bg-green-100 dark:bg-zinc-900 transition-colors">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-green-200">Help & Support</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Get assistance and find answers</p>

      <div className="space-y-6">
        {/* FAQ Section */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h5 className="text-xl font-semibold mb-4 text-gray-800 dark:text-green-200">
            Frequently Asked Questions
          </h5>

          <details className="mb-3 border-b border-gray-200 dark:border-gray-600 pb-2">
            <summary className="font-semibold cursor-pointer text-gray-800 dark:text-green-100">
              How do I schedule a pickup?
            </summary>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Go to the Pickup Schedule section and choose your preferred slot.
            </p>
          </details>

          <details className="mb-3 border-b border-gray-200 dark:border-gray-600 pb-2">
            <summary className="font-semibold cursor-pointer text-gray-800 dark:text-green-100">
              How do I contact an agent?
            </summary>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Use the Messages section to chat with available agents.
            </p>
          </details>

          <details className="border-b border-gray-200 dark:border-gray-600 pb-2">
            <summary className="font-semibold cursor-pointer text-gray-800 dark:text-green-100">
              How do I delete my account?
            </summary>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Visit Settings → Account → Delete Account.
            </p>
          </details>
        </div>

        {/* Contact Support Section */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h5 className="text-xl font-semibold mb-4 text-gray-800 dark:text-green-200">Contact Support</h5>

          <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-zinc-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-zinc-700 border-gray-300 dark:border-gray-600"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-700 dark:bg-green-600 text-white rounded-lg hover:bg-green-800 dark:hover:bg-green-400 transition shadow-md disabled:opacity-50"
            >
              {loading ? "Sending..." : "Submit"}
            </button>

            {statusMsg && (
              <p className="text-center mt-3 text-sm text-gray-700 dark:text-gray-300">
                {statusMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
