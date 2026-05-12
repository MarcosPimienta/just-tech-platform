"use client";

import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

interface LessonData {
  title: string;
  concept: string;
  exampleCode: string;
  exerciseDescription: string;
  starterCode: string;
  solution: string;
  test: string;
}

interface LessonBuilderProps {
  onSave: (data: LessonData) => Promise<void>;
  initialData?: LessonData;
  loading?: boolean;
}

export default function LessonBuilder({ onSave, initialData, loading }: LessonBuilderProps) {
  const [data, setData] = useState<LessonData>(initialData || {
    title: "",
    concept: "",
    exampleCode: "",
    exerciseDescription: "",
    starterCode: "",
    solution: "",
    test: "async (Exercise) => {\n  // return { pass: true, message: 'Great job!' };\n}",
  });

  const updateField = (field: keyof LessonData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Editor Form */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">1. Lesson Header</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lesson Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="e.g. Introduction to useState"
                value={data.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">2. Concept & Example</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Concept Explanation (HTML allowed)</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all min-h-[150px]"
                  placeholder="Explain the theory here..."
                  value={data.concept}
                  onChange={(e) => updateField("concept", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Example Code</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <CodeMirror
                    value={data.exampleCode}
                    height="200px"
                    extensions={[javascript({ jsx: true })]}
                    theme="dark"
                    onChange={(val) => updateField("exampleCode", val)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">3. Exercise & Starter Code</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Exercise Description (HTML allowed)</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all min-h-[100px]"
                  placeholder="Tell the student what to do..."
                  value={data.exerciseDescription}
                  onChange={(e) => updateField("exerciseDescription", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Starter Code</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <CodeMirror
                    value={data.starterCode}
                    height="200px"
                    extensions={[javascript({ jsx: true })]}
                    theme="dark"
                    onChange={(val) => updateField("starterCode", val)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Logic & Save */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">4. Solution & Validation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ideal Solution</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <CodeMirror
                    value={data.solution}
                    height="200px"
                    extensions={[javascript({ jsx: true })]}
                    theme="dark"
                    onChange={(val) => updateField("solution", val)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Test Function (JS)</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <CodeMirror
                    value={data.test}
                    height="200px"
                    extensions={[javascript()]}
                    theme="dark"
                    onChange={(val) => updateField("test", val)}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400 italic">
                  Function takes the student's component as 'Exercise'. Should return {`{ pass: boolean, message: string }`}.
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-6">
            <button
              onClick={() => onSave(data)}
              disabled={loading}
              className="w-full bg-[#0f4a8a] hover:bg-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Lesson...
                </>
              ) : (
                "Save & Add Next Lesson"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
