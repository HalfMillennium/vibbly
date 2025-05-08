import { Cog, Bookmark, User } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">ClipCraft</h1>
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">Beta</span>
          </div>
          
          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-gray-900" title="View Saved Clips">
              <Bookmark className="h-5 w-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-900" title="Settings">
              <Cog className="h-5 w-5" />
            </button>
            <button 
              className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300" 
              title="User Account"
            >
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
