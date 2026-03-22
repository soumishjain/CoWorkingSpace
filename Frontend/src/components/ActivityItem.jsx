import { Clock } from "lucide-react";

const ActivityItem = ({ activity }) => {
  const name = activity.userId?.name || "User";
  const firstLetter = name.charAt(0).toUpperCase();

  const time = new Date(activity.createdAt).toLocaleString();

  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200">

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-black to-gray-700 text-white flex items-center justify-center text-sm font-semibold shrink-0">
        {firstLetter}
      </div>

      {/* Content */}
      <div className="flex-1">

        {/* Message */}
        <p className="text-sm text-gray-800 leading-relaxed">
          <span className="font-semibold text-black">{name}</span>{" "}
          <span className="text-gray-600">{activity.message}</span>
        </p>

        {/* Time */}
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
          <Clock size={12} />
          <span>{time}</span>
        </div>

      </div>
    </div>
  );
};

export default ActivityItem;