import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, MailOpen, Loader2, Inbox } from "lucide-react";
import { format } from "date-fns";

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const SubmissionsTab = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSubmissions = useCallback(async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSubmissions(data as Submission[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const toggleRead = async (id: string, current: boolean) => {
    await supabase.from("contact_submissions").update({ is_read: !current }).eq("id", id);
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, is_read: !current } : s)));
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from("contact_submissions").delete().eq("id", id);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
    toast({ title: "Submission deleted" });
  };

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
          {unreadCount > 0 && <span className="text-primary font-semibold"> · {unreadCount} unread</span>}
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No contact submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <div
              key={s.id}
              className={`bg-card rounded-lg border p-4 transition-colors ${!s.is_read ? "border-primary/40 bg-primary/5" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-heading text-sm font-bold text-foreground truncate">{s.name}</h4>
                    {!s.is_read && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {s.email} · {format(new Date(s.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{s.message}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleRead(s.id, s.is_read)}
                    title={s.is_read ? "Mark unread" : "Mark read"}
                  >
                    {s.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(s.id)}
                    disabled={deleting === s.id}
                  >
                    {deleting === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionsTab;
