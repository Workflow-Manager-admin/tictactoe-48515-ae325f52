import React, { useState } from "react";

// MAIN COLORS FROM SPEC
const COLORS = {
  primary: "#1b6a2a",     // deep green for highlights
  secondary: "#000000",   // black for background/control contrasts
  accent: "#2196f3",      // blue accent (for XO, hover, etc)
  boardBg: "#101914",     // dark, near-black for board background to fit theme
  cellBorder: "rgba(255,255,255,0.09)" // subtle board lines
};

// Styling as JS-in-CSS for minimal external dependency
const styles = {
  container: {
    maxWidth: 360,
    margin: "0 auto",
    background: COLORS.secondary,
    boxShadow: "0 4px 22px rgba(32,32,32,0.21)",
    borderRadius: 18,
    padding: 32,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  title: {
    margin: "0 0 4px",
    fontWeight: 700,
    letterSpacing: 1,
    fontSize: "2rem",
    color: COLORS.primary
  },
  turnInfo: {
    color: "#fff",
    margin: "8px 0 20px",
    fontWeight: 500,
    fontSize: "1.12rem"
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 60px)",
    gridTemplateRows: "repeat(3, 60px)",
    gap: "0",
    background: COLORS.boardBg,
    borderRadius: 12,
    marginBottom: 28,
    border: `2.5px solid ${COLORS.primary}`,
    boxShadow: "0 2px 8px rgba(22,22,22,0.13)"
  },
  cell: {
    width: 60,
    height: 60,
    fontSize: 32,
    fontWeight: 700,
    color: COLORS.accent,
    background: "transparent",
    border: `1.5px solid ${COLORS.cellBorder}`,
    cursor: "pointer",
    outline: "none",
    transition: "background 0.12s, color 0.12s"
  },
  cellHover: {
    background: "#222d24"
  },
  cellWinner: {
    background: COLORS.primary,
    color: "#fff"
  },
  resetBtn: {
    marginTop: 16,
    background: COLORS.accent,
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 30px",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 1.5px 6px rgba(25,25,25,0.10)",
    transition: "background 0.17s"
  },
  resetBtnHover: {
    background: "#1860bf"
  },
  infoMsg: {
    fontWeight: 500,
    color: "#bbb",
    margin: "10px 0",
    minHeight: 20
  }
};

// List of all possible win lines for 3x3
const WIN_LINES = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]           // diagonals
];

// PUBLIC_INTERFACE
function TicTacToe() {
  /**
   * This is the main TicTacToe component.
   * Implements two-player local mode, win/draw detection, and reset functionality,
   * following minimalist and accessible UI/UX with the provided theme/colors.
   */
  const EMPTY_BOARD = Array(9).fill(null);

  // State
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState({winner: null, line: null});
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Winning detection
  // PUBLIC_INTERFACE
  function calculateWinner(boardArr) {
    for (let line of WIN_LINES) {
      const [a, b, c] = line;
      if (
        boardArr[a] &&
        boardArr[a] === boardArr[b] &&
        boardArr[a] === boardArr[c]
      ) {
        return { winner: boardArr[a], line };
      }
    }
    return boardArr.every(Boolean) ? { winner: "draw", line: null } : null;
  }

  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    // If already filled or game ended, ignore
    if (board[idx] || winnerInfo.winner) return;

    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";

    const result = calculateWinner(nextBoard);
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
    setWinnerInfo(result || { winner: null, line: null });
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(EMPTY_BOARD);
    setXIsNext(true);
    setWinnerInfo({winner: null, line: null});
    setHoveredIdx(null);
  }

  // Returns style props for a cell
  function getCellStyle(idx) {
    let style = {...styles.cell};
    if (
      winnerInfo.winner &&
      winnerInfo.line &&
      winnerInfo.line.includes(idx)
    ) {
      style = { ...style, ...styles.cellWinner };
    } else if (
      hoveredIdx === idx &&
      !board[idx] &&
      !winnerInfo.winner
    ) {
      style = { ...style, ...styles.cellHover };
      style.color = xIsNext ? COLORS.primary : COLORS.accent;
      style.opacity = 0.75;
    } else if (board[idx] === "X") {
      style.color = COLORS.primary;
    } else if (board[idx] === "O") {
      style.color = COLORS.accent;
    }
    return style;
  }

  // Info strings
  function getTurnInfo() {
    if (winnerInfo.winner === "draw") return "It's a draw!";
    if (winnerInfo.winner) return `Player "${winnerInfo.winner}" wins!`;
    return `Current turn: Player "${xIsNext ? "X" : "O"}"`;
  }

  // Button hover effect management
  const [resetBtnHover, setResetBtnHover] = useState(false);

  // Render
  return (
    <div style={styles.container} data-testid="tictactoe-main">
      <div style={styles.title}>TicTacToe</div>
      <div style={styles.turnInfo}>{getTurnInfo()}</div>
      {/* 3x3 Grid */}
      <div style={styles.board}>
        {board.map((cell, idx) => (
          <button
            key={idx}
            aria-label={`Cell ${Math.floor(idx/3)+1},${(idx%3)+1}`}
            style={getCellStyle(idx)}
            onClick={() => handleCellClick(idx)}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            disabled={!!board[idx] || !!winnerInfo.winner}
            data-testid={`cell-${idx}`}
          >
            {cell ? cell : (hoveredIdx === idx && !winnerInfo.winner && !cell ? (xIsNext ? "X" : "O") : "")}
          </button>
        ))}
      </div>
      <div style={styles.infoMsg}>
        {/* Space for any info or prompts if needed */}
      </div>
      <button
        style={resetBtnHover ? {...styles.resetBtn, ...styles.resetBtnHover} : styles.resetBtn}
        onMouseEnter={() => setResetBtnHover(true)}
        onMouseLeave={() => setResetBtnHover(false)}
        onClick={handleRestart}
        data-testid="restart-btn"
      >
        Restart Game
      </button>
    </div>
  );
}

export default TicTacToe;
