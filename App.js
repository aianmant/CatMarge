import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useGameEngine } from './src/hooks/useGameEngine';
import { CatView } from './src/components/CatView';
import { CAT_TYPES, getCatEmoji } from './src/constants/cats';
import { GAME_WIDTH, GAME_HEIGHT, DANGER_LINE_Y } from './src/constants/game';

export default function App() {
  const { cats, score, gameOver, nextLevel, canDrop, dropCat, reset } = useGameEngine();

  const next = CAT_TYPES[nextLevel - 1];

  const handlePress = (e) => {
    dropCat(e.nativeEvent.locationX);
  };

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      {/* HUD */}
      <View style={[styles.hud, { width: GAME_WIDTH }]}>
        <Text style={styles.scoreText}>🏆 {score}</Text>
        <View style={[styles.nextBox, { borderColor: next.color }]}>
          <Text style={styles.nextLabel}>NEXT</Text>
          <Text style={styles.nextEmoji}>{getCatEmoji(nextLevel)}</Text>
          <Text style={styles.nextName}>{next.name}</Text>
        </View>
      </View>

      {/* Game Area */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        style={[styles.gameArea, { width: GAME_WIDTH, height: GAME_HEIGHT }]}
      >
        <View style={[styles.dangerLine, { top: DANGER_LINE_Y }]} />
        {cats.map(cat => (
          <CatView key={cat.id} cat={cat} />
        ))}
      </TouchableOpacity>

      {/* Game Over */}
      {gameOver && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.gameOverTitle}>ゲームオーバー</Text>
            <Text style={styles.finalScore}>スコア: {score}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={reset}>
              <Text style={styles.retryText}>もう一度 🐱</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    alignItems: 'center',
    paddingTop: 40,
  },
  hud: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  scoreText: {
    fontSize:   24,
    fontWeight: 'bold',
    color:      '#E75480',
  },
  nextBox: {
    alignItems:      'center',
    borderWidth:     2,
    borderRadius:    8,
    padding:         6,
    backgroundColor: '#fff',
    minWidth:        64,
  },
  nextLabel: {
    fontSize:    10,
    fontWeight:  'bold',
    color:       '#aaa',
    letterSpacing: 1,
  },
  nextEmoji: {
    fontSize: 26,
  },
  nextName: {
    fontSize:  11,
    color:     '#555',
    marginTop: 2,
  },
  gameArea: {
    backgroundColor: '#FFF0F3',
    borderWidth:     2,
    borderColor:     '#F8B4C8',
    borderRadius:    8,
    overflow:        'hidden',
  },
  dangerLine: {
    position:        'absolute',
    left:            0,
    right:           0,
    height:          2,
    backgroundColor: 'rgba(220,50,50,0.4)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent:  'center',
    alignItems:      'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius:    20,
    padding:         32,
    alignItems:      'center',
    width:           '80%',
    elevation:       10,
  },
  gameOverTitle: {
    fontSize:     28,
    fontWeight:   'bold',
    color:        '#E75480',
    marginBottom: 12,
  },
  finalScore: {
    fontSize:     22,
    color:        '#333',
    marginBottom: 24,
  },
  retryBtn: {
    backgroundColor:  '#FF85A1',
    paddingHorizontal: 32,
    paddingVertical:   14,
    borderRadius:      30,
  },
  retryText: {
    color:      '#fff',
    fontSize:   18,
    fontWeight: 'bold',
  },
});
