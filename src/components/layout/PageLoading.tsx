export function PageLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-nexvo-purple-200 border-t-nexvo-purple-600"
        role="status"
        aria-label="Loading"
      />
    </main>
  );
}
