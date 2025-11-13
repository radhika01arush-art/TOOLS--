import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type Player = "X" | "O" | null;

const TicTacToe = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | "draw" | null>(null);

  const calculateWinner = (squares: Player[]): Player | "draw" | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    if (squares.every((square) => square !== null)) {
      return "draw";
    }

    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Tic Tac Toe</CardTitle>
            <CardDescription>
              {winner
                ? winner === "draw"
                  ? "It's a draw!"
                  : `Winner: ${winner}!`
                : `Next player: ${isXNext ? "X" : "O"}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {board.map((cell, index) => (
                <Button
                  key={index}
                  onClick={() => handleClick(index)}
                  className="h-20 text-3xl font-bold"
                  variant="outline"
                >
                  {cell}
                </Button>
              ))}
            </div>
            <Button onClick={resetGame} className="w-full">
              Reset Game
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicTacToe;
