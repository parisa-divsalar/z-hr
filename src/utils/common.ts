import { TimeState } from '@/type/common';

export function convertSecondsToTime(totalSeconds: number): TimeState {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export function pad(num: number): string {
  return num < 10 ? `0${num}` : String(num);
}
