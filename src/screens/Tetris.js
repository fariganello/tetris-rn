import React, { useEffect, useState } from 'react';
import { GameEngine } from 'react-native-game-engine';
import { AntDesign, Feather } from '@expo/vector-icons';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Audio } from 'expo-av';
import Grid from '../components/Grid';
import Lines from '../components/Lines';
import Level from '../components/Level';
import Score from '../components/Score';
import Next from '../components/Next';
import Hold from '../components/Hold';
import GameOverModal from '../components/GameOverModal';
import PauseModal from '../components/PauseModal';
import HoldButton from '../components/HoldButton';
import {
  applyRotation,
  calculateScore,
  checkCollision,
  clearGrid,
  clearLines,
  createGrid,
  generateTetriminosBag,
  mergePiece,
  resetTetrimino,
  restartGame,
  resolveCollision,
  updateTetrimino,
  updateGrid,
} from '../logic';
import {
  BOTTOM_BAR_HEIGHT,
  LINES,
  LINES_TO_LEVELUP,
  MAX_COLUMNS,
  MAX_ROWS,
  SIDEBAR_WIDTH,
  SPEED_CHANGE,
  START_POSITION_X,
  START_POSITION_Y,
  START_UPDATE_FREQUENCY,
} from '../constants';

const windowWidth = Dimensions.get('window').width;
const cellWidth = (windowWidth - SIDEBAR_WIDTH * 2) / MAX_COLUMNS;
const gameHeight = cellWidth * MAX_ROWS;
const titleContainerHeight =
  Dimensions.get('window').height - gameHeight - BOTTOM_BAR_HEIGHT;

  const Tetris = () => {
  const initialBag = generateTetriminosBag();
  const initialTetrimino = initialBag.pop();
  const initialGrid = createGrid();

  const [running, setRunning] = useState(true);
  const [engine, setEngine] = useState(null);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [next, setNext] = useState(initialBag[initialBag.length - 1][0]);
  const [hold, setHold] = useState([]);
  const [holdPosible, setHoldPosible] = useState(true);
  const [gameOverModalVisible, setGameOverModalVisible] = useState(false);
  const [pauseModalVisible, setPauseModalVisible] = useState(false);
  const [musicPlayingStatus, setMusicPlayingStatus] = useState('nosound');
  const [musicTrack, setMusicTrack] = useState(null);

  const onEvent = (e) => {
    if (e.type === 'game-over') {
      setRunning(false);
      setGameOverModalVisible(true);
    }
    if (e.type === 'start-game') {
      setRunning(true);
      handlePlayMusic('music', true);
    }
  };

  useEffect(() => {
    engine && engine.dispatch({ type: 'start-game' });
  }, [engine]);

  const handlePlaySound = async (file) => {
    const soundObject = new Audio.Sound();
    const paths = {
      rotate: require('../../assets/rotate-sound.mp3'),
      move: require('../../assets/rotate-sound.mp3'),
      'hard-drop': require('../../assets/hard-drop.mp3'),
    };
    try {
      await soundObject.loadAsync(paths[file]);
      await soundObject
        .playAsync()
        .then(async (playbackStatus) => {
          setTimeout(() => {
            soundObject.unloadAsync();
          }, playbackStatus.playableDurationMillis);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const updateScreenForSoundStatus = (status) => {
    if (status.isPlaying && musicPlayingStatus !== 'playing') {
      setMusicPlayingStatus('playing');
    } else if (!status.isPlaying && musicPlayingStatus === 'playing') {
      setMusicPlayingStatus('donepause');
    }
  };

  const handlePlayMusic = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/Korobeiniki.mp3'),
      {
        shouldPlay: true,
        isLooping: true,
      },
      updateScreenForSoundStatus
    );
    setMusicTrack(sound);
    setMusicPlayingStatus('playing');
  };

  const pauseAndPlayRecording = async () => {
    if (musicTrack != null) {
      if (musicPlayingStatus === 'playing') {
        await musicTrack.pauseAsync();
        setMusicPlayingStatus('donepause');
      } else {
        await musicTrack.playAsync();
        setMusicPlayingStatus('playing');
      }
    }
  };

  const updateHandler = (entities, { touches, dispatch, events }) => {
    if (events.find((event) => event.type === 'restart-game')) {
      entities = restartGame(setHold, setNext, setLines, setLevel, setScore);
    }

    let { screen, tetrimino, tetriminosBag, game } = entities;
    const { grid } = screen;
    const { lines, level, score } = game;
    const {
      shapes,
      orientation,
      coordinates,
      collisioned,
      nextMove,
      updateFrequency,
      keepLeft,
      keepRight,
    } = tetrimino;

    let dirX = 0;
    let dirY = 0;

    if (events.find((event) => event.type === 'move-left-stop')) {
      tetrimino.keepLeft = false;
    }
    if (events.find((event) => event.type === 'move-right-stop')) {
      tetrimino.keepRight = false;
    }

    if (
      tetrimino.keepLeft &&
      events.find((event) => event.type === 'move-continued-left')
    ) {
      dirX = -1;
      dirY = 0;

      tetrimino = resolveCollision(
        tetrimino,
        grid,
        game,
        dirX,
        dirY,
        setScore,
        handlePlaySound,
        dispatch,
        { type: 'move-continued-left' }
      );
    } else if (
      tetrimino.keepRight &&
      events.find((event) => event.type === 'move-continued-right')
    ) {
      dirX = 1;
      dirY = 0;

      tetrimino = resolveCollision(
        tetrimino,
        grid,
        game,
        dirX,
        dirY,
        setScore,
        handlePlaySound,
        dispatch,
        { type: 'move-continued-right' }
      );
    }

    if (events.find((event) => event.type === 'move-left')) {
      dirX = -1;
      dirY = 0;
      if (!events.some((event) => event.type === 'move-left-stop')) {
        tetrimino.keepLeft = true;
      }

      tetrimino = resolveCollision(
        tetrimino,
        grid,
        game,
        dirX,
        dirY,
        setScore,
        handlePlaySound,
        dispatch,
        { type: 'move-continued-left' },
        'keepLeft'
      );
    } else if (events.find((event) => event.type === 'move-right')) {
      dirX = 1;
      dirY = 0;
      if (!events.some((event) => event.type === 'move-right-stop')) {
        tetrimino.keepRight = true;
      }

      tetrimino = resolveCollision(
        tetrimino,
        grid,
        game,
        dirX,
        dirY,
        setScore,
        handlePlaySound,
        dispatch,
        { type: 'move-continued-right' },
        'keepRight'
      );
    }

    if (events.find((event) => event.type === 'move-down')) {
      dirX = 0;
      dirY = 1;

      tetrimino = resolveCollision(
        tetrimino,
        grid,
        game,
        dirX,
        dirY,
        setScore,
        null,
        dispatch,
        { type: 'game-over' }
      );
    }

    if (events.length) {
      for (let i = 0; i < events.length; i++) {
        if (/^rotate/.test(events[i].type)) {
          tetrimino = applyRotation(tetrimino, grid, events[i].type);
          handlePlaySound('rotate');
        }

        if (events[i].type === 'hard-drop') {
          let cellsMoved = 0;
          while (
            !checkCollision(tetrimino, orientation, grid, {
              moveX: 0,
              moveY: 1,
            })
          ) {
            cellsMoved++;
            tetrimino = updateTetrimino(tetrimino, 0, 1, orientation);
          }
          const newScore = calculateScore('hardDrop', level, cellsMoved);
          game.score = game.score + newScore;
          setScore(game.score);
          tetrimino.collisioned = true;
        }

        if (events[i].type === 'hold') {
          if (holdPosible) {
            const holdTetrimino = hold;
            setHold(tetrimino.shapes);
            const newTetrimino = holdTetrimino.length
              ? holdTetrimino
              : tetriminosBag.pop();
            tetrimino = resetTetrimino(
              tetrimino,
              newTetrimino,
              START_POSITION_X,
              START_POSITION_Y,
              0
            );
            setHoldPosible(false);
          }
        }
      }
    }
    tetrimino.nextMove--;

    if (tetriminosBag.length <= 2) {
      tetriminosBag = [...generateTetriminosBag(), ...tetriminosBag];
    }

    if (nextMove <= 0) {
      tetrimino.nextMove = updateFrequency;

      dispatch({ type: 'move-down' });
    }

    if (!collisioned) {
      screen.grid = clearGrid(grid);

      // const move = touches.find((x) => x.type === 'move');

      // if (move) {
      //   const dirX = move && move.delta.pageX > 0 ? 1 : -1;

      //   if (dirX < 0) {
      //     dispatch({ type: 'move-left' });
      //   } else {
      //     dispatch({ type: 'move-right' });
      //   }
      // }

      const press = touches.find((x) => x.type === 'press');

      if (press) {
        dispatch({ type: 'rotate-clockwise' });
      }

      screen.grid = updateGrid(tetrimino, grid);
    } else {
      screen.grid = mergePiece(tetrimino, grid);

      const clearedLines = clearLines(screen);
      if (clearedLines) {
        game.lines = lines + clearedLines;
        setLines(game.lines);
        const newScore = calculateScore(LINES[clearedLines - 1], game.level);
        game.score = game.score + newScore;
        setScore(game.score);
      }

      const newLevel = Math.ceil((game.lines + 1) / LINES_TO_LEVELUP);
      if (newLevel !== game.level) {
        game.level = newLevel;
        setLevel(game.level);
        tetrimino.updateFrequency =
          START_UPDATE_FREQUENCY - SPEED_CHANGE * game.level;
      }

      tetrimino.collisioned = false;
      const newTetrimino = tetriminosBag.pop();
      tetrimino = resetTetrimino(
        tetrimino,
        newTetrimino,
        START_POSITION_X,
        START_POSITION_Y,
        0
      );
      setNext(tetriminosBag[tetriminosBag.length - 1][0]);
      setHoldPosible(true);
    }

    return {
      screen,
      tetrimino,
      tetriminosBag,
      game,
      hold,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.gameTitleContainer}>
        <Text style={styles.gameTitle}>TETRIS</Text>
      </View>
      <View style={styles.topContainer}>
        <View style={styles.sideBar}>
          <HoldButton
            title={'HOLD'}
            onPress={() => {
              engine.dispatch({ type: 'hold' });
            }}
          />
          <TouchableOpacity
            style={styles.pauseButton}
            onPress={() => {
              if (!gameOverModalVisible) {
                setPauseModalVisible(true);
                setRunning(false);
                pauseAndPlayRecording();
              }
            }}
          >
            <AntDesign name="pause" size={50} color="black" />
          </TouchableOpacity>
        </View>
        <GameEngine
          style={styles.gameContainer}
          ref={(ref) => setEngine(ref)}
          systems={[updateHandler]}
          entities={{
            tetrimino: {
              shapes: initialTetrimino,
              orientation: 0,
              coordinates: { x: START_POSITION_X, y: START_POSITION_Y },
              collisioned: false,
              nextMove: 10,
              updateFrequency: START_UPDATE_FREQUENCY,
              keepLeft: false,
              keepRight: false,
            },
            tetriminosBag: initialBag,
            game: { lines: 0, level: 1, score: 0 },
            screen: { grid: initialGrid, renderer: <Grid /> },
          }}
          onEvent={onEvent}
          running={running}
        >
          <StatusBar hidden={true} />
          <Hold hold={hold} />
          <Next next={next} />
          <Score score={score ? score : 0} />
          <Level level={level ? level : 0} />
          <Lines linesCounter={lines ? lines : 0} />
        </GameEngine>
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            engine.dispatch({ type: 'rotate-clockwise' });
          }}
        >
          <AntDesign
            style={{ transform: [{ rotateY: '180deg' }] }}
            name="back"
            size={50}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPressIn={() => {
            engine.dispatch({ type: 'move-left' });
          }}
          onPressOut={() => {
            engine.dispatch({ type: 'move-left-stop' });
          }}
        >
          <Feather name="arrow-left" size={50} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            engine.dispatch({ type: 'move-down' });
          }}
          onLongPress={() => {
            handlePlaySound('hard-drop');
            engine.dispatch({ type: 'hard-drop' });
          }}
        >
          <Feather name="arrow-down" size={50} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPressIn={() => {
            engine.dispatch({ type: 'move-right' });
          }}
          onPressOut={() => {
            engine.dispatch({ type: 'move-right-stop' });
          }}
        >
          <Feather name="arrow-right" size={50} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            engine.dispatch({ type: 'rotate-counter-clockwise' });
          }}
        >
          <AntDesign name="back" size={50} color="black" />
        </TouchableOpacity>
        <GameOverModal
          gameOverModalVisible={gameOverModalVisible}
          setGameOverModalVisible={setGameOverModalVisible}
          setRunning={setRunning}
          engine={engine}
        />
        <PauseModal
          pauseModalVisible={pauseModalVisible}
          setPauseModalVisible={setPauseModalVisible}
          running={running}
          setRunning={setRunning}
          pauseAndPlayRecording={pauseAndPlayRecording}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  topContainer: {
    flex: 1,
    maxHeight: gameHeight,
    flexDirection: 'row',
    backgroundColor: 'grey',
  },
  sideBar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: 'red',
  },
  gameTitleContainer: {
    flex: 1,
    alignSelf: 'stretch',
    maxHeight: titleContainerHeight,
    justifyContent: 'center',
  },
  gameTitle: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
  },
  bottomBar: {
    flex: 1,
    maxHeight: BOTTOM_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: 'black',
    borderTopWidth: 1,
  },
  buttonContainer: {
    flex: 1,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContainer: {
    marginRight: SIDEBAR_WIDTH,
    backgroundColor: 'yellow',
  },
  pauseButton: {
    position: 'absolute',
    left: 15,
    bottom: 90,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Tetris;
