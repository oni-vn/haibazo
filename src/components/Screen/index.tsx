/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ElementPosition,
    randomPosition,
    ResultGame,
    STEP_COUNT_TIME,
    TIME_CIRCLE_OUT,
} from '../../utils/const';
import './screen_game.css';

type GameInfoProps = {
    points: number;
    isPlay: boolean;
    result: ResultGame;
    isAuto: boolean;
    onResultChange: (result: ResultGame) => void;
    onNextIndexChange: (index: number) => void;
};

const ScreenGame = (props: GameInfoProps) => {
    const {
        points,
        isPlay,
        result,
        isAuto,
        onResultChange,
        onNextIndexChange,
    } = props;
    const screenRef = useRef<HTMLDivElement>(null);

    const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set());
    const [timeOuts, setTimeOuts] = useState<{ [key: number]: number }>({});
    const [elementsPosition, setElementsPosition] = useState<ElementPosition[]>(
        []
    );

    const handleSelectCircle = useCallback(
        (index: number) => {
            if (result !== ResultGame.PLAYING) return;

            setTimeOuts((prevTimeOuts) => ({
                ...prevTimeOuts,
                [index]: TIME_CIRCLE_OUT,
            }));

            setActiveIndices((prevIndices) => {
                const updatedIndices = new Set(prevIndices);
                if (prevIndices.size !== index) {
                    updatedIndices.add(index);
                    setTimeout(() => {
                        onResultChange(ResultGame.LOSS);
                    });
                } else {
                    updatedIndices.add(index);
                    setTimeout(() => {
                        onNextIndexChange(index + 2);
                    });
                }
                return updatedIndices;
            });
        },
        [result, onResultChange, onNextIndexChange]
    );

    // handle autoplay
    useEffect(() => {
        if (isAuto && result === ResultGame.PLAYING) {
            const interval = setInterval(() => {
                // Search circle not active
                const remainingIndices = Array.from(
                    { length: elementsPosition.length },
                    (_, index) => index
                ).filter((index) => !activeIndices.has(index));

                if (remainingIndices.length > 0) {
                    const smallestIndex = remainingIndices[0];
                    handleSelectCircle(smallestIndex);
                } else {
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isAuto, elementsPosition, activeIndices]);

    // get position for circle
    useEffect(() => {
        if (screenRef.current && isPlay && result === ResultGame.PLAYING) {
            const positionScreen = screenRef.current.getBoundingClientRect();
            const screenWidth = positionScreen.width;
            const screenHeight = positionScreen.height;

            const newElementsPositioin: ElementPosition[] = [];
            for (let i = 0; i < points; i++) {
                const { top, left } = randomPosition(
                    screenHeight,
                    screenWidth,
                    newElementsPositioin
                );
                newElementsPositioin.push({ top, left });
            }

            setElementsPosition(newElementsPositioin);
        }
    }, [isPlay, points, result]);

    // // run time out circle
    useEffect(() => {
        let start: ReturnType<typeof setInterval>;
        if (result == ResultGame.PLAYING) {
            start = setInterval(() => {
                let allTimeOutsCompleted = true;
                setTimeOuts((prevTimeOuts) => {
                    const updatedTimeOuts = { ...prevTimeOuts };
                    for (const index in updatedTimeOuts) {
                        if (updatedTimeOuts[index] > 0) {
                            updatedTimeOuts[index] -= STEP_COUNT_TIME;
                            allTimeOutsCompleted = false;
                        } else {
                            updatedTimeOuts[index] = 0;
                        }
                    }

                    // Check if is last circle
                    const lastCircleIndex = elementsPosition.length - 1;
                    if (updatedTimeOuts[lastCircleIndex] === 0) {
                        onResultChange(ResultGame.WIN);
                    }

                    return updatedTimeOuts;
                });

                if (allTimeOutsCompleted) {
                    clearInterval(start);
                }
            }, 100);
        }

        return () => {
            clearInterval(start);
        };
    }, [timeOuts, result]);

    return (
        <div ref={screenRef} className='game_screen'>
            {isPlay &&
                elementsPosition.map((e, index) => {
                    return (
                        <div
                            className={`circle ${
                                activeIndices.has(index) ? 'active' : ''
                            } ${
                                result === ResultGame.LOSS
                                    ? 'stop-animation'
                                    : ''
                            }`}
                            key={index}
                            style={{
                                top: e.top,
                                left: e.left,
                                zIndex: points - index,
                            }}
                            onClick={() => handleSelectCircle(index)}
                        >
                            <p>{index + 1}</p>
                            {activeIndices.has(index) && (
                                <p
                                    style={{
                                        color: '#fff',
                                    }}
                                >
                                    {timeOuts[index]?.toFixed(1)}s
                                </p>
                            )}
                        </div>
                    );
                })}
        </div>
    );
};

export default React.memo(ScreenGame);
