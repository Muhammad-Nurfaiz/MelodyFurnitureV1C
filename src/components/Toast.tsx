// components/Toast.tsx
export function Toast({ message }: { message: { type: "success" | "error"; text: string } | null }) {
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg text-white text-xs md:text-sm font-medium shadow-xl ${
        message.type === "success" ? "bg-emerald-600" : "bg-red-600"
      }`}
    >
      <span className="material-symbols-outlined">
        {message.type === "success" ? "check_circle" : "error"}
      </span>
      <span>{message.text}</span>
    </div>
  );
}