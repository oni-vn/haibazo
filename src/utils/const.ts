export const TIME_CIRCLE_OUT = 3;
export const STEP_COUNT_TIME = 0.1;

export enum StatusAuto {
    ON = 'ON',
    OFF = 'OFF',
}

export enum StatusControl {
    PLAY = 'Play',
    RESTART = 'Restart',
}

export enum ResultGame {
    WIN = 'WIN',
    LOSS = 'LOSS',
    PLAYING = 'PLAYING',
    PENDING = 'PENDING',
}

export enum StatusGame {
    PLAY = "LET'S PLAY",
    CLEAR = 'ALL CLEARED',
    GAME_OVER = 'GAME OVER',
}

export interface ElementPosition {
    top: number;
    left: number;
}

// Check xem position mới có chồng lên element nào không
const isOverlapping = (
    newTop: number,
    newLeft: number,
    elements: ElementPosition[]
) => {
    const elementSize = 40;
    return elements.some((element) => {
        return !(
            newLeft + elementSize <= element.left ||
            newLeft >= element.left + elementSize ||
            newTop + elementSize <= element.top ||
            newTop >= element.top + elementSize
        );
    });
};

export const randomPosition = (
    screenHeight: number,
    screenWidth: number,
    existingElements: ElementPosition[]
) => {
    const elementSize = 43;
    let randomTop, randomLeft;
    let attempts = 0;

    do {
        randomTop = Math.random() * (screenHeight - elementSize);
        randomLeft = Math.random() * (screenWidth - elementSize);
        attempts++;
    } while (
        isOverlapping(randomTop, randomLeft, existingElements) &&
        attempts < 100
    );

    return { top: randomTop, left: randomLeft };
};
