import { Users } from "lucide-react";

const ExplorePageCard = ({ workspace }) => {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">

      {/* 🔥 TOP COVER IMAGE */}
      <div className="h-28 w-full relative overflow-hidden">

        {/* IMAGE */}
        <img
          src={
            workspace.coverImage ||
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
          }
          alt="cover"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/20" />

        {/* BADGE */}
        <span className="absolute top-3 right-3 text-[10px] bg-white/90 text-indigo-600 px-2 py-1 rounded-full font-medium shadow-sm">
          Trending
        </span>
      </div>

      {/* 🔥 CONTENT */}
      <div className="p-5 relative">

        {/* PROFILE ICON */}
        <div className="absolute -top-6 left-5 w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-lg font-semibold text-indigo-600 border">
          {workspace.name?.[0] || "W"}
        </div>

        {/* TITLE */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition">
            {workspace.name}
          </h3>

          <p className="text-xs text-gray-400 mt-1">
            Created by {workspace.createdBy?.name || "Unknown"}
          </p>
        </div>

        {/* DESC */}
        <p className="text-sm text-gray-500 line-clamp-2 mt-3 mb-4 leading-relaxed">
          {workspace.description || "No description available"}
        </p>

        {/* FOOTER */}
        <div className="flex justify-between items-center">

          {/* MEMBERS */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={14} />
            <span>{workspace.memberCount || 0}</span>
          </div>

          {/* BUTTON */}
          <button className="text-xs font-medium px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-105 active:scale-95 transition-all shadow-sm">
            {workspace.isJoined ? "Joined" : "Join"}
          </button>
        </div>
      </div>

      {/* 🔥 HOVER GLOW */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
    </div>
  );
};

export default ExplorePageCard;