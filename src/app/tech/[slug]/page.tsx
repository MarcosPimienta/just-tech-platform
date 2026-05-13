"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import InteractiveLesson from "@/components/InteractiveLesson";

export default function TechPage() {
  const { slug } = useParams();
  const [topics, setTopics] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState("Technology");

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        // 1. Fetch all topics to find the one matching the slug
        const topicsRes = await fetch("/api/courses");
        const allTopics = await topicsRes.json();
        const activeTopic = allTopics.find((t: any) => t.slug === slug);
        
        if (!activeTopic) {
          setLoading(false);
          return;
        }

        setCurrentCategory(activeTopic.category);

        // 2. Fetch all topics in the same category
        const categoryTopics = allTopics.filter((t: any) => t.category === activeTopic.category);
        
        // 3. Fetch lessons for each topic in the category
        const topicsWithLessons = await Promise.all(categoryTopics.map(async (t: any) => {
          const res = await fetch(`/api/courses/${t.id}/lessons`);
          const lessons = await res.json();
          return { ...t, lessons };
        }));

        setTopics(topicsWithLessons);
        
        // 4. Set initial active lesson (from the slug topic)
        const activeTopicWithLessons = topicsWithLessons.find(t => t.slug === slug);
        if (activeTopicWithLessons && activeTopicWithLessons.lessons.length > 0) {
          setActiveId(activeTopicWithLessons.lessons[0].id);
        }

        // 5. Fetch progress
        const progressRes = await fetch("/api/progress");
        const progressData = await progressRes.json();
        if (progressData.completed) {
          setCompleted(new Set(progressData.completed));
        }
      } catch (err) {
        console.error("Failed to load curriculum", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const allLessons = topics.flatMap(t => t.lessons);
  const activeLesson = allLessons.find(l => l.id === activeId);
  const activeLessonIndex = allLessons.findIndex(l => l.id === activeId);

  const handleMarkComplete = useCallback(async () => {
    setCompleted((prev) => {
      if (!activeId) return prev;
      const next = new Set(prev);
      next.add(activeId);
      return next;
    });

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: activeId }),
    });
  }, [activeId]);

  const handleNextLesson = useCallback(() => {
    if (activeLessonIndex < allLessons.length - 1 && allLessons[activeLessonIndex + 1]) {
      setActiveId(allLessons[activeLessonIndex + 1].id);
    }
  }, [activeLessonIndex, allLessons]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!activeLesson) return null;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#f8f9fa] text-gray-900 font-sans relative">
      <aside className="w-[300px] bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] sticky top-16 overflow-y-auto shadow-sm z-10">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-[#0f4a8a] uppercase tracking-wide">Course Progress</span>
            <span className="text-sm font-bold text-gray-800">{Math.round((completed.size / allLessons.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0f4a8a] transition-all duration-500 ease-out shadow-[0_0_8px_rgba(15,74,138,0.4)]" 
              style={{ width: `${(completed.size / allLessons.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-6">
          <div>
            <div className="flex items-center gap-2 px-2 py-1 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#0f4a8a]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Technology</h3>
                <p className="text-sm font-bold text-gray-900 leading-none mt-0.5">{currentCategory}</p>
              </div>
            </div>

            <div className="space-y-4">
              {topics.map((topic) => (
                <div key={topic.id} className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1 text-xs font-bold text-[#0f4a8a] uppercase tracking-wider bg-blue-50/50 rounded-md mb-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    {topic.name}
                  </div>
                  
                  <div className="space-y-1 ml-1 border-l-2 border-gray-100">
                    {topic.lessons.map((l: any) => {
                      const isActive = l.id === activeId;
                      const isCompleted = completed.has(l.id);
                      
                      return (
                        <button
                          key={l.id}
                          suppressHydrationWarning
                          onClick={() => setActiveId(l.id)}
                          className={`w-full flex items-center text-left pl-4 pr-3 py-2 transition-all text-sm group relative ${
                            isActive
                              ? "text-[#0f4a8a] font-bold"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {isActive && (
                            <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-[#0f4a8a] shadow-[0_0_8px_rgba(15,74,138,0.6)]"></div>
                          )}
                          <span className="mr-3 flex-shrink-0">
                            {isCompleted ? (
                              <svg className="w-4 h-4 text-green-500 animate-in fade-in zoom-in duration-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            ) : isActive ? (
                              <div className="w-4 h-4 rounded-full border-2 border-[#0f4a8a] flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#0f4a8a] animate-pulse"></div>
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-gray-400"></div>
                            )}
                          </span>
                          <span className="truncate">{l.title.includes(':') ? l.title.split(':')[1].trim() : l.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <InteractiveLesson
          key={activeLesson.id}
          lesson={activeLesson}
          onMarkComplete={handleMarkComplete}
          onNextLesson={activeLessonIndex < allLessons.length - 1 ? handleNextLesson : undefined}
        />
      </main>
    </div>
  );
}
