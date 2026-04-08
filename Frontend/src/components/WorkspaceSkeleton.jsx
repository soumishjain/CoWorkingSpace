export default function WorkspaceCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl 
                    border border-[var(--border)] 
                    bg-[var(--bg-secondary)] 
                    p-4">

      {/* 🔥 SHIMMER OVERLAY */}
      <div className="absolute inset-0 
                      bg-gradient-to-r 
                      from-transparent 
                      via-white/5 
                      to-transparent 
                      animate-[shimmer_1.5s_infinite]" />

      {/* IMAGE */}
      <div className="h-36 w-full 
                      bg-[var(--bg-hover)] 
                      rounded-lg" />

      {/* TITLE */}
      <div className="h-4 bg-[var(--bg-hover)] rounded mt-4 w-3/4" />

      {/* SUBTITLE */}
      <div className="h-3 bg-[var(--bg-hover)] rounded mt-2 w-1/2" />

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-4">

        <div className="h-8 w-8 bg-[var(--bg-hover)] rounded-full" />

        <div className="h-8 w-16 bg-[var(--bg-hover)] rounded-lg" />

      </div>
    </div>
  );
}