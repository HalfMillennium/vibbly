export default function AppFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">© {new Date().getFullYear()} ClipCraft</span>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy</a>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">
              Not affiliated with YouTube. All YouTube content belongs to their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
