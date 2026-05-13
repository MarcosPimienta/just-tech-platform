"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom/client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import * as Babel from "@babel/standalone";
import SuggestEditModal from "./SuggestEditModal";
import ReactRunner from "./runners/ReactRunner";

// Placeholders for future runners
const PythonRunner = ({ code, onResult }: any) => (
  <div className="p-4 bg-gray-900 text-white font-mono text-sm h-full rounded flex items-center justify-center">
    Python Interpreter coming soon (WASM based)
  </div>
);

const TerminalRunner = ({ code, onResult }: any) => (
  <div className="p-4 bg-black text-green-400 font-mono text-sm h-full rounded flex items-center justify-center text-center">
    $ Linux Terminal coming soon <br/> (xterm.js + WebContainer)
  </div>
);

export default function InteractiveLesson({
  lesson,
  onMarkComplete,
  onNextLesson,
}: {
  lesson: any;
  onMarkComplete: () => void;
  onNextLesson?: () => void;
}) {
  const [draft, setDraft] = useState(lesson.starterCode);
  const [runCode, setRunCode] = useState(lesson.starterCode);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ pass: boolean; message: string } | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  useEffect(() => {
    setDraft(lesson.starterCode);
    setRunCode(lesson.starterCode);
    setError(null);
    setTestResult(null);
    setShowSolution(false);
  }, [lesson.id, lesson.starterCode]);

  function handleRun() {
    setRunCode(draft);
    setTestResult(null);
    setError(null);
  }

  const handleTestResult = useCallback((result: { pass: boolean; message: string }) => {
    setTestResult(result);
    if (result.pass) {
      onMarkComplete();
    }
  }, [onMarkComplete]);

  return (
    <div className="flex gap-6 h-full">
      {/* Middle Column: Concept, Example & Exercise Editor */}
      <div className="w-3/5 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-sans leading-tight">
              Topic: React Bolt - <br/> Lesson {lesson?.id || "?"}: {lesson?.title?.split(':')[0] || "Untitiled"}
            </h2>
            <button
              onClick={() => setShowSuggestModal(true)}
              suppressHydrationWarning
              className="text-xs font-bold text-[#0f4a8a] border border-[#0f4a8a] px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Suggest Edit
            </button>
          </div>

          <div
            className="prose prose-blue max-w-none text-gray-800 text-[15px] leading-relaxed mb-8"
            dangerouslySetInnerHTML={{ __html: lesson.concept }}
          />

          <div className="bg-gray-100 rounded-lg p-5 border border-gray-200 shadow-inner mb-8">
            <div className="text-sm text-gray-600 mb-2 font-semibold">Example:</div>
            <CodeMirror
              value={lesson.exampleCode}
              extensions={[javascript({ jsx: true })]}
              editable={false}
              theme="light"
              className="mb-4 bg-transparent text-sm"
            />
            <div className="bg-white p-4 rounded border border-gray-300">
              {(() => {
                const engine = lesson.topic?.engine || "REACT";
                if (engine === "REACT") {
                  return <ReactRunner code={lesson.exampleCode} test="() => ({ pass: true })" onResult={() => {}} />;
                }
                if (engine === "PYTHON") {
                  return <PythonRunner code={lesson.exampleCode} onResult={() => {}} />;
                }
                if (engine === "TERMINAL") {
                  return <TerminalRunner code={lesson.exampleCode} onResult={() => {}} />;
                }
                return <div>Unsupported Engine: {engine}</div>;
              })()}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Exercise {lesson.id}: {lesson.title.split(':')[1]?.trim() || "Practice"}
            </h3>
            <div
              className="prose prose-blue max-w-none text-gray-800 text-[15px] mb-6"
              dangerouslySetInnerHTML={{ __html: lesson.exerciseDescription }}
            />

            <div className="border border-gray-800 rounded-t-lg overflow-hidden shadow-inner bg-[#282c34]">
              <CodeMirror
                value={draft}
                extensions={lesson.topic?.engine === "REACT" ? [javascript({ jsx: true })] : []}
                onChange={(val) => setDraft(val)}
                theme="dark"
                className="text-sm font-mono"
                minHeight="200px"
              />
            </div>
            
            <div className="flex bg-gray-100 border border-t-0 border-gray-300 rounded-b-lg overflow-hidden shadow-sm">
              <button
                suppressHydrationWarning
                onClick={handleRun}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0f4a8a] hover:bg-blue-800 text-white font-semibold py-3 px-6 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                Run Code
              </button>
              <button
                suppressHydrationWarning
                onClick={() => setShowSolution(!showSolution)}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 transition-colors border-l border-gray-300"
              >
                Get Hint
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Rendering & Result */}
      <div className="w-2/5 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto">
        <div className="p-8 flex flex-col h-full">
          <div className="font-bold text-xl text-gray-900 mb-6">Execution & Result</div>

          {error && (
            <pre className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6 overflow-x-auto text-sm font-mono">
              {error}
            </pre>
          )}

          <div className="bg-[#f8f9fa] p-6 rounded-lg border border-gray-200 flex flex-col flex-1">
            <div className="font-bold text-lg text-gray-800 mb-4">Preview:</div>
            
            <div className="bg-white p-4 rounded border border-gray-300 shadow-sm min-h-[120px] mb-6 flex-1">
              {(() => {
                const engine = lesson.topic?.engine || "REACT";
                if (engine === "REACT") {
                  return (
                    <ReactRunner
                      code={runCode}
                      test={lesson.test}
                      onResult={handleTestResult}
                    />
                  );
                }
                if (engine === "PYTHON") {
                  return <PythonRunner code={runCode} onResult={handleTestResult} />;
                }
                if (engine === "TERMINAL") {
                  return <TerminalRunner code={runCode} onResult={handleTestResult} />;
                }
                return <div>Unsupported Engine: {engine}</div>;
              })()}
            </div>

            {testResult && (
              <div className={`flex items-center justify-between gap-3 p-4 rounded-lg border mt-4 ${
                testResult.pass 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-center gap-3 flex-1">
                  {testResult.pass ? (
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                  )}
                  <span className="text-sm text-gray-800 font-semibold">{testResult.message}</span>
                </div>
                {testResult.pass && onNextLesson && (
                  <button
                    onClick={onNextLesson}
                    className="bg-[#0f4a8a] hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition-colors shadow-sm whitespace-nowrap text-sm"
                  >
                    Next Lesson
                  </button>
                )}
              </div>
            )}
            
            {showSolution && (
              <div className="mt-6 pt-6 border-t border-gray-300">
                <div className="font-bold text-gray-700 mb-2">Hint / Solution:</div>
                <CodeMirror
                  value={lesson.solution}
                  extensions={lesson.topic?.engine === "REACT" ? [javascript({ jsx: true })] : []}
                  editable={false}
                  theme="light"
                  className="text-sm border border-gray-200 rounded"
                />
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
            <button 
              suppressHydrationWarning
              onClick={async () => {
                const newDesc = prompt("Propose a new exercise description:", lesson.exerciseDescription);
                if (newDesc) {
                  const res = await fetch("/api/proposals", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ lessonId: lesson.id, proposedChanges: { exerciseDescription: newDesc } }),
                  });
                  if (res.ok) alert("Proposal submitted successfully!");
                  else alert("Failed to submit proposal. Are you logged in?");
                }
              }}
              className="text-xs text-gray-400 hover:text-[#0f4a8a] underline"
            >
              Propose an edit to this lesson
            </button>
          </div>
        </div>
      </div>

      {showSuggestModal && (
        <SuggestEditModal 
          lesson={lesson} 
          onClose={() => setShowSuggestModal(false)} 
        />
      )}
    </div>
  );
}
