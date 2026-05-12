"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import * as Babel from "@babel/standalone";

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
  }

  function handleTestResult(result: { pass: boolean; message: string }) {
    setTestResult(result);
    if (result.pass) {
      onMarkComplete();
    }
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Middle Column: Concept & Example */}
      <div className="w-1/2 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans leading-tight">
            Topic: React Bolt - <br/> Lesson {lesson.id}: {lesson.title.split(':')[0]}
          </h2>

          <div
            className="prose prose-blue max-w-none text-gray-800 text-[15px] leading-relaxed mb-8"
            dangerouslySetInnerHTML={{ __html: lesson.concept }}
          />

          <div className="bg-gray-100 rounded-lg p-5 border border-gray-200 shadow-inner">
            <div className="text-sm text-gray-600 mb-2 font-semibold">Example:</div>
            <CodeMirror
              value={lesson.exampleCode}
              extensions={[javascript({ jsx: true })]}
              editable={false}
              theme="light"
              className="mb-4 bg-transparent text-sm"
            />
            <div className="bg-white p-4 rounded border border-gray-300">
              <Preview code={lesson.exampleCode} componentName="Example" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Exercise, Code Editor, Result */}
      <div className="w-1/2 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto">
        <div className="p-8 flex flex-col h-full">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Exercise {lesson.id}: {lesson.title.split(':')[1]?.trim() || "Practice"}
          </h3>
          <div
            className="prose prose-blue max-w-none text-gray-800 text-[15px] mb-6"
            dangerouslySetInnerHTML={{ __html: lesson.exerciseDescription }}
          />

          <div className="flex-1 min-h-[300px] border border-gray-800 rounded-t-lg overflow-hidden bg-[#1e1e1e] shadow-inner mb-0">
            <CodeMirror
              value={draft}
              extensions={[javascript({ jsx: true })]}
              onChange={(val) => setDraft(val)}
              theme="dark"
              height="100%"
              className="h-full text-sm font-mono"
            />
          </div>

          <div className="flex gap-3 mt-4 mb-6">
            <button
              onClick={handleRun}
              className="flex items-center gap-2 bg-[#0f4a8a] hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
              Run Code
            </button>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-6 rounded transition-colors shadow-sm"
            >
              Get Hint
            </button>
          </div>

          {error && (
            <pre className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6 overflow-x-auto text-sm font-mono">
              {error}
            </pre>
          )}

          <div className="bg-[#f8f9fa] p-6 rounded-lg border border-gray-200">
            <div className="font-bold text-xl text-gray-900 mb-4">Result:</div>
            
            <div className="bg-white p-4 rounded border border-gray-300 shadow-sm min-h-[80px] mb-4">
              <Preview
                code={runCode}
                componentName="Exercise"
                onError={setError}
                testFn={lesson.test}
                onTestResult={handleTestResult}
              />
            </div>

            {testResult && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  {testResult.pass ? (
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                  )}
                  <span className="text-lg text-gray-800 font-semibold">{testResult.message}</span>
                </div>
                {testResult.pass && onNextLesson && (
                  <button
                    onClick={onNextLesson}
                    className="bg-[#0f4a8a] hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded transition-colors shadow-sm whitespace-nowrap"
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
                  extensions={[javascript({ jsx: true })]}
                  editable={false}
                  theme="light"
                  className="text-sm border border-gray-200 rounded"
                />
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
            <button 
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
    </div>
  );
}

function Preview({
  code,
  componentName,
  onError,
  testFn,
  onTestResult,
}: {
  code: string;
  componentName: string;
  onError?: (err: string | null) => void;
  testFn?: (container: HTMLElement) => Promise<{ pass: boolean; message: string }>;
  onTestResult?: (res: { pass: boolean; message: string }) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // 1. Transform code
      const transformed = Babel.transform(code, {
        presets: ["react"],
      }).code;

      // 2. Wrap in function
      const wrapper = new Function(
        "React",
        "useState",
        "useEffect",
        "useRef",
        transformed + "; return " + componentName + ";"
      );
      
      const Component = wrapper(React, React.useState, React.useEffect, React.useRef);

      if (!Component) {
        if (onError) onError("Component " + componentName + " not found.");
        return;
      }

      // 3. Render
      if (!rootRef.current) {
        rootRef.current = ReactDOM.createRoot(containerRef.current);
      }
      rootRef.current.render(React.createElement(Component));
      if (onError) onError(null);

      // 4. Run tests
      if (testFn && onTestResult) {
        setTimeout(async () => {
          try {
            const result = await testFn(containerRef.current!);
            onTestResult(result);
          } catch (e: any) {
            onTestResult({ pass: false, message: "Test error: " + e.message });
          }
        }, 50);
      }
    } catch (err: any) {
      if (onError) onError(err.message);
    }
  }, [code, componentName, testFn, onError, onTestResult]);

  useEffect(() => {
    return () => {
      if (rootRef.current) {
        setTimeout(() => {
          rootRef.current?.unmount();
        }, 0);
      }
    };
  }, []);

  return <div ref={containerRef} />;
}
