export default function Footer() {
  return (
    <footer className="border-t border-primary/20 px-6 py-8 md:py-12 bg-white/50">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="text-center md:text-left">
          <p className="font-serif text-lg md:text-xl text-primary tracking-wide">Crumbs Bakery &amp; Cafe</p>
          <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">Shillong</p>
        </div>

        <div className="flex gap-4 md:gap-6 text-[10px] md:text-xs text-muted-foreground">
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#menu" className="hover:text-primary transition-colors">Menu</a>
          <a href="#gallery" className="hover:text-primary transition-colors">Gallery</a>
          <a href="#reviews" className="hover:text-primary transition-colors">Reviews</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </div>

        <p className="text-[10px] md:text-xs text-muted-foreground text-center md:text-right">
          &copy; {new Date().getFullYear()} Crumbs Bakery & Cafe
        </p>
      </div>
    </footer>
  )
}
