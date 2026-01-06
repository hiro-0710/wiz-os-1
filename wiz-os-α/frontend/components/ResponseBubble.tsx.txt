export const ResponseBubble = ({ message, profile }: {
  message: string;
  profile: string;
}) => {
  const styles: Record<string, string> = {
    hiroya: "border-blue-300/40 bg-blue-300/10",
    family: "border-orange-200/40 bg-orange-200/10",
    guest:  "border-white/20 bg-white/10",
  };

  return (
    <div
      className={`p-4 rounded border ${styles[profile] || styles.guest}`}
      style={{ transition: "all 0.3s ease" }}
    >
      <p className="whitespace-pre-line">{message}</p>
    </div>
  );
};
