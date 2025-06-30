import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";

  
type TimeProviderState = {
    everyMinute: Date
    everyHour: Date
}

type TimeProviderProps = {
    children: ReactNode
}

const TickProviderContext = createContext<TimeProviderState>({
    everyMinute: new Date(),
    everyHour: new Date(),
});

export function TickProvider({ children }: TimeProviderProps) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [current, setCurrentTime] = useState<TimeProviderState>({
        everyMinute: new Date(),
        everyHour: new Date(),
    });

    useEffect(() => {
        const scheduleNext = () => {
            const now = new Date();
            const next = new Date(now.getTime());
            next.setSeconds(1);
            next.setMilliseconds(0);
            if (now.getSeconds() >= 1) {
                // if we're past the 1st second, go to next minute
                next.setMinutes(now.getMinutes() + 1);
            }
            const delay = next.getTime() - now.getTime();

            const updateHour = now.getMinutes() === 0

            setCurrentTime({
                everyMinute: now,
                everyHour: updateHour ? now : current.everyHour,
            })
        
            timeoutRef.current = setTimeout(scheduleNext, delay);
        }

        scheduleNext()
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }
    }, [])

    return (
        <TickProviderContext.Provider value={{ ...current }}>
            {children}
        </TickProviderContext.Provider>
    );
}

export function useTickProvider() {
    const context = useContext(TickProviderContext);
    if (!context) {
        throw new Error("useTimeProvider must be used within a TimeProvider");
    }
    return context;
}
