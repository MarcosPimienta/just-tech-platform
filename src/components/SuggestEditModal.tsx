"use client";

import React, { useState } from "react";
import LessonBuilder from "./LessonBuilder";

export default function SuggestEditModal({ lesson, onClose }: { lesson: any, onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const handlePropose = async (data: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          proposedChanges: data,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit proposal");

      alert("Thank you! Your suggestion has been submitted for review.");
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-heading">Suggest Edits</h2>
            <p className="text-sm text-gray-500">Propose changes to improve this lesson.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8">
          <LessonBuilder 
            initialData={lesson} 
            onSave={handlePropose} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
}
