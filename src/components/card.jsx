export function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white dark:bg-[#1f2937] rounded-xl p-6 shadow-md transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`text-[#34495E] dark:text-[#e5e7eb] text-base ${className}`}>
      {children}
    </div>
  );
}
