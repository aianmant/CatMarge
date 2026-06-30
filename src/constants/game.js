import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const GAME_WIDTH    = Math.min(width - 20, 380);
export const GAME_HEIGHT   = 560;
export const DANGER_LINE_Y = 70;
export const DROP_Y        = 30;
