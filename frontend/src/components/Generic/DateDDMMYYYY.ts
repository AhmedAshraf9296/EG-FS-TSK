export default function formatDateToDdMmYyyy(dateString:string)  {
    const date = new Date(dateString); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Get day and add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and add leading zero if needed (months are 0-indexed)
    const year = date.getFullYear(); // Get the year
    return `${day}-${month}-${year}`; // Return in dd-mm-yyyy format
};