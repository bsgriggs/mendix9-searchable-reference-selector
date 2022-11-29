import { RefObject, useEffect, useState } from "react";

export interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

export const mapPosition = (ref: HTMLDivElement | null): Position => {
    return ref !== null
        ? {
              x: ref.getBoundingClientRect().left,
              y: ref.getBoundingClientRect().top,
              w: ref.getBoundingClientRect().width,
              h: ref.getBoundingClientRect().height
          }
        : {
              x: 0,
              y: 0,
              w: 0,
              h: 0
          };
};

export default function usePositionUpdate(
    ref: RefObject<HTMLDivElement>,
    handler: (newPosition: Position) => void
): void {
    const [resizeObserver, setResizeObserver] = useState<ResizeObserver | null>(null);

    const resizeHandler = (): void => {
        handler(mapPosition(ref.current));
    };

    useEffect(() => {
        if (ref.current !== null) {
            const observer = new ResizeObserver(resizeHandler);
            observer.observe(ref.current);
            setResizeObserver(observer);

            // Find the nearest scroll container and add a listener to update the position
            let iteratorEle = ref.current.parentElement;
            // eslint-disable-next-line no-constant-condition
            while (true) {
                if (iteratorEle !== null) {
                    iteratorEle = iteratorEle.parentElement;
                    if (
                        iteratorEle !== null &&
                        (iteratorEle?.style.overflowY === "scroll" ||
                            iteratorEle?.style.overflowY === "auto" ||
                            iteratorEle.className === "mx-scrollcontainer-wrapper")
                    ) {
                        iteratorEle.addEventListener("scroll", () => resizeHandler());
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        return () => {
            resizeObserver?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
