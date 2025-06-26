import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Shuffle, Download, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-foreground">PAPERGEN</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/submit"
                className="text-sm font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Submit Question
              </Link>
              <Link
                to="/generate"
                className="text-sm font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Generate Paper
              </Link>
              <Link
                to="/questions"
                className="text-sm font-medium text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                All Questions
              </Link>
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Register
                  </Button>
                </Link>
              </div>

              {/* Mobile menu button */}
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              PAPERGEN
              <span className="block text-blue-600 dark:text-blue-400 mt-2">
                Automated Exam Question Paper Generator
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Generate exam question papers intelligently, effortlessly.
            </p>
            <Link to="/get-started">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Powerful Features for Educators</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamline your exam preparation process with our intelligent question paper generation system
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-background">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl font-semibold">Question Bank</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Build and manage comprehensive question banks organized by subjects, topics, and difficulty levels for easy access and reuse.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-background">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <Shuffle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl font-semibold">Randomized Paper Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Automatically generate unique question papers with intelligent randomization based on your criteria and requirements.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-background">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <Download className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl font-semibold">Export as PDF/Word</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Export your generated question papers in professional PDF or Word formats, ready for printing and distribution.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
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
    </div>
  );
}
