import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-background border-t py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Links */}
          <div className="flex flex-wrap gap-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</Link>
          </div>

          {/* Right side - Copyright */}
          <div className="text-sm text-muted-foreground md:text-right">
            © 2025 PAPERGEN – Built with ❤️ at Jahangirnagar University
          </div>
        </div>
      </div>
    </footer>
  );
}
