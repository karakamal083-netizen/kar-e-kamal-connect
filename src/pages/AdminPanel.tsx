import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, LogOut, Image, Loader2 } from "lucide-react";
import logo from "@/assets/logo.jpg";

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

interface SiteImage {
  slot_key: string;
  image_url: string;
  label: string | null;
}

const AdminPanel = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<SiteImage[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
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

  useEffect(() => {
    if (session) fetchImages();
  }, [session, fetchImages]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!session) return null;

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
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Manage Website Images</h1>
        <p className="text-muted-foreground mb-8">Upload or replace images used on the website.</p>

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
      </main>
    </div>
  );
};

export default AdminPanel;
