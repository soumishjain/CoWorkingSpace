export default function Showcase() {

  const items = [
    {
      title: "Workspace Analytics",
      desc: "Track activity, usage and collaboration insights across your workspaces.",
      icon: "📊"
    },
    {
      title: "Member Management",
      desc: "Invite members, manage permissions and collaborate seamlessly.",
      icon: "👥"
    },
    {
      title: "Smart Dashboard",
      desc: "A unified dashboard to control and monitor your entire workspace.",
      icon: "🧠"
    }
  ]

  return (
    <section className="bg-gray-50 py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">
            Everything you need to manage your workspace
          </h2>

          <p className="text-gray-500 mt-4">
            Powerful tools designed for modern teams
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {items.map((item,i)=>(
            <div
              key={i}
              className="
              group
              relative
              bg-white
              p-8
              rounded-2xl
              border border-gray-200
              shadow-sm
              hover:shadow-xl
              transition
              duration-300
              cursor-pointer
              "
            >

              {/* Icon */}
              <div className="
              w-14
              h-14
              flex
              items-center
              justify-center
              rounded-xl
              text-2xl
              bg-[var(--color-primary)]/10
              text-[var(--color-primary)]
              group-hover:scale-110
              transition
              ">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mt-6">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 mt-3 leading-relaxed">
                {item.desc}
              </p>

              {/* Bottom hover line */}
              <div className="
              absolute
              bottom-0
              left-0
              w-0
              h-[3px]
              bg-[var(--color-primary)]
              group-hover:w-full
              transition-all
              duration-300
              rounded-b-2xl
              " />

            </div>
          ))}

        </div>

      </div>

    </section>
  )
}