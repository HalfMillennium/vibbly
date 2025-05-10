export default function AppFooter() {
  return (
    <footer className="mt-auto py-6 px-4 sm:px-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto">
        <p>© {new Date().getFullYear()} vibbly - Easily create and share video clips</p>
      </div>
    </footer>
  );
}