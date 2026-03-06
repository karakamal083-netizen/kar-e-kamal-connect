import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, LogOut, Image, Loader2, Save, ImageIcon, Type, BarChart3, Phone, Images, Inbox } from "lucide-react";
import logo from "@/assets/logo.jpg";
import GalleryTab from "@/components/admin/GalleryTab";
import SubmissionsTab from "@/components/admin/SubmissionsTab";

const IMAGE_SLOTS = [
  { key: "hero-bg", label: "Hero Background" },
  { key: "ration-delivery", label: "Ration Delivery" },
  { key: "medical-camp", label: "Medical Camp" },
  { key: "education-support", label: "Education Support" },
  { key: "skills-center", label: "Skills Center" },
  { key: "orphan-care", label: "Orphan Care" },
  { key: "winter-drive", label: "Winter Drive" },
  { key: "flood-relief", label: "Flood Relief" },
];

const CONTENT_SECTIONS = {
  hero: [
    { key: "hero_subtitle", label: "Subtitle", type: "text" },
    { key: "hero_title", label: "Title (use \\n for line break)", type: "text" },
    { key: "hero_description", label: "Description", type: "textarea" },
  ],
  about: [
    { key: "about_text", label: "About Description", type: "textarea" },
    { key: "mission_text", label: "Mission Statement", type: "textarea" },
    { key: "vision_text", label: "Vision Statement", type: "textarea" },
    { key: "founder_text", label: "Founder Description", type: "textarea" },
  ],
  stats: [
    { key: "stat_1_value", label: "Stat 1 Value", type: "text" },
    { key: "stat_1_label", label: "Stat 1 Label", type: "text" },
    { key: "stat_2_value", label: "Stat 2 Value", type: "text" },
    { key: "stat_2_label", label: "Stat 2 Label", type: "text" },
    { key: "stat_3_value", label: "Stat 3 Value", type: "text" },
    { key: "stat_3_label", label: "Stat 3 Label", type: "text" },
    { key: "stat_4_value", label: "Stat 4 Value", type: "text" },
    { key: "stat_4_label", label: "Stat 4 Label", type: "text" },
  ],
  contact: [
    { key: "contact_location", label: "Location", type: "text" },
    { key: "contact_phone", label: "Phone", type: "text" },
    { key: "contact_email", label: "Email", type: "text" },
    { key: "social_facebook", label: "Facebook URL", type: "text" },
    { key: "social_instagram", label: "Instagram URL", type: "text" },
    { key: "social_youtube", label: "YouTube URL", type: "text" },
  ],
};

type Tab = "images" | "gallery" | "hero" | "about" | "stats" | "contact" | "submissions";

interface SiteImage {
  slot_key: string;
  image_url: string;
  label: string | null;
}

interface SiteContent {
  content_key: string;
  content_value: string;
  category: string;
  label: string | null;
}

const AdminPanel = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [content, setContent] = useState<SiteContent[]>([]);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("images");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      setSession(s);
      if (!s) navigate("/admin/login");
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
      if (!s) navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchImages = useCallback(async () => {
    const { data } = await supabase.from("site_images").select("*");
    if (data) setImages(data as SiteImage[]);
  }, []);

  const fetchContent = useCallback(async () => {
    const { data } = await supabase.from("site_content").select("*");
    if (data) {
      setContent(data as SiteContent[]);
      const map: Record<string, string> = {};
      (data as SiteContent[]).forEach((c) => { map[c.content_key] = c.content_value; });
      setEditedContent(map);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchImages();
      fetchContent();
    }
  }, [session, fetchImages, fetchContent]);

  const handleUpload = async (slotKey: string, file: File) => {
    setUploading(slotKey);
    const ext = file.name.split(".").pop();
    const filePath = `${slotKey}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("site-images")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(filePath);
    const imageUrl = urlData.publicUrl;

    const existing = images.find((i) => i.slot_key === slotKey);
    if (existing) {
      await supabase.from("site_images").update({ image_url: imageUrl }).eq("slot_key", slotKey);
    } else {
      await supabase.from("site_images").insert({
        slot_key: slotKey,
        image_url: imageUrl,
        label: IMAGE_SLOTS.find((s) => s.key === slotKey)?.label || slotKey,
      });
    }

    await fetchImages();
    setUploading(null);
    toast({ title: "Image updated!", description: `${slotKey} has been updated.` });
  };

  const handleSaveContent = async (category: string) => {
    setSaving(true);
    const fields = CONTENT_SECTIONS[category as keyof typeof CONTENT_SECTIONS] || [];

    for (const field of fields) {
      const value = editedContent[field.key];
      if (value === undefined) continue;

      const existing = content.find((c) => c.content_key === field.key);
      if (existing) {
        await supabase.from("site_content").update({ content_value: value }).eq("content_key", field.key);
      } else {
        await supabase.from("site_content").insert({
          content_key: field.key,
          content_value: value,
          category,
          label: field.label,
        });
      }
    }

    await fetchContent();
    setSaving(false);
    toast({ title: "Content saved!", description: `${category} section has been updated.` });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!session) return null;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "images", label: "Images", icon: <ImageIcon className="w-4 h-4" /> },
    { key: "gallery", label: "Gallery", icon: <Images className="w-4 h-4" /> },
    { key: "hero", label: "Hero", icon: <Type className="w-4 h-4" /> },
    { key: "about", label: "About", icon: <Type className="w-4 h-4" /> },
    { key: "stats", label: "Stats", icon: <BarChart3 className="w-4 h-4" /> },
    { key: "contact", label: "Contact", icon: <Phone className="w-4 h-4" /> },
    { key: "submissions", label: "Messages", icon: <Inbox className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-heading text-lg font-bold text-primary">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary">View Site</a>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Manage Website Content</h1>
        <p className="text-muted-foreground mb-6">Update images, text, stats, and contact info displayed on the website.</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className="gap-1.5"
            >
              {tab.icon} {tab.label}
            </Button>
          ))}
        </div>

        {/* Images Tab */}
        {activeTab === "images" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {IMAGE_SLOTS.map((slot) => {
              const current = images.find((i) => i.slot_key === slot.key);
              const isUploading = uploading === slot.key;
              return (
                <div key={slot.key} className="bg-card rounded-lg border shadow-card overflow-hidden">
                  <div className="aspect-video bg-muted relative flex items-center justify-center">
                    {current ? (
                      <img src={current.image_url} alt={slot.label} className="w-full h-full object-cover" />
                    ) : (
                      <Image className="w-12 h-12 text-muted-foreground/30" />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-sm font-bold text-foreground mb-2">{slot.label}</h3>
                    <p className="text-xs text-muted-foreground mb-3">Slot: {slot.key}</p>
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(slot.key, file);
                        }}
                        disabled={isUploading}
                      />
                      <Button variant="outline" size="sm" className="w-full" asChild disabled={isUploading}>
                        <span><Upload className="w-4 h-4 mr-1" /> {current ? "Replace" : "Upload"} Image</span>
                      </Button>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && <GalleryTab />}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div className="max-w-3xl">
            <SubmissionsTab />
          </div>
        )}

        {/* Content Tabs */}
        {activeTab !== "images" && activeTab !== "gallery" && activeTab !== "submissions" && (
          <div className="max-w-2xl">
            <div className="bg-card rounded-lg border p-6 space-y-5">
              {CONTENT_SECTIONS[activeTab]?.map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">{field.label}</label>
                  {field.type === "textarea" ? (
                    <Textarea
                      value={editedContent[field.key] ?? ""}
                      onChange={(e) => setEditedContent({ ...editedContent, [field.key]: e.target.value })}
                      rows={4}
                    />
                  ) : (
                    <Input
                      value={editedContent[field.key] ?? ""}
                      onChange={(e) => setEditedContent({ ...editedContent, [field.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <Button onClick={() => handleSaveContent(activeTab)} disabled={saving} className="gap-1.5">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
