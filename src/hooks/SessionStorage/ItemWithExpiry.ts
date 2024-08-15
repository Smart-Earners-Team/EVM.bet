// Type for the item to be stored in sessionStorage
interface SessionStorageItem {
  // sessionKeyName: string; // Renamed from 'value'
  expiry: number;
  upline: string;
}

export function setItemWithExpiry(
  key: string,
  // sessionKeyName: string,
  upline: string,
  ttl: number
): void {
  const now = new Date();
  const item: SessionStorageItem = {
    // sessionKeyName: sessionKeyName, // Updated to sessionKeyName
    expiry: now.getTime() + ttl,
    upline: upline,
  };
  sessionStorage.setItem(key, JSON.stringify(item));
}

// Function to get the remaining time for an item
export function extractSessionValues(key: string) {
  const itemStr = sessionStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  const remainingTime = item.expiry - now.getTime();
  if (remainingTime <= 0) {
    sessionStorage.removeItem(key);
    return null;
  }
  return {
    // sessionKeyName: item.sessionKeyName,
    upline: item.upline,
    remainingTime: remainingTime,
  };
}
