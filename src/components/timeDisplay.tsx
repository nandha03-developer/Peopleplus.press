// components/TimeDisplay.js
import React from 'react';

// Utility function to format relative time
function formatRelativeTime(dateString: any) {
  const now: any = new Date();
  const date: any = new Date(dateString);
  const differenceInSeconds = Math.floor((now - date) / 1000);

  if (differenceInSeconds < 60) {
    // Less than a minute
    return `${differenceInSeconds} sec${differenceInSeconds > 1 ? 's' : ''} ago`;
  } else if (differenceInSeconds < 3600) {
    // Less than an hour
    const minutes = Math.floor(differenceInSeconds / 60);
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  } else if (differenceInSeconds < 86400) {
    // Less than a day
    const hours = Math.floor(differenceInSeconds / 3600);
    return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  } else if (differenceInSeconds < 2592000) {
    // Less than a month
    const days = Math.floor(differenceInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    // More than a month
    const months = Math.floor(differenceInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}

// React component that uses the utility function
const TimeDisplay = ({ dateTime }: any) => {
  return (
    <div style={{ textTransform: 'lowercase' }}>
      {formatRelativeTime(dateTime)}
    </div>
  );
};

export default TimeDisplay;