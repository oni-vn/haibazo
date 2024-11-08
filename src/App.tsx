import { useCallback, useEffect, useState } from 'react';
import './App.css';
import ScreenGame from './components/Screen';
import {
    ResultGame,
    StatusAuto,
    StatusControl,
    StatusGame,
    STEP_COUNT_TIME,
} from './utils/const';

function App() {
    const [btnControl, setBtnControl] = useState<string>(StatusControl.PLAY);
    const [isAuto, setIsAuto] = useState<boolean>(false);
    const [point, setPoint] = useState<string>('5');

    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [resetCounter, setResetCounter] = useState<number>(0);

    const [result, setResult] = useState<ResultGame>(ResultGame.PENDING);
    const [nextIndex, setNextIndex] = useState<number>(1);

    const handlePlay = () => {
        setBtnControl(StatusControl.RESTART);
        setTime(0);
        setNextIndex(1);
        setIsRunning(true);
        setResult(ResultGame.PLAYING);
        setResetCounter((prev) => prev + 1);
    };

    const handleAutoPlay = () => {
        setIsAuto(!isAuto);
    };

    const handleChangePoint = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPoint(value);
        if (value == '' || btnControl == StatusControl.PLAY) {
            setTime(0);
            setIsRunning(false);
        } else {
            handlePlay();
        }
    };

    const handleResultChange = useCallback((newResult: ResultGame) => {
        setResult(newResult);
        setIsAuto(false);
    }, []);

    const handleNextIndexChange = useCallback((newIndex: number) => {
        setNextIndex(newIndex);
    }, []);

    useEffect(() => {
        let start: ReturnType<typeof setInterval>;

        if (isRunning && result == ResultGame.PLAYING) {
            start = setInterval(() => {
                setTime((prevTime) => prevTime + STEP_COUNT_TIME);
            }, 100);
        }

        return () => {
            clearInterval(start);
        };
    }, [isRunning, result]);

    return (
        <div className='wrapper'>
            <h4
                style={{
                    color:
                        result == ResultGame.WIN
                            ? 'green'
                            : result == ResultGame.LOSS
                            ? 'red'
                            : '',
                }}
            >
                {result == ResultGame.PENDING || result == ResultGame.PLAYING
                    ? StatusGame.PLAY
                    : result == ResultGame.WIN
                    ? StatusGame.CLEAR
                    : StatusGame.GAME_OVER}
            </h4>
            <div className='game_points'>
                <p>Points:</p>
                <input type='text' value={point} onChange={handleChangePoint} />
            </div>
            <div className='game_time'>
                <p>Time:</p>
                <p>{time.toFixed(1)}s</p>
            </div>
            <div className='game_control'>
                <button onClick={handlePlay}>{btnControl}</button>
                {btnControl == StatusControl.RESTART &&
                    result == ResultGame.PLAYING && (
                        <button onClick={handleAutoPlay}>
                            Auto play {isAuto ? StatusAuto.OFF : StatusAuto.ON}
                        </button>
                    )}
            </div>
            <ScreenGame
                key={resetCounter}
                points={Number(point)}
                isPlay={isRunning}
                result={result}
                isAuto={isAuto}
                onResultChange={handleResultChange}
                onNextIndexChange={handleNextIndexChange}
            />
            {result == ResultGame.PLAYING && <p>Next: {nextIndex}</p>}
        </div>
    );
}

export default App;
