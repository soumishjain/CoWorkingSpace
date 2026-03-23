const TopCard = ({ user, index }) => {
  const colors = ["bg-yellow-100", "bg-gray-100", "bg-orange-100"];

  return (
    <div className={`p-5 rounded-xl text-center ${colors[index]}`}>
      <p className="text-sm">#{index + 1}</p>
      <img
        src={user.profileImage}
        className="w-12 h-12 rounded-full mx-auto mt-2"
      />
      <h3 className="font-semibold mt-2">{user.name}</h3>
      <p className="font-bold">{user.points} pts</p>
    </div>
  );
};

export default TopCard;