import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CAT_TYPES, getCatEmoji } from '../constants/cats';

export function CatView({ cat }) {
  const { radius, color } = CAT_TYPES[cat.level - 1];
  const size = radius * 2;

  return (
    <View
      style={[
        styles.circle,
        {
          width:           size,
          height:          size,
          borderRadius:    radius,
          backgroundColor: color,
          left:            cat.x - radius,
          top:             cat.y - radius,
          transform:       [{ rotate: `${cat.angle}rad` }],
        },
      ]}
    >
      <Text style={{ fontSize: radius * 0.85 }}>{getCatEmoji(cat.level)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    position:       'absolute',
    justifyContent: 'center',
    alignItems:     'center',
    borderWidth:    2,
    borderColor:    'rgba(0,0,0,0.12)',
  },
});
