export function HomeSearch() {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-semibold mb-4">
          Find what you’re looking for
        </h1>
  
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select className="border rounded px-3 py-2">
            <option>Category</option>
          </select>
  
          <input
            placeholder="Keyword"
            className="border rounded px-3 py-2"
          />
  
          <input
            placeholder="City"
            className="border rounded px-3 py-2"
          />
  
          <select className="border rounded px-3 py-2">
            <option>Price</option>
          </select>
  
          <button className="bg-blue-600 text-white rounded px-4 py-2">
            Search
          </button>
        </div>
      </div>
    );
  }
  