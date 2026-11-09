import { useState, useEffect } from 'react';

export interface CountdownResult {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
  totalSeconds: number;
}

export function useCountdown(targetDate: string): CountdownResult {
  const calculateTimeRemaining = (): CountdownResult => {
    const diff = new Date(targetDate).getTime() - Date.now();

    if (diff <= 0) {
      return {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        isExpired: true,
        totalSeconds: 0,
      };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return {
      days: d < 10 ? `0${d}` : `${d}`,
      hours: h < 10 ? `0${h}` : `${h}`,
      minutes: m < 10 ? `0${m}` : `${m}`,
      seconds: s < 10 ? `0${s}` : `${s}`,
      isExpired: false,
      totalSeconds,
    };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownResult>(calculateTimeRemaining);

  useEffect(() => {
    // Recalculate immediately on targetDate change
    setTimeLeft(calculateTimeRemaining());

    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return timeLeft;
}
