const AdminCard = ({ admin }) => {
  return (
    <div className="relative group rounded-2xl p-[1px] 
                    bg-gradient-to-br from-[var(--accent)]/40 via-transparent to-transparent">

      {/* 🔥 INNER CARD */}
      <div className="relative rounded-2xl p-5 
                      bg-[var(--bg-secondary)]/70 
                      backdrop-blur-2xl 
                      border border-[var(--border)] 
                      overflow-hidden">

        {/* 🔥 SOFT GLOW */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                        transition duration-500 
                        bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.25),transparent_70%)]" />

        {/* 🔥 TOP SECTION */}
        <div className="relative flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* 🔥 AVATAR WITH RING */}
            <div className="relative">

              <div className="absolute inset-0 rounded-full 
                              bg-[var(--accent)] blur-md opacity-40 group-hover:opacity-70 transition" />

              <img
                src="https://i.pinimg.com/736x/ce/71/83/ce7183208d2cfec428cdb066abbd4699.jpg"
                className="relative w-14 h-14 rounded-full object-cover 
                           border-2 border-[var(--bg-secondary)]"
              />

            </div>

            {/* INFO */}
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {admin?.name}
              </h3>

              <p className="text-xs text-[var(--text-secondary)]">
                {admin?.email}
              </p>
            </div>

          </div>

          {/* 🔥 ROLE BADGE */}
          <span className="text-[10px] px-3 py-1 rounded-full 
                           bg-[var(--accent)]/10 
                           text-[var(--accent)] 
                           border border-[var(--accent)]/20 
                           font-medium">
            ADMIN
          </span>

        </div>

        {/* 🔥 DIVIDER */}
        <div className="my-4 h-[1px] bg-[var(--border)] opacity-60" />

        {/* 🔥 BOTTOM */}
        <div className="flex items-center justify-between text-xs">

          <p className="text-[var(--text-secondary)]">
            Workspace Owner
          </p>

          {/* STATUS */}
          <div className="flex items-center gap-1 text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Active
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminCard;