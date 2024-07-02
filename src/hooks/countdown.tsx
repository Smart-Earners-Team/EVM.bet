import React, { useEffect } from 'react';

interface CountdownObject {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  message: string;
}

interface CountdownComponentProps {
  endTime: bigint; // Expecting a bigint for the end time
  format?: '24hr' | '12hr' | 'hourly';
  onCountdownUpdate: (countdown: CountdownObject) => void;
}

const startCountdown = (
  futureDate: bigint,
  onCountdownUpdate: (countdown: CountdownObject) => void,
  format: '24hr' | '12hr' | 'hourly'
) => {
  const now = Date.now();
  const futureTime = Number(futureDate) * 1000;
  const timeLeft = futureTime - now;

  if (timeLeft <= 0) {
    onCountdownUpdate({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      message: 'Countdown finished!'
    });
    return;
  }

  const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
  let hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

  if (format === '12hr') {
    hours = hours % 12 || 12; // Convert to 12-hour format
  } else if (format === 'hourly') {
    hours += days * 24; // Convert days to hours
  }

  const countdownObject: CountdownObject = {
    days: format === 'hourly' ? 0 : days,
    hours,
    minutes,
    seconds,
    message: `${format === 'hourly' ? '' : `${days} days, `}${hours} hours, ${minutes} minutes, ${seconds} seconds`
  };

  onCountdownUpdate(countdownObject);
};

const CountdownComponent: React.FC<CountdownComponentProps> = ({
  endTime,
  format = 'hourly',
  onCountdownUpdate
}) => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      startCountdown(endTime, onCountdownUpdate, format);
    }, 1000);

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [endTime, format, onCountdownUpdate]);

  return null; // Component does not render any content directly
};

export default CountdownComponent;
