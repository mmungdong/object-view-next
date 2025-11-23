import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Home, Info, Image, Mail, Grid3X3, List } from "lucide-react";

// Mock data for the showcase
const galleryImages = [
  { id: 1, src: "https://placehold.co/600x400/1a2a3a/4ade80?text=Mountain+View", alt: "Mountain landscape" },
  { id: 2, src: "https://placehold.co/600x400/1a2a3a/4ade80?text=Ocean+Sunset", alt: "Ocean sunset" },
  { id: 3, src: "https://placehold.co/600x400/1a2a3a/4ade80?text=Forest+Path", alt: "Forest path" },
  { id: 4, src: "https://placehold.co/600x400/1a2a3a/4ade80?text=City+Skyline", alt: "City skyline" },
  { id: 5, src: "https://placehold.co/600x400/1a2a3a/4ade80?text=Desert+Dunes", alt: "Desert dunes" },
  { id: 6, src: "https://placehold.co/600x400/1a2a3a/4ade80?text=Northern+Lights", alt: "Northern lights" },
  { id: 7, src: "https://placehold.co/600x400/1a2a3a/4ade80?text=Waterfall", alt: "Waterfall" },
  { id: 8, src: "https://placehold.co/600x400/1a2a3a/4ade80?text=Star+Night", alt: "Starry night" },
  { id: 9, src: "https://placehold.co/600x400/1a2a3a/4ade80?text=Autumn+Colors", alt: "Autumn colors" },
];

const coreContent = [
  {
    id: 1,
    title: "Curated Collection",
    description: "Each image is carefully selected to showcase the beauty of our world through a photographer's lens.",
  },
  {
    id: 2,
    title: "Technical Excellence",
    description: "High-resolution captures with professional equipment and post-processing techniques.",
  },
  {
    id: 3,
    title: "Artistic Vision",
    description: "Creative composition and storytelling that goes beyond simple documentation.",
  },
];

export default function ShowcasePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Header/Navigation */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GalleryView
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#"
                      className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div className="flex items-center">
                        <Home className="mr-2 h-4 w-4" />
                        Home
                      </div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#"
                      className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div className="flex items-center">
                        <Image className="mr-2 h-4 w-4" />
                        Gallery
                      </div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#"
                      className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div className="flex items-center">
                        <Info className="mr-2 h-4 w-4" />
                        About
                      </div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="#"
                      className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact
                      </div>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="rounded-full"
              >
                {viewMode === "grid" ? <List className="h-5 w-5" /> : <Grid3X3 className="h-5 w-5" />}
              </Button>
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-2 mt-8">
                    <a
                      href="#"
                      className="flex items-center py-3 px-4 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Home className="mr-3 h-5 w-5" />
                      Home
                    </a>
                    <a
                      href="#"
                      className="flex items-center py-3 px-4 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Image className="mr-3 h-5 w-5" />
                      Gallery
                    </a>
                    <a
                      href="#"
                      className="flex items-center py-3 px-4 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Info className="mr-3 h-5 w-5" />
                      About
                    </a>
                    <a
                      href="#"
                      className="flex items-center py-3 px-4 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Mail className="mr-3 h-5 w-5" />
                      Contact
                    </a>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Visual Storytelling
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                A curated collection of stunning imagery that captures the beauty and diversity of our world.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="rounded-full px-8">
                  Explore Gallery
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  View Collection
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Core Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Approach</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We believe in the power of imagery to tell stories and evoke emotions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coreContent.map((item) => (
                <Card key={item.id} className="border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-accent">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <div className="w-6 h-6 rounded-full bg-primary"></div>
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Image Gallery Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <div className="mb-6 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Collection</h2>
                <p className="text-muted-foreground">
                  A selection of our most captivating imagery
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-full"
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-full"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
              </div>
            </div>

            <div className={viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "grid grid-cols-1 gap-6"
            }>
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className={`overflow-hidden rounded-xl transition-all duration-500 ease-in-out hover:scale-[1.02] group ${
                    viewMode === "list" ? "flex items-center gap-6" : ""
                  }`}
                >
                  <div className={`
                    relative overflow-hidden rounded-lg bg-card
                    ${viewMode === "list" ? "w-48 h-32 flex-shrink-0" : "aspect-[4/3]"}
                  `}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-90"
                      onLoad={(e) => {
                        e.currentTarget.classList.remove('opacity-0');
                        e.currentTarget.classList.add('opacity-100');
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  {viewMode === "list" && (
                    <div className="py-2">
                      <h3 className="font-medium text-lg">{image.alt}</h3>
                      <p className="text-muted-foreground text-sm mt-1">Photograph • Landscape</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 md:mb-0">
              GalleryView
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
            <div className="mt-4 md:mt-0 text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} GalleryView. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}