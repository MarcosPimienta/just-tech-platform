"use client";

import React, { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom/client";
import * as Babel from "@babel/standalone";

interface ReactRunnerProps {
  code: string;
  test: string;
  onResult: (result: { pass: boolean; message: string }) => void;
}

export default function ReactRunner({ code, test, onResult }: ReactRunnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<ReactDOM.Root | null>(null);

  const runCodeInPreview = useCallback(async () => {
    if (!containerRef.current) return;

    // Clean up previous root if exists
    if (rootRef.current) {
      rootRef.current.unmount();
      rootRef.current = null;
    }

    // Clear container
    containerRef.current.innerHTML = "";
    const wrapperNode = document.createElement("div");
    containerRef.current.appendChild(wrapperNode);

    try {
      // Transpile code
      const transformed = Babel.transform(code, {
        presets: ["react", "typescript"],
        filename: "exercise.tsx",
      }).code;

      if (!transformed) throw new Error("Transformation failed");

      // Transpile test
      const transformedTest = Babel.transform(`(${test})`, {
        presets: ["typescript"],
        filename: "test.ts",
      }).code;

      // Execute code to get the component
      const module = { exports: {} as any };
      const require = (name: string) => {
        if (name === "react") return React;
        throw new Error(`Module ${name} not found`);
      };

      // Provide React hooks to the scope as well
      const execute = new Function("React", "useState", "useEffect", "useRef", "useMemo", "useCallback", "require", "module", "exports", transformed);
      execute(React, React.useState, React.useEffect, React.useRef, React.useMemo, React.useCallback, require, module, module.exports);

      let ExerciseComponent = module.exports.default || (typeof module.exports === 'function' ? module.exports : null);

      // Fallback: If nothing is exported, try to find a function named 'Exercise' or 'App' in the global scope of the execution
      if (!ExerciseComponent) {
        try {
          const fallbackExec = new Function("React", "useState", "useEffect", "useRef", "useMemo", "useCallback", "require", transformed + "; return typeof Exercise !== 'undefined' ? Exercise : (typeof App !== 'undefined' ? App : null);");
          ExerciseComponent = fallbackExec(React, React.useState, React.useEffect, React.useRef, React.useMemo, React.useCallback, require);
        } catch (e) {
          // ignore
        }
      }

      if (typeof ExerciseComponent !== "function") {
        throw new Error("Code must export a default component or define a function named 'Exercise'");
      }

      // Render the component
      rootRef.current = ReactDOM.createRoot(wrapperNode);
      rootRef.current.render(React.createElement(ExerciseComponent));

      // Run tests - pass the container node, not the component
      // Add a small delay to ensure React has rendered
      setTimeout(async () => {
        try {
          const testFn = eval(transformedTest || "");
          const result = await testFn(wrapperNode);
          onResult(result);
        } catch (testErr: any) {
          onResult({ pass: false, message: "Test Error: " + testErr.message });
        }
      }, 50);
    } catch (err: any) {
      onResult({ pass: false, message: err.message });
      if (containerRef.current) {
        containerRef.current.innerHTML = `<div class="p-4 text-red-500 font-mono text-xs whitespace-pre-wrap">${err.message}</div>`;
      }
    }
  }, [code, test, onResult]);

  useEffect(() => {
    runCodeInPreview();
    return () => {
      if (rootRef.current) {
        const root = rootRef.current;
        setTimeout(() => {
          try {
            root.unmount();
          } catch (e) {
            // ignore unmount errors if already unmounted
          }
        }, 0);
        rootRef.current = null;
      }
    };
  }, [runCodeInPreview]);

  return (
    <div className="w-full h-full bg-white relative overflow-auto">
      <div ref={containerRef} className="h-full" />
    </div>
  );
}
