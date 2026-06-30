export const CAT_TYPES = [
  { level: 1,  name: 'こねこ',         radius: 22, color: '#FF9AA2', score: 1  },
  { level: 2,  name: 'ちびにゃん',     radius: 30, color: '#FFB347', score: 3  },
  { level: 3,  name: 'たびー',         radius: 38, color: '#FDFD96', score: 6  },
  { level: 4,  name: 'みけ',           radius: 46, color: '#90EE90', score: 10 },
  { level: 5,  name: 'くろにゃん',     radius: 54, color: '#87CEEB', score: 15 },
  { level: 6,  name: 'しゃむ',         radius: 62, color: '#DDA0DD', score: 21 },
  { level: 7,  name: 'ペルシャ',       radius: 70, color: '#F4A460', score: 28 },
  { level: 8,  name: 'メインクーン',   radius: 78, color: '#98FB98', score: 36 },
  { level: 9,  name: 'ラグドール',     radius: 86, color: '#FFB6C1', score: 45 },
  { level: 10, name: 'キングキャット', radius: 94, color: '#FFD700', score: 55 },
];

const EMOJIS = ['🐱','😸','😺','🙀','😻','😼','🐈','🐈‍⬛','👑','🦁'];

export const getCatEmoji = (level) => EMOJIS[level - 1] ?? '🐱';

export const getRandomDropLevel = () => Math.ceil(Math.random() * 3);
