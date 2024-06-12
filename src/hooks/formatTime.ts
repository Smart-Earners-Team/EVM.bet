export function formatTimestamp(timestamp: string | number) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysOfWeek = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    // Convert timestamp to a number and ensure it is in milliseconds
    const numericTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;

    // Check if the numericTimestamp is valid
    if (isNaN(numericTimestamp) || numericTimestamp < 0) {
        throw new RangeError("Invalid timestamp value");
    }

    const date = new Date(numericTimestamp * 1000); // Convert seconds to milliseconds

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new RangeError("Invalid date value");
    }

    // Extract year, month, day, and day of the week from the date
    const year = date.getFullYear();
    const monthIndex = date.getMonth(); // 0-indexed
    const dayNumber = date.getDate();
    const dayOfWeek = daysOfWeek[date.getDay()];

    // Extract hours and minutes, and format them in 12-hour format
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    // Format the date in different styles
    const formattedDate = `${dayOfWeek}, ${months[monthIndex]} ${dayNumber}, ${year}`;
    const isoDateString = date.toISOString();
    const ymdMonth = String(monthIndex + 1).padStart(2, '0'); // months are 0-indexed
    const ymdDay = String(dayNumber).padStart(2, '0');
    const dateToYYYYMMDD = `${year}-${ymdMonth}-${ymdDay}`;

    return {
        dayNumber,
        dayOfWeek,
        formattedDate,
        isoDateString,
        dateToYYYYMMDD,
        formattedTime
    };
}