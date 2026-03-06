import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, Trash2, Image, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
}

const SortableItem = ({
  img,
  deleting,
  onDelete,
  onCaptionChange,
}: {
  img: GalleryImage;
  deleting: string | null;
  onDelete: (id: string) => void;
  onCaptionChange: (id: string, caption: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-card rounded-lg border shadow-card overflow-hidden group">
      <div className="aspect-square bg-muted relative">
        <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover" />
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 bg-foreground/60 text-primary-foreground rounded p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        {deleting === img.id && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
          </div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <Input
          value={img.caption}
          onChange={(e) => onCaptionChange(img.id, e.target.value)}
          placeholder="Caption"
          className="text-xs h-8"
        />
        <Button
          variant="destructive"
          size="sm"
          className="w-full gap-1"
          onClick={() => onDelete(img.id)}
          disabled={deleting === img.id}
        >
          <Trash2 className="w-3.5 h-3.5" /> Remove
        </Button>
      </div>
    </div>
  );
};

const GalleryTab = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchGallery = useCallback(async () => {
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setImages(data as GalleryImage[]);
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex);

    setImages(reordered);

    // Persist new order
    for (let i = 0; i < reordered.length; i++) {
      if (reordered[i].sort_order !== i) {
        await supabase.from("gallery_images").update({ sort_order: i }).eq("id", reordered[i].id);
      }
    }
  };

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const maxOrder = images.length > 0 ? Math.max(...images.map((i) => i.sort_order)) : 0;

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      const ext = file.name.split(".").pop();
      const filePath = `gallery-${Date.now()}-${idx}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        continue;
      }

      const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(filePath);

      await supabase.from("gallery_images").insert({
        image_url: urlData.publicUrl,
        caption: file.name.replace(/\.[^.]+$/, ""),
        sort_order: maxOrder + idx + 1,
      });
    }

    await fetchGallery();
    setUploading(false);
    toast({ title: "Gallery updated!", description: `${files.length} image(s) added.` });
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from("gallery_images").delete().eq("id", id);
    await fetchGallery();
    setDeleting(null);
    toast({ title: "Image removed" });
  };

  const handleCaptionChange = async (id: string, caption: string) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, caption } : img)));
    await supabase.from("gallery_images").update({ caption }).eq("id", id);
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <label className="cursor-pointer block">
        <Input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) handleUpload(e.target.files);
          }}
          disabled={uploading}
        />
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          {uploading ? (
            <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin mb-2" />
          ) : (
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          )}
          <p className="text-sm font-semibold text-foreground">
            {uploading ? "Uploading..." : "Click to upload gallery images"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Select multiple images at once</p>
        </div>
      </label>

      {/* Image grid */}
      {images.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No gallery images yet. Upload some above!</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img) => (
                <SortableItem
                  key={img.id}
                  img={img}
                  deleting={deleting}
                  onDelete={handleDelete}
                  onCaptionChange={handleCaptionChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <p className="text-xs text-muted-foreground">
        {images.length} image{images.length !== 1 ? "s" : ""} in gallery · Drag to reorder
      </p>
    </div>
  );
};

export default GalleryTab;
