"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import LessonBuilder from "@/components/LessonBuilder";

export default function TopicLessonsPage() {
  const { id } = useParams() as { id: string };
  const [topic, setTopic] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingTopic, setLoadingTopic] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch Topic details
    fetch(`/api/courses`)
      .then(res => res.json())
      .then(topics => {
        const t = topics.find((x: any) => x.id === id);
        setTopic(t);
        setLoadingTopic(false);
      });

    // Fetch existing lessons
    fetch(`/api/courses/${id}/lessons`)
      .then(res => res.json())
      .then(data => setLessons(data));
  }, [id]);

  const handleSaveLesson = async (lessonData: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/${id}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });

      if (!res.ok) throw new Error("Failed to save lesson");

      const newLesson = await res.json();
      setLessons([...lessons, newLesson]);
      // Reset builder logic would happen here or just show success
      alert("Lesson saved successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingTopic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fa] pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link href="/create-course" className="hover:text-blue-600 transition-colors">Courses</Link>
              <span>/</span>
              <span className="font-medium text-gray-900">{topic?.name}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading">Course Builder</h1>
          </div>
          <Link 
            href={`/tech/${topic?.slug}`} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-sm"
          >
            View Live Course
          </Link>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Main Column: Lesson Builder */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Add New Lesson</h2>
              <p className="text-gray-500 text-sm">Fill in the details below to create a new interactive step.</p>
            </div>
            <LessonBuilder onSave={handleSaveLesson} loading={saving} />
          </div>

          {/* Sidebar: Lessons List */}
          <div className="w-full xl:w-80 shrink-0">
            <div className="sticky top-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200 font-bold text-gray-900">
                Lessons in Course ({lessons.length})
              </div>
              <div className="p-2 space-y-1">
                {lessons.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-400 italic">
                    No lessons created yet.
                  </div>
                ) : (
                  lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="p-3 rounded-lg border border-transparent hover:bg-blue-50 hover:border-blue-100 transition-all flex items-center gap-3 group">
                      <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 truncate">{lesson.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
