"use client";

import { useState } from "react";
import type { CalibrationEntry } from "../types";

interface ExportPanelProps {
  entries: CalibrationEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

function formatEntry(e: CalibrationEntry): string {
  return `{
  characterName: "${e.name}",
  centerX: ${e.centerX.toFixed(4)},
  centerY: ${e.centerY.toFixed(4)},
  radius: ${e.radius.toFixed(4)},
}`;
}

function formatArray(entries: CalibrationEntry[]): string {
  return `[\n${entries.map((e) => "  " + formatEntry(e).replace(/\n/g, "\n  ")).join(",\n")}\n]`;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
      style={{
        backgroundColor: copied ? "rgba(16,185,129,0.15)" : "#1f2937",
        color: copied ? "#34d399" : "#9ca3af",
        border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "#374151"}`,
      }}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

const ENTRY_COLORS = [
  "#ef4444", "#3b82f6", "#22c55e", "#f59e0b",
  "#a855f7", "#ec4899", "#14b8a6", "#f97316",
];

export function ExportPanel({ entries, onRemove, onClear }: ExportPanelProps) {
  if (entries.length === 0) {
    return (
      <div
        className="rounded-xl p-5 text-center"
        style={{ backgroundColor: "#111827", border: "1px solid #1f2937" }}
      >
        <p className="text-sm" style={{ color: "#4b5563" }}>
          No characters calibrated yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Individual entries */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid #1f2937" }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: "#111827", borderBottom: "1px solid #1f2937" }}
        >
          <h3 className="font-semibold text-white text-sm">
            Saved Characters ({entries.length})
          </h3>
          <button
            onClick={onClear}
            className="text-xs transition-colors"
            style={{ color: "#6b7280" }}
          >
            Clear all
          </button>
        </div>

        <div style={{ backgroundColor: "#0f172a" }}>
          {entries.map((entry, i) => {
            const color = ENTRY_COLORS[i % ENTRY_COLORS.length];
            return (
              <div
                key={entry.id}
                className="flex items-start gap-3 px-4 py-3"
                style={{ borderBottom: i < entries.length - 1 ? "1px solid #1f2937" : "none" }}
              >
                {/* Color swatch */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: color }}
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white mb-1">
                    {entry.name}
                  </p>
                  <pre
                    className="text-xs leading-relaxed"
                    style={{ color: "#9ca3af", fontFamily: "monospace" }}
                  >
{`centerX: ${entry.centerX.toFixed(4)}
centerY: ${entry.centerY.toFixed(4)}
radius:  ${entry.radius.toFixed(4)}`}
                  </pre>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <CopyButton text={formatEntry(entry)} label="Copy" />
                  <button
                    onClick={() => onRemove(entry.id)}
                    className="w-6 h-6 flex items-center justify-center rounded transition-colors"
                    style={{ color: "#6b7280" }}
                    aria-label={`Remove ${entry.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full array export */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid #1f2937" }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: "#111827", borderBottom: "1px solid #1f2937" }}
        >
          <h3 className="font-semibold text-white text-sm">
            Seed Array — paste into{" "}
            <code
              className="px-1.5 py-0.5 rounded text-xs"
              style={{ backgroundColor: "#1f2937", color: "#fbbf24" }}
            >
              prisma/seed.ts
            </code>
          </h3>
          <CopyButton text={formatArray(entries)} label="Copy all" />
        </div>

        <pre
          className="p-4 overflow-x-auto text-xs leading-relaxed"
          style={{
            backgroundColor: "#030712",
            color: "#a5f3fc",
            fontFamily: "monospace",
            maxHeight: "320px",
          }}
        >
          {formatArray(entries)}
        </pre>
      </div>
    </div>
  );
}
