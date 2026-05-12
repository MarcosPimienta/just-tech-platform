"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proposals");
      if (!res.ok) throw new Error("Failed to fetch proposals");
      const data = await res.json();
      setProposals(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update proposal");

      setSelectedProposal(null);
      fetchProposals();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading proposals...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading">Review Proposals</h1>
            <p className="text-gray-500">Manage community suggestions for course improvements.</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900">Back to Home</Link>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Section */}
          <div className="lg:col-span-1 space-y-4">
            {proposals.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 italic">
                No proposals found.
              </div>
            ) : (
              proposals.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedProposal(p)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    selectedProposal?.id === p.id 
                      ? "bg-blue-50 border-blue-600 shadow-md ring-1 ring-blue-600" 
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      p.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      p.status === "APPROVED" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {p.status}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">{p.lesson.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{p.lesson.topic.name}</p>
                  <div className="mt-3 text-xs text-gray-400">
                    By: {p.user.name || p.user.email}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Review Section */}
          <div className="lg:col-span-2">
            {selectedProposal ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden flex flex-col h-full min-h-[600px]">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Proposal Details</h2>
                  {selectedProposal.status === "PENDING" && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleAction(selectedProposal.id, "REJECTED")}
                        disabled={actionLoading}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAction(selectedProposal.id, "APPROVED")}
                        disabled={actionLoading}
                        className="bg-[#0f4a8a] text-white hover:bg-blue-800 px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-md disabled:opacity-50"
                      >
                        {actionLoading ? "Processing..." : "Approve & Apply"}
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="p-8 space-y-8 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <div>Current Content</div>
                    <div>Proposed Changes</div>
                  </div>

                  {(() => {
                    const changes = JSON.parse(selectedProposal.proposedChanges);
                    return Object.keys(changes).map(key => {
                      if (changes[key] === selectedProposal.lesson[key]) return null;
                      return (
                        <div key={key} className="space-y-2 pb-6 border-b border-gray-50">
                          <div className="text-xs font-bold text-blue-600">{key.toUpperCase()}</div>
                          <div className="grid grid-cols-2 gap-8">
                            <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 font-mono whitespace-pre-wrap border border-gray-100 italic">
                              {selectedProposal.lesson[key]}
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg text-sm text-gray-900 font-mono whitespace-pre-wrap border border-blue-100 font-bold">
                              {changes[key]}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 border-dashed p-20 text-center text-gray-400 flex flex-col items-center justify-center h-full">
                <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-lg font-medium">Select a proposal to review the changes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
