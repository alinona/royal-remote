"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, Bell, Shield, Globe, Palette, 
  Database, Save, School, Mail, Phone
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { id: "general", label: "إعدادات عامة", icon: School },
  { id: "notifications", label: "التنبيهات", icon: Bell },
  { id: "security", label: "الأمان", icon: Shield },
  { id: "appearance", label: "المظهر", icon: Palette },
  { id: "data", label: "البيانات", icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("تم حفظ جميع التغييرات في الإعدادات بنجاح ✓");
    }, 1500);
  };

  return (
    <AppLayout title="الإعدادات">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-glow" 
                  : "bg-card text-ink-muted hover:bg-surface-50 hover:text-ink border border-border"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <FadeIn>
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
                <div className="text-right">
                  <h2 className="text-lg font-bold text-ink">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <p className="text-sm text-ink-muted">إدارة إعدادات النظام وتخصيص التجربة</p>
                </div>
              </div>

              <div className="space-y-6">
                {activeTab === "general" && (
                  <Stagger className="space-y-4">
                    <StaggerItem>
                      <label className="block text-sm font-medium text-ink mb-1.5 text-right">اسم المدرسة</label>
                      <input 
                        type="text" 
                        defaultValue="مدرسة منارات المستقبل النموذجية" 
                        className="input-base text-right" 
                      />
                    </StaggerItem>
                    <div className="grid grid-cols-2 gap-4">
                      <StaggerItem>
                        <label className="block text-sm font-medium text-ink mb-1.5 text-right">البريد الإلكتروني</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                          <input type="email" defaultValue="info@future-school.edu.sa" className="input-base pl-10 text-right" />
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <label className="block text-sm font-medium text-ink mb-1.5 text-right">رقم الهاتف</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                          <input type="tel" defaultValue="+966 50 123 4567" className="input-base pl-10 text-right" />
                        </div>
                      </StaggerItem>
                    </div>
                    <StaggerItem>
                      <label className="block text-sm font-medium text-ink mb-1.5 text-right">العنوان</label>
                      <textarea 
                        rows={3} 
                        defaultValue="الرياض، حي الملقا، طريق الملك فهد" 
                        className="input-base text-right" 
                      />
                    </StaggerItem>
                  </Stagger>
                )}

                {activeTab !== "general" && (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
                      <Settings className="w-8 h-8 text-ink-subtle animate-spin-slow" />
                    </div>
                    <p className="text-ink-muted">هذا القسم قيد التطوير حالياً</p>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </AppLayout>
  );
}
