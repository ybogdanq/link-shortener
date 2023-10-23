export const dateToCron = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const minutes = date.getMinutes();
  const hours = date.getUTCHours();
  const days = date.getDate();
  const months = date.getMonth() + 1;
  const seconds = date.getSeconds();

  return `${year}-${months}-${days}T${hours}:${minutes}:${seconds}`;
};
