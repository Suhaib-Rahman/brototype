"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User, Mail, Phone, Briefcase } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

export default function ProfileStage({ onNext }: { onNext: () => void }) {
  const { customer, updateCustomer } = useChatStore();
  const [formData, setFormData] = useState({
    name: customer.name || "",
    email: customer.email || "",
    phone: customer.phone || "",
    role: customer.role || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return; 
    
    updateCustomer("name", formData.name);
    if (formData.email) updateCustomer("email", formData.email);
    if (formData.phone) updateCustomer("phone", formData.phone);
    if (formData.role) updateCustomer("role", formData.role);
    
    onNext();
  };

  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="card"
        style={{ 
          maxWidth: "480px", width: "100%", padding: "40px", 
          borderRadius: "24px", 
          background: "var(--glass)",
          backdropFilter: "blur(40px)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 className="font-display" style={{ fontSize: "2rem", marginBottom: "8px", letterSpacing: "-0.02em" }}>Create your profile</h1>
          <p style={{ color: "var(--t-secondary)", fontSize: "14px" }}>
            Let's get to know you before we start designing your space.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--t-secondary)", marginLeft: "4px" }}>Full Name</label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--t-muted)" }} />
              <input
                type="text"
                required
                className="input-field"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ paddingLeft: "42px", background: "var(--surface-1)", border: "1px solid rgba(255,255,255,0.05)" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--t-secondary)", marginLeft: "4px" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--t-muted)" }} />
              <input
                type="email"
                required
                className="input-field"
                placeholder="john@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ paddingLeft: "42px", background: "var(--surface-1)", border: "1px solid rgba(255,255,255,0.05)" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--t-secondary)", marginLeft: "4px" }}>Phone Number (Optional)</label>
            <div style={{ position: "relative" }}>
              <Phone size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--t-muted)" }} />
              <input
                type="tel"
                className="input-field"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ paddingLeft: "42px", background: "var(--surface-1)", border: "1px solid rgba(255,255,255,0.05)" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--t-secondary)", marginLeft: "4px" }}>I am a...</label>
            <div style={{ position: "relative" }}>
              <Briefcase size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--t-muted)" }} />
              <select
                className="input-field"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                style={{ paddingLeft: "42px", background: "var(--surface-1)", border: "1px solid rgba(255,255,255,0.05)", appearance: "none" }}
              >
                <option value="" disabled>Select your role</option>
                <option value="Homeowner">Homeowner</option>
                <option value="Architect">Architect / Designer</option>
                <option value="Developer">Real Estate Developer</option>
                <option value="Contractor">Builder / Contractor</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: "12px", width: "100%", padding: "14px", borderRadius: "100px" }}>
            Continue to Workspace <ArrowRight size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
