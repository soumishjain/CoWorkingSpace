import toast from "react-hot-toast";

const SubtaskItem = ({ subtask, onClaim, onComplete }) => {
  const userId = localStorage.getItem("userId");

  const isMine = subtask.assignedTo?._id === userId;

  const handleClaim = () => {
    onClaim(subtask._id);
    toast.success("Subtask claimed 🚀");
  };

  const getStatusColor = () => {
    if (subtask.status === "completed") return "bg-green-500";
    if (subtask.assignedTo) return "bg-blue-500";
    return "bg-gray-300";
  };

  return (
    <div className="relative group">

      {/* LEFT ACCENT LINE */}
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${getStatusColor()}`} />

      <div className="ml-2 p-4 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl flex justify-between items-center transition-all duration-200 hover:shadow-lg hover:-translate-y-[2px]">

        {/* LEFT */}
        <div className="flex flex-col gap-1">

          {/* TITLE */}
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-black transition">
            {subtask.title}
          </h3>

          {/* META */}
          <div className="flex items-center gap-2 text-xs text-gray-500">

            {/* POINTS */}
            <span className="px-2 py-0.5 bg-gray-100 rounded-md">
              ⚡ {subtask.points}
            </span>

            {/* USER */}
            {subtask.assignedTo && (
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
                <img
                  src={
                    subtask.assignedTo.profileImage ||
                    "https://i.pravatar.cc/30"
                  }
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-gray-600">
                  {subtask.assignedTo.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* NOT CLAIMED */}
          {!subtask.assignedTo && (
            <button
              onClick={handleClaim}
              className="text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1.5 rounded-full hover:scale-105 transition"
            >
              Claim
            </button>
          )}

          {/* CLAIMED BY ME */}
          {isMine && subtask.status !== "completed" && (
            <button
              onClick={() => onComplete(subtask._id)}
              className="text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full hover:scale-105 transition"
            >
              Done
            </button>
          )}

          {/* COMPLETED */}
          {subtask.status === "completed" && (
            <span className="text-xs font-medium bg-green-100 text-green-600 px-3 py-1 rounded-full">
              ✔ Completed
            </span>
          )}

          {/* CLAIMED */}
          {subtask.assignedTo && subtask.status !== "completed" && !isMine && (
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              Claimed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubtaskItem;