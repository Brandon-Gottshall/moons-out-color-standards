"use client";

import { useState } from "react";
import { ChevronDown, Shield, Lock, Eye, EyeOff } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Login page — self-contained, no AppShell chrome                    */
/* ------------------------------------------------------------------ */

export default function LoginPage() {
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div
      className="min-h-dvh flex items-center justify-center p-4"
      style={{ background: "oklch(0.14 0.04 155)" }}
    >
      <div className="w-full max-w-sm animate-scale-in">
        {/* Card */}
        <div
          className="flex flex-col items-center gap-6 rounded-xl border p-8"
          style={{
            background: "oklch(0.18 0.04 155)",
            borderColor: "oklch(0.62 0.1 70 / 0.2)",
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <img
              src="/fleet-ops-logo.svg"
              alt="Fleet Ops Console"
              className="h-16 w-16"
            />
            <div className="text-center">
              <h1
                className="text-lg font-semibold tracking-tight"
                style={{ color: "oklch(0.92 0.02 90)" }}
              >
                Fleet Ops Console
              </h1>
              <p
                className="text-sm mt-0.5"
                style={{ color: "oklch(0.55 0 0)" }}
              >
                Unified workspace for fleet operations
              </p>
            </div>
          </div>

          {/* Google SSO */}
          <button
            className="flex w-full items-center justify-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:scale-[1.01]"
            style={{
              background: "oklch(0.62 0.1 70 / 0.15)",
              border: "1px solid oklch(0.62 0.1 70 / 0.35)",
              color: "oklch(0.62 0.1 70)",
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex w-full items-center gap-3">
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(1 0 0 / 0.08)" }}
            />
            <span
              className="text-[11px] uppercase tracking-wider"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(1 0 0 / 0.08)" }}
            />
          </div>

          {/* Emergency access */}
          <div className="w-full">
            <button
              onClick={() => setEmergencyOpen((p) => !p)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors"
              style={{
                color: "oklch(0.55 0 0)",
                background: emergencyOpen ? "oklch(1 0 0 / 0.03)" : "transparent",
              }}
            >
              <span className="flex items-center gap-2">
                <Shield size={14} />
                Emergency Access
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform ${emergencyOpen ? "rotate-180" : ""}`}
              />
            </button>

            {emergencyOpen && (
              <div className="mt-2 flex flex-col gap-3 animate-slide-up">
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "oklch(0.55 0 0)" }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Emergency passphrase"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg py-2.5 pl-9 pr-10 text-sm transition-colors focus:outline-none"
                    style={{
                      background: "oklch(0.14 0.035 155)",
                      border: "1px solid oklch(1 0 0 / 0.1)",
                      color: "oklch(0.92 0.02 90)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "oklch(0.55 0 0)" }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button
                  className="w-full rounded-lg py-2 text-sm font-medium transition-colors"
                  style={{
                    background: "oklch(0.55 0.2 15 / 0.15)",
                    border: "1px solid oklch(0.55 0.2 15 / 0.3)",
                    color: "oklch(0.55 0.2 15)",
                  }}
                >
                  Access Console
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security footer */}
        <p
          className="mt-4 text-center text-[11px] leading-relaxed"
          style={{ color: "oklch(0.55 0 0 / 0.6)" }}
        >
          <Lock
            size={10}
            className="inline mr-1 align-text-bottom"
            style={{ color: "oklch(0.55 0 0 / 0.4)" }}
          />
          Encrypted end-to-end. Sessions expire after 24 hours of inactivity.
          <br />
          Access logs are retained for 90 days.
        </p>
      </div>
    </div>
  );
}
