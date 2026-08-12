export const formatTime = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
