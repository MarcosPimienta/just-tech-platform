"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateCoursePage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [engine, setEngine] = useState("REACT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-generate slug
    setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description, engine }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create course");
      }

      const topic = await res.json();
      router.push(`/create-course/${topic.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-heading">Create New Course</h1>
          <p className="mt-2 text-gray-500">Define the core identity of your learning path.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Course Title</label>
            <input
              type="text"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm"
              placeholder="e.g. Advanced React Hooks"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                /tech/
              </span>
              <input
                type="text"
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm"
                placeholder="advanced-react-hooks"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400 italic text-right">This will be the unique identifier in the URL.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Execution Engine</label>
            <select
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm bg-white"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
            >
              <option value="REACT">React Preview (Babel)</option>
              <option value="PYTHON">Python Interpreter (WASM)</option>
              <option value="TERMINAL">Linux Terminal (xterm.js)</option>
            </select>
            <p className="mt-1 text-xs text-gray-400 italic">Select the environment students will use to complete exercises.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
            <textarea
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm"
              rows={3}
              placeholder="What will students learn in this course?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="pt-4 flex items-center justify-between gap-4">
            <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-700">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0f4a8a] hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Creating..." : "Continue to Lesson Builder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
