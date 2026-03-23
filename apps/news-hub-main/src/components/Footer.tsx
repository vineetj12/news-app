import { Newspaper } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <span className="font-serif font-bold text-foreground">NewsFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 NewsFlow. All rights reserved. Demo project — no real news.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
