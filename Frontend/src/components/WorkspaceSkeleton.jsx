export default function WorkspaceCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">

      {/* Image */}
      <div className="h-32 w-full bg-gray-200 rounded-lg"></div>

      {/* Title */}
      <div className="h-4 bg-gray-200 rounded mt-4 w-3/4"></div>

      {/* Subtitle */}
      <div className="h-3 bg-gray-200 rounded mt-2 w-1/2"></div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
      </div>

    </div>
  );
}