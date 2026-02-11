export function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="font-bold text-xl">Marketplace</div>
  
            <nav className="flex gap-6 text-sm">
              <a href="/search" className="hover:text-blue-600">Search</a>
              <a href="/favorites" className="hover:text-blue-600">Favorites</a>
              <a href="/sell" className="bg-blue-600 text-white px-4 py-2 rounded">
                Post ad
              </a>
            </nav>
          </div>
        </header>
  
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    );
  }
  