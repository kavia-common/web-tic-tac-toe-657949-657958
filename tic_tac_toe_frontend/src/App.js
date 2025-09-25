import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

// Theme tokens from Ocean Professional style guide
const THEME = {
  name: 'Ocean Professional',
  colors: {
    primary: '#2563EB',    // blue-600
    primarySoft: '#3B82F6', // blue-500
    secondary: '#F59E0B',  // amber-500
    surface: '#ffffff',
    surfaceAlt: '#f9fafb',
    text: '#111827',
    textMuted: '#6B7280',
    error: '#EF4444',
    gridBorder: 'rgba(17,24,39,0.1)',
    shadow: 'rgba(2, 6, 23, 0.08)',
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20
  }
};

/**
 * Utility: Calculate winner given a 3x3 board.
 * Returns { winner: 'X'|'O'|null, line: [a,b,c]|null }
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ];
  for (const [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a,b,c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * Utility: Determine if all cells filled with no winner.
 */
function isDraw(squares) {
  return squares.every(Boolean) && !calculateWinner(squares).winner;
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight, disabled, index }) {
  /** A single cell in the grid. */
  const label = value ? `Cell ${index + 1}, ${value}` : `Cell ${index + 1}, empty`;
  return (
    <button
      aria-label={label}
      className="ttt-square"
      onClick={onClick}
      disabled={disabled}
      data-highlight={highlight ? 'true' : 'false'}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onPlay, winningLine, nextPlayer, isFinished }) {
  /** 3x3 board rendering 9 Square components. */
  const handleClick = (i) => {
    if (squares[i] || isFinished) return;
    const next = squares.slice();
    next[i] = nextPlayer;
    onPlay(next);
  };

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((val, i) => (
        <Square
          key={i}
          index={i}
          value={val}
          onClick={() => handleClick(i)}
          disabled={!!val || isFinished}
          highlight={winningLine ? winningLine.includes(i) : false}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function StatusBar({ status, substatus }) {
  /** Displays primary status and substatus text. */
  return (
    <div className="ttt-status">
      <div className="ttt-status-primary">{status}</div>
      {substatus ? <div className="ttt-status-sub">{substatus}</div> : null}
    </div>
  );
}

// PUBLIC_INTERFACE
function Controls({ onReset, canReset, historyCount, onUndo, canUndo }) {
  /** Game controls: reset and undo. */
  return (
    <div className="ttt-controls">
      <button className="btn btn-primary" onClick={onReset} disabled={!canReset} aria-label="Reset game">
        ⟳ Reset
      </button>
      <button className="btn btn-secondary" onClick={onUndo} disabled={!canUndo} aria-label="Undo last move">
        ↶ Undo
      </button>
      <div className="ttt-meta" aria-live="polite">
        Moves: {Math.max(0, historyCount - 1)}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Game() {
  /** Main game container handling state and logic. */
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const squares = history[step];
  const xIsNext = step % 2 === 0;
  const nextPlayer = xIsNext ? 'X' : 'O';

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const draw = useMemo(() => isDraw(squares), [squares]);
  const finished = !!winner || draw;

  const status = winner
    ? `Winner: ${winner}`
    : draw
    ? 'Draw Game'
    : `Next Turn: ${nextPlayer}`;

  const substatus = winner
    ? 'Great game! Press reset to play again.'
    : draw
    ? 'Nobody wins this time. Try a rematch!'
    : xIsNext
    ? 'Player X goes first'
    : 'Player O to move';

  const handlePlay = (nextSquares) => {
    const newHistory = history.slice(0, step + 1).concat([nextSquares]);
    setHistory(newHistory);
    setStep(newHistory.length - 1);
  };

  const handleReset = () => {
    setHistory([Array(9).fill(null)]);
    setStep(0);
  };

  const handleUndo = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="ttt-card">
      <header className="ttt-header">
        <div className="ttt-title">Tic Tac Toe</div>
        <div className="ttt-badge" title="Ocean Professional">OP</div>
      </header>

      <StatusBar status={status} substatus={substatus} />

      <Board
        squares={squares}
        onPlay={handlePlay}
        winningLine={line}
        nextPlayer={nextPlayer}
        isFinished={finished}
      />

      <Controls
        onReset={handleReset}
        canReset={step > 0 || finished}
        historyCount={history.length}
        onUndo={handleUndo}
        canUndo={step > 0 && !finished}
      />

      <footer className="ttt-footer">
        <span>Two-player local play</span>
        <span className="dot">•</span>
        <span>Ocean Professional theme</span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root application: theme application and layout shell. */
  useEffect(() => {
    // Apply theme CSS variables to document root
    const r = document.documentElement;
    r.style.setProperty('--op-primary', THEME.colors.primary);
    r.style.setProperty('--op-primary-soft', THEME.colors.primarySoft);
    r.style.setProperty('--op-secondary', THEME.colors.secondary);
    r.style.setProperty('--op-surface', THEME.colors.surface);
    r.style.setProperty('--op-surface-alt', THEME.colors.surfaceAlt);
    r.style.setProperty('--op-text', THEME.colors.text);
    r.style.setProperty('--op-text-muted', THEME.colors.textMuted);
    r.style.setProperty('--op-error', THEME.colors.error);
    r.style.setProperty('--op-grid-border', THEME.colors.gridBorder);
    r.style.setProperty('--op-shadow', THEME.colors.shadow);
    r.style.setProperty('--op-radius-md', `${THEME.radius.md}px`);
    r.style.setProperty('--op-radius-lg', `${THEME.radius.lg}px`);
    r.style.setProperty('--op-radius-xl', `${THEME.radius.xl}px`);
  }, []);

  return (
    <div className="op-app">
      <div className="op-gradient" />
      <main className="op-container">
        <Game />
      </main>
    </div>
  );
}

export default App;
