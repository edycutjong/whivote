export function TechStack() {
  const stack = [
    { name: "Next.js 16", color: "text-white" },
    { name: "React 19", color: "text-cyan-400" },
    { name: "Tailwind v4", color: "text-sky-400" },
    { name: "Solana", color: "text-purple-400" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {stack.map((tech) => (
        <span
          key={tech.name}
          className={`text-xs font-mono px-2.5 py-1 rounded-full border border-slate-800 bg-slate-900/50 ${tech.color}`}
        >
          {tech.name}
        </span>
      ))}
    </div>
  );
}
