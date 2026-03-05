import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary py-10">
    <div className="container text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Heart className="w-5 h-5 fill-primary-foreground text-primary-foreground" />
        <span className="font-heading text-lg font-bold text-primary-foreground">Kaar-e-Kamal Welfare Association</span>
      </div>
      <p className="text-primary-foreground/70 text-sm mb-2">Khanpur Region • Founded 2018</p>
      <p className="text-primary-foreground/50 text-xs">© {new Date().getFullYear()} Kaar-e-Kamal. All rights reserved. Donate for Afterlife.</p>
    </div>
  </footer>
);

export default Footer;
