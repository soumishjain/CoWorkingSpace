import { Trophy } from "lucide-react";

const PreviousWinnerCard = ({ winner, loading }) => {
  if (loading) {
    return (
      <div className="rounded-3xl p-6 bg-gray-50 text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (!winner) {
    return (
      <div className="rounded-3xl p-6 bg-gray-50 text-sm text-gray-500">
        No previous winner
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl p-6 bg-gradient-to-br from-yellow-50 to-white shadow-sm">
      <div className="flex flex-col items-center text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Last Month Winner
        </p>

        <div className="relative mt-4">
          <img
            src={
              winner.profileImage ||
              "https://ui-avatars.com/api/?name=User"
            }
            className="w-16 h-16 rounded-full object-cover shadow-md"
          />

          <div className="absolute -top-2 -right-2 bg-yellow-400 p-1 rounded-full">
            <Trophy size={14} className="text-white" />
          </div>
        </div>

        <h3 className="mt-4 font-semibold text-gray-900">
          {winner.name}
        </h3>

        <p className="text-sm text-gray-500">
          {winner.points} pts
        </p>
      </div>
    </div>
  );
};

export default PreviousWinnerCard;