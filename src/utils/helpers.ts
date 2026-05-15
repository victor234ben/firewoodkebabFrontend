export const formatPrice = (amount: number): string => {
  return `$${amount?.toLocaleString()}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
};
