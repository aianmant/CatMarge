import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    <LinearGradient colors={['#FFD6E7', '#E8D5FF', '#D5E8FF']} style={styles.bg}>
      <StatusBar hidden />

      {/* Header */}
      <View style={[styles.header, { width: GAME_WIDTH }]}>
        {/* Score badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>SCORE</Text>
          <Text style={styles.badgeValue}>{score}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>🐱 CatMarge</Text>

        {/* Next preview */}
        <View style={styles.nextCard}>
          <Text style={styles.nextLabel}>NEXT</Text>
          <View style={[
            styles.nextCircle,
            { backgroundColor: next.color, width: 52, height: 52, borderRadius: 26 },
          ]}>
            <Text style={{ fontSize: 24 }}>{getCatEmoji(nextLevel)}</Text>
          </View>
          <Text style={styles.nextName}>{next.name}</Text>
        </View>
      </View>

      {/* Game area wrapper (elevation without overflow:hidden) */}
      <View style={[styles.gameAreaShadow, { width: GAME_WIDTH, height: GAME_HEIGHT }]}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handlePress}
          style={styles.gameArea}
        >
          <View style={[styles.dangerLine, { top: DANGER_LINE_Y }]} />
          {cats.map(cat => <CatView key={cat.id} cat={cat} />)}
        </TouchableOpacity>
      </View>

      {/* Game Over overlay */}
      {gameOver && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <LinearGradient colors={['#FF6B9D', '#C44DFF']} style={styles.modalTop}>
              <Text style={styles.goEmoji}>😿</Text>
              <Text style={styles.goTitle}>ゲームオーバー</Text>
            </LinearGradient>
            <View style={styles.modalBottom}>
              <Text style={styles.goScoreLabel}>SCORE</Text>
              <Text style={styles.goScore}>{score}</Text>
              <TouchableOpacity onPress={reset}>
                <LinearGradient colors={['#FF6B9D', '#C44DFF']} style={styles.retryBtn}>
                  <Text style={styles.retryText}>もう一度 🐱</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 44,
  },

  /* Header */
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   10,
    paddingHorizontal: 4,
  },
  badge: {
    backgroundColor: '#fff',
    borderRadius:    16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems:      'center',
    minWidth:        80,
    elevation:       4,
    shadowColor:     '#FF6B9D',
    shadowOffset:    { width: 0, height: 3 },
    shadowOpacity:   0.3,
    shadowRadius:    6,
  },
  badgeLabel: {
    fontSize:      9,
    fontWeight:    '800',
    color:         '#C44DFF',
    letterSpacing: 2,
  },
  badgeValue: {
    fontSize:   24,
    fontWeight: '900',
    color:      '#FF6B9D',
  },
  title: {
    fontSize:          20,
    fontWeight:        '900',
    color:             '#fff',
    textShadowColor:   'rgba(160,0,120,0.45)',
    textShadowOffset:  { width: 0, height: 2 },
    textShadowRadius:  6,
  },
  nextCard: {
    backgroundColor:  '#fff',
    borderRadius:     16,
    paddingVertical:  6,
    paddingHorizontal: 10,
    alignItems:       'center',
    minWidth:         80,
    elevation:        4,
    shadowColor:      '#C44DFF',
    shadowOffset:     { width: 0, height: 3 },
    shadowOpacity:    0.3,
    shadowRadius:     6,
  },
  nextLabel: {
    fontSize:      9,
    fontWeight:    '800',
    color:         '#C44DFF',
    letterSpacing: 2,
    marginBottom:  4,
  },
  nextCircle: {
    justifyContent: 'center',
    alignItems:     'center',
    borderWidth:    2.5,
    borderColor:    'rgba(0,0,0,0.1)',
  },
  nextName: {
    fontSize:   10,
    fontWeight: '700',
    color:      '#aaa',
    marginTop:  4,
  },

  /* Game area */
  gameAreaShadow: {
    borderRadius: 20,
    elevation:    10,
    shadowColor:  '#C44DFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  gameArea: {
    flex:            1,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth:     3,
    borderColor:     '#E879F9',
    borderRadius:    20,
    overflow:        'hidden',
  },
  dangerLine: {
    position:        'absolute',
    left:            0,
    right:           0,
    height:          2,
    backgroundColor: 'rgba(220,50,50,0.3)',
  },

  /* Game Over */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent:  'center',
    alignItems:      'center',
  },
  modal: {
    width:        '82%',
    borderRadius: 24,
    overflow:     'hidden',
    elevation:    16,
  },
  modalTop: {
    paddingVertical: 28,
    alignItems:      'center',
  },
  goEmoji: {
    fontSize: 54,
  },
  goTitle: {
    fontSize:   24,
    fontWeight: '900',
    color:      '#fff',
    marginTop:  6,
  },
  modalBottom: {
    backgroundColor:  '#fff',
    paddingVertical:  28,
    alignItems:       'center',
    paddingHorizontal: 24,
  },
  goScoreLabel: {
    fontSize:      11,
    fontWeight:    '800',
    color:         '#C44DFF',
    letterSpacing: 2,
    marginBottom:  4,
  },
  goScore: {
    fontSize:     56,
    fontWeight:   '900',
    color:        '#FF6B9D',
    marginBottom: 24,
  },
  retryBtn: {
    borderRadius:      30,
    paddingHorizontal: 40,
    paddingVertical:   14,
  },
  retryText: {
    color:      '#fff',
    fontSize:   18,
    fontWeight: '900',
  },
});
