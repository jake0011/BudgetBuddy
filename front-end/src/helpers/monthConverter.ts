// Function to get the month name from a month number (0-11)
export const getMonthName = (monthNumber: number): string => {
  // Array of month names
  const monthNames = [
    "January", // 0
    "February", // 1
    "March", // 2
    "April", // 3
    "May", // 4
    "June", // 5
    "July", // 6
    "August", // 7
    "September", // 8
    "October", // 9
    "November", // 10
    "December", // 11
  ];
  // Return the month name corresponding to the month number
  return monthNames[monthNumber];
};
