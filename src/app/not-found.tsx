"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse, rgba(198,176,138,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", maxWidth: "480px", width: "100%" }}
      >
        {/* Logo */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "var(--gradient-ai)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
            boxShadow: "0 8px 32px rgba(198,176,138,0.3)",
          }}
        >
          <Building2 size={24} color="white" />
        </div>

        {/* 404 number */}
        <div
          className="font-display"
          style={{
            fontSize: "clamp(6rem, 15vw, 9rem)",
            lineHeight: 1,
            letterSpacing: "-0.05em",
            background: "var(--gradient-ai)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "16px",
          }}
        >
          404
        </div>

        <h1
          className="font-display"
          style={{ fontSize: "1.6rem", marginBottom: "12px", letterSpacing: "-0.02em" }}
        >
          Page not found
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "var(--t-secondary)",
            lineHeight: 1.6,
            marginBottom: "40px",
          }}
        >
          The blueprint for this page doesn&apos;t exist yet.
          <br />
          Let&apos;s get you back to the drawing board.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn-accent" style={{ padding: "12px 28px", fontSize: "14px" }}>
            <Home size={16} /> Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="btn-ghost"
            style={{ padding: "12px 24px", fontSize: "14px" }}
          >
            <ArrowLeft size={16} /> Open Dashboard
          </Link>
        </div>

        <p
          style={{
            marginTop: "48px",
            fontSize: "12px",
            color: "var(--t-muted)",
          }}
        >
          Architectural AI &mdash; Construction Intelligence Platform
        </p>
      </motion.div>
    </div>
  );
}
