import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useRef, useState } from "react";

const videos = [
  { src: "/videos/video-1.mp4", title: "Community Service" },
  { src: "/videos/video-2.mp4", title: "Food Distribution" },
  { src: "/videos/video-3.mp4", title: "Volunteer Activities" },
  { src: "/videos/video-4.mp4", title: "Relief Work" },
];

const VideoCard = ({ src, title, index }: { src: string; title: string; index: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="rounded-lg overflow-hidden bg-card shadow-card border group"
    >
      <div className="relative aspect-video bg-muted cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          playsInline
          preload="metadata"
          onEnded={() => setPlaying(false)}
        />
        {!playing && (
          <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center transition-opacity group-hover:bg-foreground/40">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-base font-bold text-foreground">{title}</h3>
      </div>
    </motion.div>
  );
};

const VideoSection = () => (
  <section id="videos" className="py-20 bg-secondary">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Videos</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">See Us in Action</h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {videos.map((v, i) => (
          <VideoCard key={i} src={v.src} title={v.title} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default VideoSection;
