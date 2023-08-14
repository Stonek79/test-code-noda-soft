import {
    MutableRefObject,
    useCallback,
    useEffect,
    useRef
} from "react";

/**
 * Хук useThrottle принимает колбэк и время задержки, и возвращает новый колбэк,
 * который будет вызван только после истечения задержки после последнего вызова.
 * @param callback - Колбэк, выполнение которого нужно отложить.
 * @param delay - Время задержки в миллисекундах.
 * @returns Новый колбэк с задержкой.
 */

export const useThrottle = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T => {
    // Создаем ref для хранения идентификатора таймера
    const timerId = useRef() as MutableRefObject<any>

    // Создаем новый колбэк throttledCallback, который принимает те же аргументы, что и оригинальный callback.
    // Внутри этого колбэка происходит следующее:
    // Если таймер уже существует (то есть предыдущий вызов колбэка был сделан несколько миллисекунд назад),
    // сбрасываем его с помощью clearTimeout.
    // Устанавливаем новый таймер с задержкой delay. По истечении времени таймера вызывается оригинальный callback.
    // После выполнения колбэка сбрасываем timerId на null, чтобы подготовить его для следующего использования.
    const throttledCallback = useCallback((...args: Parameters<T>) => {
        if (timerId.current) {
            clearTimeout(timerId.current);
        }

        const newTimerId = setTimeout(
            () => {
            callback(...args);
            timerId.current = null;
            }, delay);

            timerId.current = newTimerId;
        },
        [callback, delay, timerId.current]
    );

    // С помощью useEffect очищаем таймер при размонтировании компонента.
    // Если таймер активен при размонтировании, он будет сброшен.
    useEffect(() => {
        return () => {
            if (timerId.current) {
                clearTimeout(timerId.current);
            }
        };
    }, [timerId.current]);

    return throttledCallback as T;
};
