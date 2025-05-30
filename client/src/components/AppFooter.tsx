export default function AppFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-8 sm:mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            <span className="text-xs sm:text-sm text-gray-500">© {new Date().getFullYear()} ClipCraft</span>
            <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-primary">Terms</a>
            <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-primary">Privacy</a>
            <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-primary">Help</a>
          </div>
          
          <div className="mt-2 md:mt-0">
            <p className="text-xs sm:text-sm text-gray-500 text-center md:text-right">
              Not affiliated with YouTube. All YouTube content belongs to their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
