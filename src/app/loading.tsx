// app/loading.tsx
export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-lg w-72 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-96 mx-auto"></div>
        </div>

        <div className="space-y-8">
          <div className="max-w-xl mx-auto animate-pulse">
            <div className="h-14 bg-gray-200 dark:bg-slate-800 rounded-xl w-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 h-64 animate-pulse flex flex-col justify-between">
                <div>
                  <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
                  <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded-full w-1/3 mb-6"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-5/6"></div>
                </div>
                <div className="h-10 bg-gray-200 dark:bg-slate-800 rounded-xl w-full mt-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
