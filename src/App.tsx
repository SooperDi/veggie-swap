function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Veggie Swap</h1>
          <p className="mt-2 text-green-100">Share and swap homegrown vegetables with neighbors</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Veggie Swap!</h2>
          <p className="text-gray-600">
            Connect with your neighbors to share and exchange fresh, homegrown vegetables.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
