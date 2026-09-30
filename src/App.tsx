import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Tv, Play, Pause, RotateCcw, Shield, Zap, Crosshair } from 'lucide-react';

// Web Audio API Retro Sound Effects Generator (Zero Audio Files Needed)
class SoundEngine {
  ctx: AudioContext | null = null;
  enabled: boolean = true;
  marchNotes: number[] = [160, 140, 120, 100];
  marchIndex: number = 0;

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playLaser() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playAlienExplode() {
    if (!this.enabled || !this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.15);
  }

  playPlayerExplode() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playMarchStep() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const freq = this.marchNotes[this.marchIndex];
    this.marchIndex = (this.marchIndex + 1) % this.marchNotes.length;

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playUfoSiren() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(750, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playBunkerHit() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playPowerUp() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }
}

const sound = new SoundEngine();

// Pixel Art Bitmaps
const SPRITES = {
  squid: [
    [
      [0,0,0,1,1,0,0,0],
      [0,0,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,0],
      [1,1,0,1,1,0,1,1],
      [1,1,1,1,1,1,1,1],
      [0,0,1,0,0,1,0,0],
      [0,1,0,1,1,0,1,0],
      [1,0,1,0,0,1,0,1]
    ],
    [
      [0,0,0,1,1,0,0,0],
      [0,0,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,0],
      [1,1,0,1,1,0,1,1],
      [1,1,1,1,1,1,1,1],
      [0,1,0,1,1,0,1,0],
      [1,0,0,0,0,0,0,1],
      [0,1,0,0,0,0,1,0]
    ]
  ],
  crab: [
    [
      [0,0,1,0,0,0,1,0,0],
      [0,0,0,1,0,1,0,0,0],
      [0,0,1,1,1,1,1,0,0],
      [0,1,1,0,1,0,1,1,0],
      [1,1,1,1,1,1,1,1,1],
      [1,0,1,1,1,1,1,0,1],
      [1,0,1,0,0,0,1,0,1],
      [0,0,0,1,1,1,0,0,0]
    ],
    [
      [0,0,1,0,0,0,1,0,0],
      [1,0,0,1,0,1,0,0,1],
      [1,0,1,1,1,1,1,0,1],
      [1,1,1,0,1,0,1,1,1],
      [1,1,1,1,1,1,1,1,1],
      [0,0,1,1,1,1,1,0,0],
      [0,0,1,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,1,0]
    ]
  ],
  jelly: [
    [
      [0,0,0,1,1,1,1,0,0,0],
      [0,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,0,1,1,0,0,1],
      [1,1,1,1,1,1,1,1,1,1],
      [0,0,1,1,0,0,1,1,0,0],
      [0,1,1,0,1,1,0,1,1,0],
      [1,1,0,0,0,0,0,0,1,1]
    ],
    [
      [0,0,0,1,1,1,1,0,0,0],
      [0,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,1,1,1,1],
      [1,1,1,0,0,1,1,0,0,1],
      [1,1,1,1,1,1,1,1,1,1],
      [0,0,0,1,1,1,1,0,0,0],
      [0,0,1,1,0,0,1,1,0,0],
      [0,1,1,0,0,0,0,1,1,0]
    ]
  ],
  player: [
    [0,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1]
  ],
  ufo: [
    [0,0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,1,0,0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0,0,0,1,0,0,0]
  ]
};

const CANVAS_WIDTH = 448;
const CANVAS_HEIGHT = 512;

type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';
type DifficultyMode = 'CLASSIC' | 'TURBO' | 'HARDCORE';
type ActiveTab = 'CABINET' | 'SCORES' | 'MANUAL';

interface Alien {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'squid' | 'crab' | 'jelly';
  points: number;
  color: string;
  alive: boolean;
  row: number;
  col: number;
}

interface Laser {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface FloatingScore {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface PowerUpDrop {
  x: number;
  y: number;
  type: 'TWIN_LASER' | 'BUNKER_REPAIR' | 'EXTRA_LIFE';
  color: string;
  label: string;
}

interface ScoreLogItem {
  id: string;
  score: number;
  wave: number;
  difficulty: DifficultyMode;
  date: string;
}

// Helper component to render pixel matrix in UI legend
function PixelSpritePreview({
  matrix,
  color,
  scale = 3,
}: {
  matrix: number[][];
  color: string;
  scale?: number;
}) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  return (
    <svg
      width={cols * scale}
      height={rows * scale}
      viewBox={`0 0 ${cols} ${rows}`}
      className="shrink-0"
    >
      {matrix.map((row, rIdx) =>
        row.map((val, cIdx) =>
          val === 1 ? (
            <rect
              key={`${rIdx}-${cIdx}`}
              x={cIdx}
              y={rIdx}
              width={1}
              height={1}
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // React UI state synced with canvas loop
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() =>
    parseInt(localStorage.getItem('space_invaders_high_score') || '0', 10)
  );
  const [wave, setWave] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [aliensRemaining, setAliensRemaining] = useState<number>(55);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<DifficultyMode>('CLASSIC');
  const [activeTab, setActiveTab] = useState<ActiveTab>('CABINET');
  const [twinLaserTimer, setTwinLaserTimer] = useState<number>(0);
  const [shotsFired, setShotsFired] = useState<number>(0);
  const [shotsHit, setShotsHit] = useState<number>(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreLogItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('space_invaders_score_history') || '[]');
    } catch {
      return [];
    }
  });

  // Mutable game engine ref so the 60fps requestAnimationFrame loop never stutters
  const engineRef = useRef({
    gameState: 'START' as GameState,
    difficulty: 'CLASSIC' as DifficultyMode,
    score: 0,
    highScore: parseInt(localStorage.getItem('space_invaders_high_score') || '0', 10),
    wave: 1,
    lives: 3,
    frames: 0,
    shotsFired: 0,
    shotsHit: 0,
    twinLaserTicks: 0,
    keys: {
      left: false,
      right: false,
      fire: false,
    },
    player: {
      x: CANVAS_WIDTH / 2 - 11,
      y: CANVAS_HEIGHT - 40,
      width: 22,
      height: 14,
      speed: 2.5,
      isExploding: false,
      explodeTimer: 0,
      respawnTimer: 0,
    },
    playerLasers: [] as Laser[],
    alienLasers: [] as Laser[],
    particles: [] as Particle[],
    floatingScores: [] as FloatingScore[],
    powerUps: [] as PowerUpDrop[],
    alienSwarm: {
      aliens: [] as Alien[],
      direction: 1,
      moveDownNext: false,
      stepTimer: 0,
      stepInterval: 45,
      animFrame: 0,
    },
    ufo: {
      x: -40,
      y: 45,
      width: 26,
      height: 14,
      speed: 1.5,
      active: false,
      spawnTimer: 0,
    },
    bunkers: [] as { pixels: { x: number; y: number; active: boolean }[] }[],
    stars: [] as { x: number; y: number; size: number; alpha: number }[],
  });

  const initStarfield = useCallback(() => {
    const stars = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: Math.random() < 0.2 ? 2 : 1,
        alpha: Math.random(),
      });
    }
    engineRef.current.stars = stars;
  }, []);

  const initBunkers = useCallback(() => {
    const items: { pixels: { x: number; y: number; active: boolean }[] }[] = [];
    const bunkerWidth = 44;
    const bunkerHeight = 32;
    const spacing = (CANVAS_WIDTH - 4 * bunkerWidth) / 5;

    for (let i = 0; i < 4; i++) {
      const startX = spacing + i * (bunkerWidth + spacing);
      const startY = CANVAS_HEIGHT - 110;
      const pixels: { x: number; y: number; active: boolean }[] = [];

      for (let py = 0; py < bunkerHeight; py++) {
        for (let px = 0; px < bunkerWidth; px++) {
          const isArch = py > 18 && px > 12 && px < 32;
          const isCorner = py < 6 && (px < 6 - py || px > bunkerWidth - 7 + py);
          if (!isArch && !isCorner) {
            pixels.push({
              x: startX + px,
              y: startY + py,
              active: true,
            });
          }
        }
      }
      items.push({ pixels });
    }
    engineRef.current.bunkers = items;
  }, []);

  const initSwarm = useCallback((waveNum: number, diff: DifficultyMode) => {
    const swarm = engineRef.current.alienSwarm;
    swarm.aliens = [];
    swarm.direction = 1;
    swarm.moveDownNext = false;
    const baseSpeed = diff === 'HARDCORE' ? 32 : diff === 'TURBO' ? 38 : 45;
    swarm.stepInterval = Math.max(8, baseSpeed - (waveNum - 1) * 5);
    swarm.animFrame = 0;
    swarm.stepTimer = 0;

    const startX = 30;
    const startY = 80 + Math.min(60, (waveNum - 1) * 12);

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 11; col++) {
        let type: 'squid' | 'crab' | 'jelly' = 'jelly';
        let pts = 10;
        let color = '#22c55e';

        if (row === 0) {
          type = 'squid';
          pts = 30;
          color = '#c084fc';
        } else if (row === 1 || row === 2) {
          type = 'crab';
          pts = 20;
          color = '#38bdf8';
        }

        swarm.aliens.push({
          x: startX + col * 32,
          y: startY + row * 26,
          width: type === 'squid' ? 16 : type === 'crab' ? 18 : 20,
          height: 16,
          type,
          points: pts,
          color,
          alive: true,
          row,
          col,
        });
      }
    }
    setAliensRemaining(55);
  }, []);

  const triggerGameOver = useCallback(() => {
    const eng = engineRef.current;
    eng.gameState = 'GAMEOVER';
    setGameState('GAMEOVER');
    sound.playPlayerExplode();

    if (eng.score > eng.highScore) {
      eng.highScore = eng.score;
      setHighScore(eng.score);
      localStorage.setItem('space_invaders_high_score', String(eng.score));
    }

    if (eng.score > 0) {
      const entry: ScoreLogItem = {
        id: `${Date.now()}`,
        score: eng.score,
        wave: eng.wave,
        difficulty: eng.difficulty,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setScoreHistory((prev) => {
        const updated = [entry, ...prev].sort((a, b) => b.score - a.score).slice(0, 8);
        localStorage.setItem('space_invaders_score_history', JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  const resetGame = useCallback(
    (selectedDiff?: DifficultyMode) => {
      sound.init();
      const eng = engineRef.current;
      const diffToUse = selectedDiff || eng.difficulty;
      eng.difficulty = diffToUse;
      eng.score = 0;
      eng.lives = diffToUse === 'HARDCORE' ? 2 : 3;
      eng.wave = 1;
      eng.shotsFired = 0;
      eng.shotsHit = 0;
      eng.twinLaserTicks = 0;
      eng.playerLasers = [];
      eng.alienLasers = [];
      eng.particles = [];
      eng.floatingScores = [];
      eng.powerUps = [];
      eng.player.x = CANVAS_WIDTH / 2 - 11;
      eng.player.isExploding = false;
      eng.player.explodeTimer = 0;
      eng.player.respawnTimer = 0;
      eng.ufo.active = false;
      eng.ufo.spawnTimer = 0;

      initStarfield();
      initBunkers();
      initSwarm(1, diffToUse);

      eng.gameState = 'PLAYING';
      setScore(0);
      setLives(eng.lives);
      setWave(1);
      setShotsFired(0);
      setShotsHit(0);
      setTwinLaserTimer(0);
      setGameState('PLAYING');
      setActiveTab('CABINET');
    },
    [initBunkers, initStarfield, initSwarm]
  );

  const firePlayerLaser = useCallback(() => {
    const eng = engineRef.current;
    if (eng.gameState !== 'PLAYING' || eng.player.isExploding) return;

    const maxLasers = eng.twinLaserTicks > 0 ? 4 : 2;
    if (eng.playerLasers.length < maxLasers) {
      if (eng.twinLaserTicks > 0) {
        eng.playerLasers.push(
          {
            x: eng.player.x + 2,
            y: eng.player.y - 6,
            width: 2,
            height: 8,
            speed: 6.5,
          },
          {
            x: eng.player.x + eng.player.width - 4,
            y: eng.player.y - 6,
            width: 2,
            height: 8,
            speed: 6.5,
          }
        );
        eng.shotsFired += 2;
      } else {
        eng.playerLasers.push({
          x: eng.player.x + eng.player.width / 2 - 1,
          y: eng.player.y - 6,
          width: 2,
          height: 8,
          speed: 6,
        });
        eng.shotsFired += 1;
      }
      setShotsFired(eng.shotsFired);
      sound.playLaser();
    }
  }, []);

  const togglePause = useCallback(() => {
    const eng = engineRef.current;
    if (eng.gameState === 'PLAYING') {
      eng.gameState = 'PAUSED';
      setGameState('PAUSED');
    } else if (eng.gameState === 'PAUSED') {
      eng.gameState = 'PLAYING';
      setGameState('PLAYING');
    }
  }, []);

  const toggleSound = useCallback(() => {
    sound.init();
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
  }, []);

  const changeDifficulty = useCallback((newDiff: DifficultyMode) => {
    setDifficulty(newDiff);
    engineRef.current.difficulty = newDiff;
  }, []);

  // Main Canvas Game Loop
  useEffect(() => {
    initStarfield();
    initBunkers();
    initSwarm(1, 'CLASSIC');

    let animationFrameId: number;

    const drawSprite = (
      ctx: CanvasRenderingContext2D,
      matrix: number[][],
      x: number,
      y: number,
      scale = 2,
      color = '#ffffff'
    ) => {
      ctx.fillStyle = color;
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c] === 1) {
            ctx.fillRect(x + c * scale, y + r * scale, scale, scale);
          }
        }
      }
    };

    const createExplosion = (x: number, y: number, color = '#f59e0b', count = 12) => {
      for (let i = 0; i < count; i++) {
        engineRef.current.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 20 + Math.random() * 10,
          color,
        });
      }
    };

    const damageBunkerCircle = (hitX: number, hitY: number, radius: number) => {
      let hitAny = false;
      engineRef.current.bunkers.forEach((bunker) => {
        bunker.pixels.forEach((p) => {
          if (p.active) {
            const dx = p.x - hitX;
            const dy = p.y - hitY;
            if (dx * dx + dy * dy <= radius * radius) {
              p.active = false;
              hitAny = true;
            }
          }
        });
      });
      if (hitAny) sound.playBunkerHit();
      return hitAny;
    };

    const repairBunkers = () => {
      engineRef.current.bunkers.forEach((bunker) => {
        bunker.pixels.forEach((p) => {
          if (!p.active && Math.random() < 0.65) {
            p.active = true;
          }
        });
      });
    };

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const eng = engineRef.current;
      eng.frames++;

      // Clear frame
      ctx.fillStyle = '#05050a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw starfield
      eng.stars.forEach((s) => {
        s.alpha += (Math.random() - 0.5) * 0.05;
        if (s.alpha < 0.2) s.alpha = 0.2;
        if (s.alpha > 1) s.alpha = 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });

      if (eng.gameState === 'PLAYING' || eng.gameState === 'PAUSED') {
        // Draw Bunkers
        ctx.fillStyle = '#22c55e';
        eng.bunkers.forEach((bunker) => {
          bunker.pixels.forEach((p) => {
            if (p.active) {
              ctx.fillRect(p.x, p.y, 1, 1);
            }
          });
        });

        // Draw UFO
        if (eng.ufo.active) {
          drawSprite(ctx, SPRITES.ufo, eng.ufo.x, eng.ufo.y, 2, '#ef4444');
        }

        // Draw Alien Swarm
        eng.alienSwarm.aliens.forEach((a) => {
          if (!a.alive) return;
          const spriteData = SPRITES[a.type][eng.alienSwarm.animFrame];
          drawSprite(ctx, spriteData, a.x, a.y, 2, a.color);
        });

        // Draw Player
        if (eng.player.isExploding) {
          ctx.fillStyle = eng.frames % 4 < 2 ? '#ef4444' : '#f59e0b';
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 + eng.frames * 0.1;
            const dist = eng.player.explodeTimer % 20;
            const px = eng.player.x + eng.player.width / 2 + Math.cos(angle) * dist;
            const py = eng.player.y + eng.player.height / 2 + Math.sin(angle) * dist;
            ctx.fillRect(px, py, 3, 3);
          }
        } else if (!(eng.player.respawnTimer > 0 && Math.floor(eng.frames / 4) % 2 === 0)) {
          const shipColor = eng.twinLaserTicks > 0 ? '#38bdf8' : '#22c55e';
          drawSprite(ctx, SPRITES.player, eng.player.x, eng.player.y, 2, shipColor);
        }

        // Draw & Update Projectiles if Playing
        for (let i = eng.playerLasers.length - 1; i >= 0; i--) {
          const l = eng.playerLasers[i];
          if (eng.gameState === 'PLAYING') {
            l.y -= l.speed;
          }

          ctx.fillStyle = eng.twinLaserTicks > 0 ? '#38bdf8' : '#facc15';
          ctx.fillRect(l.x, l.y, l.width, l.height);

          if (eng.gameState === 'PLAYING') {
            let laserDestroyed = false;

            // Laser vs Alien Swarm
            for (let j = 0; j < eng.alienSwarm.aliens.length; j++) {
              const a = eng.alienSwarm.aliens[j];
              if (
                a.alive &&
                l.x < a.x + a.width &&
                l.x + l.width > a.x &&
                l.y < a.y + a.height &&
                l.y + l.height > a.y
              ) {
                a.alive = false;
                eng.score += a.points;
                eng.shotsHit += 1;
                setScore(eng.score);
                setShotsHit(eng.shotsHit);
                if (eng.score > eng.highScore) {
                  eng.highScore = eng.score;
                  setHighScore(eng.score);
                  localStorage.setItem('space_invaders_high_score', String(eng.score));
                }
                const remaining = eng.alienSwarm.aliens.filter((al) => al.alive).length;
                setAliensRemaining(remaining);

                createExplosion(a.x + a.width / 2, a.y + a.height / 2, a.color);
                sound.playAlienExplode();
                laserDestroyed = true;
                break;
              }
            }

            // Laser vs Mystery UFO
            if (
              !laserDestroyed &&
              eng.ufo.active &&
              l.x < eng.ufo.x + eng.ufo.width &&
              l.x + l.width > eng.ufo.x &&
              l.y < eng.ufo.y + eng.ufo.height &&
              l.y + l.height > eng.ufo.y
            ) {
              eng.ufo.active = false;
              const bonusPts = [100, 150, 200, 300][Math.floor(Math.random() * 4)];
              eng.score += bonusPts;
              eng.shotsHit += 1;
              setScore(eng.score);
              setShotsHit(eng.shotsHit);
              if (eng.score > eng.highScore) {
                eng.highScore = eng.score;
                setHighScore(eng.score);
                localStorage.setItem('space_invaders_high_score', String(eng.score));
              }

              eng.floatingScores.push({
                x: eng.ufo.x,
                y: eng.ufo.y + 10,
                text: `+${bonusPts}`,
                color: '#facc15',
                life: 45,
              });

              // Drop a tactical power-up capsule from destroyed UFO
              const dropRoll = Math.random();
              const dropType =
                dropRoll < 0.5 ? 'TWIN_LASER' : dropRoll < 0.85 ? 'BUNKER_REPAIR' : 'EXTRA_LIFE';
              eng.powerUps.push({
                x: eng.ufo.x + eng.ufo.width / 2 - 6,
                y: eng.ufo.y + 10,
                type: dropType,
                color:
                  dropType === 'TWIN_LASER'
                    ? '#38bdf8'
                    : dropType === 'BUNKER_REPAIR'
                    ? '#22c55e'
                    : '#f43f5e',
                label:
                  dropType === 'TWIN_LASER'
                    ? 'TWIN'
                    : dropType === 'BUNKER_REPAIR'
                    ? 'SHIELD'
                    : '+1 UP',
              });

              createExplosion(
                eng.ufo.x + eng.ufo.width / 2,
                eng.ufo.y + eng.ufo.height / 2,
                '#ef4444',
                20
              );
              sound.playAlienExplode();
              laserDestroyed = true;
            }

            // Laser vs Bunkers
            if (!laserDestroyed && damageBunkerCircle(l.x + l.width / 2, l.y, 5)) {
              laserDestroyed = true;
            }

            if (laserDestroyed || l.y < 35) {
              eng.playerLasers.splice(i, 1);
            }
          }
        }

        // Alien Lasers
        for (let i = eng.alienLasers.length - 1; i >= 0; i--) {
          const al = eng.alienLasers[i];
          if (eng.gameState === 'PLAYING') {
            al.y += al.speed;
          }

          ctx.fillStyle = eng.frames % 4 < 2 ? '#ef4444' : '#38bdf8';
          ctx.fillRect(al.x, al.y, al.width, al.height);

          if (eng.gameState === 'PLAYING') {
            let laserDestroyed = false;

            if (
              !eng.player.isExploding &&
              eng.player.respawnTimer === 0 &&
              al.x < eng.player.x + eng.player.width &&
              al.x + al.width > eng.player.x &&
              al.y < eng.player.y + eng.player.height &&
              al.y + al.height > eng.player.y
            ) {
              eng.player.isExploding = true;
              sound.playPlayerExplode();
              createExplosion(
                eng.player.x + eng.player.width / 2,
                eng.player.y + eng.player.height / 2,
                '#22c55e',
                24
              );
              laserDestroyed = true;
            }

            if (!laserDestroyed && damageBunkerCircle(al.x + al.width / 2, al.y + al.height, 5)) {
              laserDestroyed = true;
            }

            if (laserDestroyed || al.y > CANVAS_HEIGHT - 20) {
              eng.alienLasers.splice(i, 1);
            }
          }
        }

        // Power-up capsules falling
        for (let i = eng.powerUps.length - 1; i >= 0; i--) {
          const pu = eng.powerUps[i];
          if (eng.gameState === 'PLAYING') {
            pu.y += 1.6;
          }

          ctx.fillStyle = pu.color;
          ctx.fillRect(pu.x, pu.y, 14, 8);
          ctx.fillStyle = '#05050a';
          ctx.fillRect(pu.x + 2, pu.y + 2, 10, 4);
          ctx.fillStyle = pu.color;
          ctx.fillRect(pu.x + 4, pu.y + 3, 6, 2);

          if (eng.gameState === 'PLAYING') {
            if (
              !eng.player.isExploding &&
              pu.x < eng.player.x + eng.player.width &&
              pu.x + 14 > eng.player.x &&
              pu.y < eng.player.y + eng.player.height &&
              pu.y + 8 > eng.player.y
            ) {
              sound.playPowerUp();
              if (pu.type === 'TWIN_LASER') {
                eng.twinLaserTicks = 480; // ~8 seconds
                setTwinLaserTimer(8);
              } else if (pu.type === 'BUNKER_REPAIR') {
                repairBunkers();
              } else if (pu.type === 'EXTRA_LIFE') {
                eng.lives = Math.min(5, eng.lives + 1);
                setLives(eng.lives);
              }
              eng.floatingScores.push({
                x: eng.player.x - 6,
                y: eng.player.y - 10,
                text: pu.label,
                color: pu.color,
                life: 40,
              });
              eng.powerUps.splice(i, 1);
              continue;
            }

            if (pu.y > CANVAS_HEIGHT - 20) {
              eng.powerUps.splice(i, 1);
            }
          }
        }

        // Particles
        for (let i = eng.particles.length - 1; i >= 0; i--) {
          const p = eng.particles[i];
          if (eng.gameState === 'PLAYING') {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
          }
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, 2, 2);
          if (p.life <= 0) eng.particles.splice(i, 1);
        }

        // Floating Score Popups
        for (let i = eng.floatingScores.length - 1; i >= 0; i--) {
          const fs = eng.floatingScores[i];
          if (eng.gameState === 'PLAYING') {
            fs.y -= 0.4;
            fs.life--;
          }
          ctx.font = '8px "Press Start 2P"';
          ctx.fillStyle = fs.color;
          ctx.fillText(fs.text, fs.x, fs.y);
          if (fs.life <= 0) eng.floatingScores.splice(i, 1);
        }

        // Draw Canvas HUD
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(10, 35);
        ctx.lineTo(CANVAS_WIDTH - 10, 35);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(10, CANVAS_HEIGHT - 20);
        ctx.lineTo(CANVAS_WIDTH - 10, CANVAS_HEIGHT - 20);
        ctx.stroke();

        ctx.font = '10px "Press Start 2P"';

        ctx.fillStyle = '#ffffff';
        ctx.fillText('SCORE', 20, 22);
        ctx.fillStyle = '#22c55e';
        ctx.fillText(eng.score.toString().padStart(4, '0'), 80, 22);

        ctx.fillStyle = '#ffffff';
        ctx.fillText('HI-SCORE', 175, 22);
        ctx.fillStyle = '#facc15';
        ctx.fillText(eng.highScore.toString().padStart(4, '0'), 265, 22);

        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`W:${eng.wave}`, 375, 22);

        ctx.fillStyle = '#22c55e';
        ctx.fillText('LIVES:', 20, CANVAS_HEIGHT - 6);
        for (let i = 0; i < Math.max(0, eng.lives - 1); i++) {
          drawSprite(ctx, SPRITES.player, 85 + i * 26, CANVAS_HEIGHT - 16, 1.5, '#22c55e');
        }

        if (eng.twinLaserTicks > 0) {
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(
            `TWIN:${Math.ceil(eng.twinLaserTicks / 60)}S`,
            CANVAS_WIDTH - 110,
            CANVAS_HEIGHT - 6
          );
        }

        // Update Entities when PLAYING
        if (eng.gameState === 'PLAYING') {
          if (eng.twinLaserTicks > 0) {
            eng.twinLaserTicks--;
            if (eng.frames % 15 === 0) {
              setTwinLaserTimer(Math.ceil(eng.twinLaserTicks / 60));
            }
          }

          // Player update
          if (eng.player.isExploding) {
            eng.player.explodeTimer++;
            if (eng.player.explodeTimer > 40) {
              eng.player.isExploding = false;
              eng.player.explodeTimer = 0;
              eng.lives--;
              setLives(eng.lives);
              if (eng.lives <= 0) {
                triggerGameOver();
              } else {
                eng.player.x = CANVAS_WIDTH / 2 - 11;
                eng.player.respawnTimer = 60;
              }
            }
          } else {
            if (eng.player.respawnTimer > 0) eng.player.respawnTimer--;
            if (eng.keys.left && eng.player.x > 16) {
              eng.player.x -= eng.player.speed;
            }
            if (eng.keys.right && eng.player.x < CANVAS_WIDTH - 16 - eng.player.width) {
              eng.player.x += eng.player.speed;
            }
          }

          // UFO update
          if (!eng.ufo.active) {
            eng.ufo.spawnTimer++;
            if (eng.ufo.spawnTimer > 650 + Math.random() * 450) {
              eng.ufo.active = true;
              eng.ufo.x = -30;
              eng.ufo.spawnTimer = 0;
            }
          } else {
            eng.ufo.x += eng.ufo.speed;
            if (eng.frames % 10 === 0) sound.playUfoSiren();
            if (eng.ufo.x > CANVAS_WIDTH + 30) {
              eng.ufo.active = false;
            }
          }

          // Alien Swarm update
          const swarm = eng.alienSwarm;
          swarm.stepTimer++;
          const aliveAliens = swarm.aliens.filter((a) => a.alive);
          const aliveCount = aliveAliens.length;

          if (aliveCount === 0) {
            eng.wave++;
            setWave(eng.wave);
            initSwarm(eng.wave, eng.difficulty);
          } else {
            const currentInterval = Math.max(
              2,
              Math.floor((aliveCount / 55) * swarm.stepInterval)
            );

            if (swarm.stepTimer >= currentInterval) {
              swarm.stepTimer = 0;
              swarm.animFrame = swarm.animFrame === 0 ? 1 : 0;
              sound.playMarchStep();

              let edgeReached = false;

              if (swarm.moveDownNext) {
                swarm.aliens.forEach((a) => {
                  if (a.alive) a.y += 12;
                });
                swarm.direction *= -1;
                swarm.moveDownNext = false;
              } else {
                swarm.aliens.forEach((a) => {
                  if (!a.alive) return;
                  a.x += swarm.direction * 8;
                  if (swarm.direction > 0 && a.x + a.width >= CANVAS_WIDTH - 20) {
                    edgeReached = true;
                  } else if (swarm.direction < 0 && a.x <= 20) {
                    edgeReached = true;
                  }
                });

                if (edgeReached) {
                  swarm.moveDownNext = true;
                }
              }

              // Check if aliens reached player defense line or eroded bunkers
              swarm.aliens.forEach((a) => {
                if (!a.alive) return;
                if (a.y + a.height >= CANVAS_HEIGHT - 115) {
                  damageBunkerCircle(a.x + a.width / 2, a.y + a.height, 8);
                }
                if (a.y + a.height >= eng.player.y - 10) {
                  triggerGameOver();
                }
              });
            }

            // Alien Fire Logic
            const fireChance =
              (eng.difficulty === 'HARDCORE' ? 0.032 : eng.difficulty === 'TURBO' ? 0.025 : 0.018) +
              eng.wave * 0.004;
            if (Math.random() < fireChance) {
              const randomAlien = aliveAliens[Math.floor(Math.random() * aliveCount)];
              eng.alienLasers.push({
                x: randomAlien.x + randomAlien.width / 2 - 1,
                y: randomAlien.y + randomAlien.height,
                width: 3,
                height: 10,
                speed: 3 + eng.wave * 0.2,
              });
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [initBunkers, initStarfield, initSwarm, triggerGameOver]);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      sound.init();
      const eng = engineRef.current;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        eng.keys.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        eng.keys.right = true;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (eng.gameState === 'START' || eng.gameState === 'GAMEOVER') {
          resetGame();
        } else if (eng.gameState === 'PLAYING') {
          firePlayerLaser();
        }
      }
      if (e.code === 'KeyP' || e.code === 'Escape') {
        togglePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const eng = engineRef.current;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        eng.keys.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        eng.keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [firePlayerLaser, resetGame, togglePause]);

  const accuracy = shotsFired > 0 ? Math.round((shotsHit / shotsFired) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#05050a] text-slate-100 flex flex-col">
      {/* 3-Zone Top Bar Contract */}
      <header className="w-full border-b border-slate-800/80 bg-[#080912]/90 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#cabinet"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('CABINET');
          }}
          className="font-arcade text-xs sm:text-sm text-emerald-400 tracking-wider whitespace-nowrap shrink-0"
        >
          SPACE INVADERS
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('CABINET')}
            className={`hover:text-white transition-colors whitespace-nowrap py-1 border-b-2 ${
              activeTab === 'CABINET' ? 'text-emerald-400 border-emerald-400' : 'border-transparent'
            }`}
          >
            Arcade Cabinet
          </button>
          <button
            onClick={() => setActiveTab('SCORES')}
            className={`hover:text-white transition-colors whitespace-nowrap py-1 border-b-2 ${
              activeTab === 'SCORES' ? 'text-emerald-400 border-emerald-400' : 'border-transparent'
            }`}
          >
            Session Scores
          </button>
          <button
            onClick={() => setActiveTab('MANUAL')}
            className={`hover:text-white transition-colors whitespace-nowrap py-1 border-b-2 ${
              activeTab === 'MANUAL' ? 'text-emerald-400 border-emerald-400' : 'border-transparent'
            }`}
          >
            Tactical Manual
          </button>
          <button
            onClick={() => setCrtEnabled((prev) => !prev)}
            className="hover:text-white transition-colors whitespace-nowrap py-1 flex items-center gap-1.5"
          >
            <Tv className="w-3.5 h-3.5 text-emerald-400" />
            <span>CRT: {crtEnabled ? 'ON' : 'OFF'}</span>
          </button>
          <button
            onClick={toggleSound}
            className="hover:text-white transition-colors whitespace-nowrap py-1 flex items-center gap-1.5"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>Audio: {soundEnabled ? 'ON' : 'MUTED'}</span>
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCrtEnabled((prev) => !prev)}
            className="md:hidden px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-[11px] text-slate-300 whitespace-nowrap"
          >
            CRT {crtEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={toggleSound}
            className="md:hidden px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-[11px] text-slate-300 whitespace-nowrap"
          >
            {soundEnabled ? 'SFX ON' : 'MUTED'}
          </button>
          {gameState === 'PLAYING' || gameState === 'PAUSED' ? (
            <button
              onClick={togglePause}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-300 flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              {gameState === 'PAUSED' ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              )}
            </button>
          ) : null}
          <button
            onClick={() => resetGame()}
            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{gameState === 'START' ? 'Launch Sortie' : 'New Sortie'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col justify-center">
        {activeTab === 'SCORES' && (
          <section className="max-w-2xl mx-auto w-full bg-[#0b0d18] border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h1 className="font-arcade text-base sm:text-lg text-emerald-400">
                  HIGH SCORE LEDGER
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Recorded defensive sorties from your local arcade cabinet memory
                </p>
              </div>
              <button
                onClick={() => setActiveTab('CABINET')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white whitespace-nowrap"
              >
                Return to Game
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 py-2 border-b border-slate-800/60 text-xs text-slate-400">
              <div>
                <div className="text-slate-500">All-Time Record</div>
                <div className="font-arcade text-base text-amber-400 mt-1 font-mono-tabular">
                  {highScore.toString().padStart(5, '0')}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Current Wave</div>
                <div className="font-arcade text-base text-sky-400 mt-1 font-mono-tabular">
                  Wave {wave}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Hit Accuracy</div>
                <div className="font-arcade text-base text-emerald-400 mt-1 font-mono-tabular">
                  {accuracy}%
                </div>
              </div>
            </div>

            {scoreHistory.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-sm text-slate-400">
                  No completed sorties logged in this session yet.
                </p>
                <button
                  onClick={() => resetGame()}
                  className="arcade-btn px-5 py-2.5 rounded text-xs font-arcade text-white"
                >
                  START FIRST SORTIE
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {scoreHistory.map((item, idx) => (
                  <div
                    key={item.id}
                    className="py-3 flex items-center justify-between text-xs font-mono-tabular"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 w-6">#{idx + 1}</span>
                      <span className="font-arcade text-emerald-400">
                        {item.score.toString().padStart(5, '0')} PTS
                      </span>
                    </div>
                    <div className="text-slate-400">
                      Wave {item.wave} · {item.difficulty} · {item.date}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'MANUAL' && (
          <section className="max-w-2xl mx-auto w-full bg-[#0b0d18] border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h1 className="font-arcade text-base sm:text-lg text-emerald-400">
                  TACTICAL DEFENSE MANUAL
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Orbital rules of engagement, target bounties, and UFO capsule drops
                </p>
              </div>
              <button
                onClick={() => setActiveTab('CABINET')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white whitespace-nowrap"
              >
                Return to Game
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                Command the Earth Defense Laser Cannon along the lower perimeter. Destroy all 55
                invaders in each wave before they descend to your defense line. As the swarm thins,
                surviving invaders accelerate their march cadence.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Twin Laser Capsule</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Dropped by Mystery UFOs. Doubles projectile output and increases muzzle velocity
                    for 8 seconds.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Bunker Reconstruction</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Restores eroded pixel matrices across all 4 defensive bunkers to absorb incoming
                    plasma fire.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Reserve Cannon (+1 UP)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Grants an additional reserve defense cannon up to a maximum of 5 active lives.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'CABINET' && (
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-6 items-start">
            {/* Left Desktop Column: Live Combat Telemetry & Difficulty Controls */}
            <aside className="hidden lg:flex flex-col gap-5 bg-[#0b0d18] border border-slate-800/90 rounded-xl p-5">
              <div>
                <h2 className="text-xs font-semibold text-slate-400">Combat Telemetry</h2>
                <div className="mt-3 space-y-3 border-t border-slate-800/80 pt-3">
                  <div>
                    <div className="text-xs text-slate-500">Current Score</div>
                    <div className="font-arcade text-xl text-emerald-400 font-mono-tabular mt-0.5">
                      {score.toString().padStart(5, '0')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">High Score</div>
                    <div className="font-arcade text-base text-amber-400 font-mono-tabular mt-0.5">
                      {highScore.toString().padStart(5, '0')}
                    </div>
                  </div>
                  <div className="pt-1 text-xs text-slate-400 font-mono-tabular">
                    Wave {wave} · {aliensRemaining}/55 Hostiles · {accuracy}% Hit
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-4">
                <h2 className="text-xs font-semibold text-slate-400 mb-2.5">Swarm Cadence Mode</h2>
                <div className="flex flex-col gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
                  {(['CLASSIC', 'TURBO', 'HARDCORE'] as DifficultyMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => changeDifficulty(mode)}
                      className={`px-3 py-2 text-xs font-medium rounded-md text-left transition-colors flex items-center justify-between whitespace-nowrap ${
                        difficulty === mode
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{mode}</span>
                      <span className="text-[11px] text-slate-500 font-mono-tabular">
                        {mode === 'CLASSIC' ? '3 Lives' : mode === 'TURBO' ? '1.2x Speed' : '2 Lives'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-4">
                <h2 className="text-xs font-semibold text-slate-400 mb-2">Weapon System Status</h2>
                <div className="text-xs text-slate-300 font-mono-tabular">
                  {twinLaserTimer > 0
                    ? `Twin Plasma Active (${twinLaserTimer}s)`
                    : 'Standard Single-Pulse Cannon'}
                </div>
              </div>
            </aside>

            {/* Center Focal Anchor: Classic 4:3 CRT Arcade Screen + Touch Deck */}
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
              <div
                id="screenContainer"
                className={`${
                  crtEnabled ? 'crt' : ''
                } relative w-full aspect-[4/3] bg-black rounded-xl overflow-hidden border-4 border-slate-800 shadow-[0_0_35px_rgba(34,197,94,0.14)] flex flex-col justify-center items-center`}
              >
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="w-full h-full block bg-black"
                />

                {/* START SCREEN OVERLAY */}
                {gameState === 'START' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-4 text-center z-10">
                    <h1 className="font-arcade text-xl sm:text-3xl text-emerald-400 mb-2 drop-shadow-[0_0_10px_#22c55e] tracking-wider text-balance">
                      SPACE INVADERS
                    </h1>
                    <p className="font-arcade text-[9px] sm:text-xs text-sky-300 mb-6 tracking-widest">
                      RETRO ARCADE EDITION
                    </p>

                    {/* Points Table */}
                    <div className="bg-slate-900/85 border border-slate-700 p-4 rounded-lg mb-6 text-[10px] sm:text-xs space-y-2.5 text-left w-64 sm:w-72 font-arcade">
                      <p className="text-center text-amber-400 mb-3 border-b border-slate-700 pb-1.5">
                        SCORE ADVANCE TABLE
                      </p>
                      <div className="flex items-center justify-between">
                        <PixelSpritePreview matrix={SPRITES.ufo} color="#ef4444" scale={2} />
                        <span className="text-rose-400">= ? MYSTERY</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <PixelSpritePreview matrix={SPRITES.squid[0]} color="#c084fc" scale={2} />
                        <span className="text-purple-400">= 30 POINTS</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <PixelSpritePreview matrix={SPRITES.crab[0]} color="#38bdf8" scale={2} />
                        <span className="text-sky-400">= 20 POINTS</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <PixelSpritePreview matrix={SPRITES.jelly[0]} color="#22c55e" scale={2} />
                        <span className="text-emerald-400">= 10 POINTS</span>
                      </div>
                    </div>

                    <button
                      onClick={() => resetGame()}
                      className="arcade-btn font-arcade px-6 py-3 text-xs sm:text-sm text-white font-bold rounded uppercase tracking-wider mb-2 whitespace-nowrap cursor-pointer"
                    >
                      PLAY GAME
                    </button>
                    <p className="font-arcade text-[8px] text-slate-400 mt-2">
                      ARROW KEYS / A-D + SPACE OR TOUCH CONTROLS
                    </p>
                  </div>
                )}

                {/* PAUSE SCREEN OVERLAY */}
                {gameState === 'PAUSED' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 text-center z-10">
                    <h2 className="font-arcade text-2xl text-amber-400 mb-4 tracking-widest animate-pulse">
                      PAUSED
                    </h2>
                    <p className="font-arcade text-[10px] text-slate-300">
                      PRESS &apos;P&apos; OR TAP RESUME
                    </p>
                    <button
                      onClick={togglePause}
                      className="arcade-btn font-arcade mt-6 px-6 py-2.5 text-xs text-white rounded whitespace-nowrap cursor-pointer"
                    >
                      RESUME
                    </button>
                  </div>
                )}

                {/* GAME OVER OVERLAY */}
                {gameState === 'GAMEOVER' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-4 text-center z-10">
                    <h2 className="font-arcade text-2xl sm:text-3xl text-rose-500 mb-4 drop-shadow-[0_0_8px_#ef4444] tracking-widest">
                      GAME OVER
                    </h2>

                    <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg mb-6 w-64 sm:w-72 font-arcade text-[10px] sm:text-xs space-y-3 font-mono-tabular">
                      <div className="flex justify-between">
                        <span className="text-slate-400">SCORE:</span>
                        <span className="text-emerald-400">{score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">HIGH SCORE:</span>
                        <span className="text-amber-400">{highScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">WAVE REACHED:</span>
                        <span className="text-sky-400">{wave}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => resetGame()}
                      className="arcade-btn font-arcade px-6 py-3 text-xs sm:text-sm text-white font-bold rounded uppercase tracking-wider whitespace-nowrap cursor-pointer"
                    >
                      PLAY AGAIN
                    </button>
                  </div>
                )}
              </div>

              {/* Touch Controls Bar for Mobile / Touchscreens */}
              <div className="w-full flex justify-between items-center mt-3 px-1 gap-2">
                <div className="flex gap-2">
                  <button
                    onTouchStart={(e) => {
                      e.preventDefault();
                      sound.init();
                      engineRef.current.keys.left = true;
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      engineRef.current.keys.left = false;
                    }}
                    onMouseDown={() => {
                      sound.init();
                      engineRef.current.keys.left = true;
                    }}
                    onMouseUp={() => {
                      engineRef.current.keys.left = false;
                    }}
                    onMouseLeave={() => {
                      engineRef.current.keys.left = false;
                    }}
                    aria-label="Move Left"
                    className="touch-btn w-14 h-14 rounded-full text-xl flex items-center justify-center cursor-pointer"
                  >
                    ◀
                  </button>
                  <button
                    onTouchStart={(e) => {
                      e.preventDefault();
                      sound.init();
                      engineRef.current.keys.right = true;
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      engineRef.current.keys.right = false;
                    }}
                    onMouseDown={() => {
                      sound.init();
                      engineRef.current.keys.right = true;
                    }}
                    onMouseUp={() => {
                      engineRef.current.keys.right = false;
                    }}
                    onMouseLeave={() => {
                      engineRef.current.keys.right = false;
                    }}
                    aria-label="Move Right"
                    className="touch-btn w-14 h-14 rounded-full text-xl flex items-center justify-center cursor-pointer"
                  >
                    ▶
                  </button>
                </div>

                <button
                  onClick={togglePause}
                  className="touch-btn font-arcade px-4 h-11 rounded-lg text-[10px] whitespace-nowrap cursor-pointer"
                >
                  {gameState === 'PAUSED' ? 'RESUME' : 'PAUSE'}
                </button>

                <button
                  onTouchStart={(e) => {
                    e.preventDefault();
                    sound.init();
                    if (engineRef.current.gameState === 'START' || engineRef.current.gameState === 'GAMEOVER') {
                      resetGame();
                    } else {
                      firePlayerLaser();
                    }
                  }}
                  onMouseDown={() => {
                    sound.init();
                    if (engineRef.current.gameState === 'START' || engineRef.current.gameState === 'GAMEOVER') {
                      resetGame();
                    } else {
                      firePlayerLaser();
                    }
                  }}
                  className="touch-btn font-arcade w-24 h-14 rounded-full text-[11px] font-bold text-emerald-400 border-emerald-500/50 flex items-center justify-center whitespace-nowrap cursor-pointer"
                >
                  FIRE
                </button>
              </div>
            </div>

            {/* Right Desktop Column: Target Bounties & Controls Reference */}
            <aside className="hidden lg:flex flex-col gap-5 bg-[#0b0d18] border border-slate-800/90 rounded-xl p-5">
              <div>
                <h2 className="text-xs font-semibold text-slate-400">Hostile Bounty Index</h2>
                <div className="mt-3 space-y-3 border-t border-slate-800/80 pt-3 text-xs font-mono-tabular">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <PixelSpritePreview matrix={SPRITES.ufo} color="#ef4444" scale={2} />
                      <span className="text-slate-300">Command Saucer</span>
                    </div>
                    <span className="text-rose-400">100–300 PTS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <PixelSpritePreview matrix={SPRITES.squid[0]} color="#c084fc" scale={2} />
                      <span className="text-slate-300">Squid Interceptor</span>
                    </div>
                    <span className="text-purple-400">30 PTS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <PixelSpritePreview matrix={SPRITES.crab[0]} color="#38bdf8" scale={2} />
                      <span className="text-slate-300">Crab Cruiser</span>
                    </div>
                    <span className="text-sky-400">20 PTS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <PixelSpritePreview matrix={SPRITES.jelly[0]} color="#22c55e" scale={2} />
                      <span className="text-slate-300">Jelly Trooper</span>
                    </div>
                    <span className="text-emerald-400">10 PTS</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-4">
                <h2 className="text-xs font-semibold text-slate-400 mb-2.5">UFO Supply Drops</h2>
                <div className="space-y-2 text-xs text-slate-400">
                  <div>
                    <span className="text-sky-400 font-medium">Twin Laser</span> · 8s dual fire
                  </div>
                  <div>
                    <span className="text-emerald-400 font-medium">Shield Repair</span> · Rebuilds
                    bunkers
                  </div>
                  <div>
                    <span className="text-rose-400 font-medium">+1 Reserve</span> · Extra cannon life
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-4">
                <h2 className="text-xs font-semibold text-slate-400 mb-2.5">Cabinet Controls</h2>
                <div className="space-y-1.5 text-xs text-slate-400 font-mono-tabular">
                  <div className="flex justify-between">
                    <span>Strafe Cannon</span>
                    <span className="text-slate-200">A / D or ◀ / ▶</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fire Pulse</span>
                    <span className="text-slate-200">SPACE or ▲</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tactical Pause</span>
                    <span className="text-slate-200">P or ESC</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
