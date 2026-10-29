import { useEffect, useState } from "react";

const TIME_ZONE = "America/Argentina/Buenos_Aires";

const clockFormat = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
});

export const formatLocalTime = (date) => clockFormat.format(date);

export const localHour = (date) => Number(clockFormat.formatToParts(date).find((part) => part.type === "hour").value);

export function awakeGuess(date) {
    const hour = localHour(date);
    if (hour >= 3 && hour < 8) return "probably asleep";
    if (hour >= 23 || hour < 3) return "probably still awake";
    return "probably awake";
}

export function timeAgo(iso, now) {
    const minutes = Math.max(0, Math.round((now - new Date(iso)) / 60000));
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.round(hours / 24);
    if (days < 14) return `${days}d`;
    return `${Math.round(days / 7)}w`;
}

export const useNow = (interval = 1000) => {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), interval);
        return () => clearInterval(id);
    }, [interval]);
    return now;
};
