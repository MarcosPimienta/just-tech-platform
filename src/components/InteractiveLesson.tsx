"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans leading-tight">
            Topic: React Bolt - <br/> Lesson {lesson.id}: {lesson.title.split(':')[0]}
          </h2>

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
              <Preview code={lesson.exampleCode} componentName="Example" />
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

            <div className="border border-gray-800 rounded-t-lg overflow-hidden shadow-inner">
              <CodeMirror
                value={draft}
                extensions={[javascript({ jsx: true })]}
                onChange={(val) => setDraft(val)}
                theme="dark"
                className="text-sm font-mono"
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
              <Preview
                code={runCode}
                componentName="Exercise"
                onError={setError}
                testFn={lesson.test}
                onTestResult={handleTestResult}
              />
            </div>

            {testResult && (
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
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
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a fresh DOM node for the root to avoid strict mode collisions
    const wrapperNode = document.createElement("div");
    containerRef.current.appendChild(wrapperNode);
    wrapperRef.current = wrapperNode;
    
    const root = ReactDOM.createRoot(wrapperNode);
    rootRef.current = root;

    return () => {
      const currentRoot = root;
      const currentWrapper = wrapperNode;
      setTimeout(() => {
        currentRoot.unmount();
        currentWrapper.remove();
      }, 0);
    };
  }, []);

  useEffect(() => {
    if (!wrapperRef.current || !rootRef.current) return;

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
      rootRef.current.render(React.createElement(Component));
      if (onError) onError(null);

      // 4. Run tests
      if (testFn && onTestResult) {
        setTimeout(async () => {
          try {
            // Pass the wrapper node where the component actually mounted
            const result = await testFn(wrapperRef.current!);
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

  return <div ref={containerRef} />;
}
