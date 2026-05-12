"use client";

import React, { useState, useEffect } from "react";
import InteractiveLesson from "@/components/InteractiveLesson";
import { LESSONS } from "@/data/reactLessons";

export default function ReactTechPage() {
  const [activeId, setActiveId] = useState(LESSONS[0].id);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const activeLessonIndex = LESSONS.findIndex((l) => l.id === activeId);
  const activeLesson = LESSONS[activeLessonIndex];

  useEffect(() => {
    fetch("/api/progress")
      .then((res) => res.json())
      .then((data) => {
        if (data.completed) {
          setCompleted(new Set(data.completed));
        }
      });
  }, []);

  async function handleMarkComplete() {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(activeId);
      return next;
    });

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: activeId }),
    });
  }

  function handleNextLesson() {
    if (activeLessonIndex < LESSONS.length - 1) {
      setActiveId(LESSONS[activeLessonIndex + 1].id);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#f8f9fa] text-gray-900 font-sans relative">
      <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] sticky top-16 overflow-y-auto shadow-sm z-10 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-[#0f4a8a] uppercase tracking-wide">My Progress:</span>
            <span className="text-sm font-bold text-gray-800">{Math.round((completed.size / LESSONS.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0f4a8a] transition-all duration-500 ease-out" 
              style={{ width: `${(completed.size / LESSONS.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-1">
          <div className="text-sm text-gray-500 mb-1 ml-2">Tech:</div>
          <div className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            Frontend Development
          </div>
          
          <div className="pl-4 border-l border-gray-200 ml-2.5">
            <div className="text-sm text-gray-500 mb-1 mt-2 ml-2">Topic:</div>
            <div className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              React Bolt
            </div>

            <div className="flex flex-col space-y-1 pl-4 border-l border-gray-200 ml-2.5 mb-4">
              {LESSONS.map((l, index) => {
                const isActive = l.id === activeId;
                const isCompleted = completed.has(l.id);
                
                return (
                  <button
                    key={l.id}
                    onClick={() => setActiveId(l.id)}
                    className={`flex items-center text-left px-3 py-2 rounded-md transition-colors text-sm ${
                      isActive
                        ? "bg-[#eef2f6] text-[#0f4a8a] font-bold border-l-2 border-[#0f4a8a] -ml-[2px]"
                        : "text-gray-600 hover:bg-gray-100 border-l-2 border-transparent -ml-[2px]"
                    }`}
                  >
                    <span className="mr-2 flex-shrink-0">
                      {isCompleted ? (
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      ) : isActive ? (
                        <svg className="w-4 h-4 text-[#0f4a8a]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path></svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      )}
                    </span>
                    <span className="truncate">Lesson {index + 1}: {l.title.split(':')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-1 ml-2 mt-4">Tech:</div>
          <div className="flex items-center gap-2 font-semibold text-gray-800 mb-2 opacity-50">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            Backend Development
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <InteractiveLesson
          key={activeLesson.id}
          lesson={activeLesson}
          onMarkComplete={handleMarkComplete}
          onNextLesson={activeLessonIndex < LESSONS.length - 1 ? handleNextLesson : undefined}
        />
      </main>
    </div>
  );
}
