"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function MyCoursesPage() {
  const { data: session } = useSession();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const topicsRes = await fetch("/api/courses");
        const allTopics = await topicsRes.json();
        
        // Fetch lessons for each topic to check progress
        const topicsWithLessons = await Promise.all(allTopics.map(async (t: any) => {
          const res = await fetch(`/api/courses/${t.id}/lessons`);
          const lessons = await res.json();
          return { ...t, lessons };
        }));

        // Fetch progress
        const progressRes = await fetch("/api/progress");
        const progressData = await progressRes.json();
        const completedIds = new Set(progressData.completed || []);

        // Process status
        const processed = topicsWithLessons.map(t => {
          const total = t.lessons.length;
          const done = t.lessons.filter((l: any) => completedIds.has(l.id)).length;
          return {
            ...t,
            progressPercent: total > 0 ? Math.round((done / total) * 100) : 0,
            isCompleted: total > 0 && done === total,
            isStarted: done > 0 && done < total
          };
        });

        setTopics(processed);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
    if (res.ok) setTopics(topics.filter(t => t.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const inProgress = topics.filter(t => t.isStarted);
  const completed = topics.filter(t => t.isCompleted);
  const myCreations = topics.filter(t => t.creatorId === (session?.user as any)?.id);

  const CourseCard = ({ topic, showActions = false }: { topic: any, showActions?: boolean }) => (
    <div className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#0f4a8a] group-hover:bg-[#0f4a8a] group-hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{topic.category}</span>
          <span className="text-xs font-bold text-[#0f4a8a] block">{topic.engine}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0f4a8a] transition-colors">{topic.name}</h3>
      <p className="text-gray-600 text-sm mb-6 line-clamp-2">{topic.description}</p>
      
      <div className="mt-auto">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-gray-500">Progress</span>
          <span className="text-[#0f4a8a]">{topic.progressPercent}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-[#0f4a8a] transition-all duration-500" style={{ width: `${topic.progressPercent}%` }}></div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href={`/tech/${topic.slug}`}
            className="flex-1 bg-slate-50 text-center py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-[#0f4a8a] hover:text-white transition-colors"
          >
            {topic.isCompleted ? "Review" : "Continue"}
          </Link>
          
          {showActions && (
            <>
              <Link 
                href={`/create-course/${topic.id}`}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit Course"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </Link>
              <button 
                onClick={() => handleDelete(topic.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete Course"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] relative bg-slate-50 py-12 px-6">
      <ParticlesBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
            <p className="text-gray-600">Manage your learning journey and authored content.</p>
          </div>
          <Link href="/create-course" className="bg-[#0f4a8a] text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-900/20 whitespace-nowrap">
            + Create New Course
          </Link>
        </div>

        <div className="space-y-16">
          {/* Section: In Progress */}
          {inProgress.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0f4a8a]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Currently Learning</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {inProgress.map(t => <CourseCard key={t.id} topic={t} />)}
              </div>
            </section>
          )}

          {/* Section: My Creations */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">My Creations</h2>
            </div>
            {myCreations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myCreations.map(t => <CourseCard key={t.id} topic={t} showActions />)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                <p className="text-gray-500 font-medium mb-4">You haven't authored any courses yet.</p>
                <Link href="/create-course" className="text-[#0f4a8a] font-bold hover:underline">Start Creating Now →</Link>
              </div>
            )}
          </section>

          {/* Section: Completed */}
          {completed.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Completed Courses</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {completed.map(t => <CourseCard key={t.id} topic={t} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
