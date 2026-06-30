import { useState, useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';
import { CAT_TYPES, getRandomDropLevel } from '../constants/cats';
import { GAME_WIDTH, GAME_HEIGHT, DANGER_LINE_Y, DROP_Y } from '../constants/game';

let _uid = 0;

function makeBody(x, y, level) {
  const body = Matter.Bodies.circle(x, y, CAT_TYPES[level - 1].radius, {
    restitution: 0.3,
    friction: 0.5,
    frictionAir: 0.01,
    density: 0.002,
  });
  body.catLevel = level;
  body.uid = ++_uid;
  return body;
}

function buildEngine() {
  const engine = Matter.Engine.create({ gravity: { y: 2 } });
  const W = GAME_WIDTH;
  const H = GAME_HEIGHT;
  Matter.Composite.add(engine.world, [
    Matter.Bodies.rectangle(W / 2, H + 10,   W + 40, 20,    { isStatic: true }),
    Matter.Bodies.rectangle(-10,   H / 2,     20,     H * 3, { isStatic: true }),
    Matter.Bodies.rectangle(W + 10, H / 2,   20,     H * 3, { isStatic: true }),
  ]);
  return engine;
}

function attachCollision(engine, mergingRef, pendingRef) {
  Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
    for (const { bodyA, bodyB } of pairs) {
      if (!bodyA.catLevel || !bodyB.catLevel) continue;
      if (bodyA.catLevel !== bodyB.catLevel) continue;
      if (bodyA.catLevel >= CAT_TYPES.length) continue;
      if (mergingRef.current.has(bodyA.id) || mergingRef.current.has(bodyB.id)) continue;
      mergingRef.current.add(bodyA.id);
      mergingRef.current.add(bodyB.id);
      pendingRef.current.push({ bodyA, bodyB, level: bodyA.catLevel });
    }
  });
}

export function useGameEngine() {
  const engineRef    = useRef(null);
  const rafRef       = useRef(null);
  const pendingRef   = useRef([]);
  const mergingRef   = useRef(new Set());
  const isRunningRef = useRef(false);
  const scoreRef     = useRef(0);
  const gameOverRef  = useRef(false);

  const [tick,      setTick]      = useState(0);
  const [score,     setScore]     = useState(0);
  const [gameOver,  setGameOver]  = useState(false);
  const [nextLevel, setNextLevel] = useState(getRandomDropLevel);
  const [canDrop,   setCanDrop]   = useState(true);

  const startLoop = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const step = () => {
      if (!isRunningRef.current) return;
      const engine = engineRef.current;
      Matter.Engine.update(engine, 1000 / 60);

      // Process merges
      for (const { bodyA, bodyB, level } of pendingRef.current.splice(0)) {
        const all = Matter.Composite.allBodies(engine.world);
        if (!all.find(b => b.id === bodyA.id) || !all.find(b => b.id === bodyB.id)) continue;

        const mx = (bodyA.position.x + bodyB.position.x) / 2;
        const my = (bodyA.position.y + bodyB.position.y) / 2;
        Matter.Composite.remove(engine.world, bodyA);
        Matter.Composite.remove(engine.world, bodyB);
        mergingRef.current.delete(bodyA.id);
        mergingRef.current.delete(bodyB.id);

        const newLevel = level + 1;
        Matter.Composite.add(engine.world, makeBody(mx, my, newLevel));
        scoreRef.current += CAT_TYPES[newLevel - 1].score;
        setScore(scoreRef.current);
      }

      // Game over check: cat above danger line with near-zero velocity
      const catBodies = Matter.Composite.allBodies(engine.world).filter(b => b.catLevel);
      const isOver = catBodies.some(b =>
        b.position.y - CAT_TYPES[b.catLevel - 1].radius < DANGER_LINE_Y &&
        Math.abs(b.velocity.y) < 0.5
      );
      if (isOver && !gameOverRef.current) {
        gameOverRef.current = true;
        isRunningRef.current = false;
        setGameOver(true);
        return;
      }

      setTick(t => t + 1);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, []);

  const stopLoop = useCallback(() => {
    isRunningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    _uid = 0;
    const engine = buildEngine();
    engineRef.current = engine;
    attachCollision(engine, mergingRef, pendingRef);
    startLoop();
    return () => {
      stopLoop();
      Matter.Events.off(engine);
      Matter.Engine.clear(engine);
    };
  }, []);

  const dropCat = useCallback((x) => {
    if (!canDrop || gameOverRef.current) return;
    const { radius } = CAT_TYPES[nextLevel - 1];
    const cx = Math.max(radius + 2, Math.min(GAME_WIDTH - radius - 2, x));
    Matter.Composite.add(engineRef.current.world, makeBody(cx, DROP_Y, nextLevel));
    setNextLevel(getRandomDropLevel());
    setCanDrop(false);
    setTimeout(() => setCanDrop(true), 600);
  }, [canDrop, nextLevel]);

  const reset = useCallback(() => {
    stopLoop();
    Matter.Events.off(engineRef.current);
    Matter.Engine.clear(engineRef.current);

    _uid = 0;
    pendingRef.current = [];
    mergingRef.current.clear();
    scoreRef.current = 0;
    gameOverRef.current = false;

    const engine = buildEngine();
    engineRef.current = engine;
    attachCollision(engine, mergingRef, pendingRef);

    setScore(0);
    setGameOver(false);
    setNextLevel(getRandomDropLevel());
    setCanDrop(true);
    setTimeout(() => startLoop(), 16);
  }, [startLoop, stopLoop]);

  const cats = engineRef.current
    ? Matter.Composite.allBodies(engineRef.current.world)
        .filter(b => b.catLevel)
        .map(b => ({
          id:    b.id,
          x:     b.position.x,
          y:     b.position.y,
          angle: b.angle,
          level: b.catLevel,
        }))
    : [];

  return { cats, score, gameOver, nextLevel, canDrop, dropCat, reset };
}
