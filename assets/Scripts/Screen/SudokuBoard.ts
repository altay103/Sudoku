import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SudokuBoard')
export class SudokuBoard  {
    public board: number[][];
    
    constructor() {
        this.board = this.generateBoard();
        this.removeNumbers(30);
    }
    
    generateBoard(): number[][] {
        let board = Array.from({ length: 9 }, () => Array(9).fill(0));

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let num = this.getRandomNumber(1, 9);
                let count = 0;

                while (!this.isValid(board, i, j, num)) {
                    num = this.getRandomNumber(1, 9);
                    count++;
                    if (count > 50) {
                        // Reset the board if stuck
                        return this.generateBoard();
                    }
                }

                board[i][j] = num;
            }
        }

        return board;
    }

    isValid(board: number[][], row: number, col: number, num: number): boolean {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num || board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3] === num) {
                return false;
            }
        }
        return true;
    }

    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    removeNumbers(count: number): void {
        while (count > 0) {
            let row = this.getRandomNumber(0, 8);
            let col = this.getRandomNumber(0, 8);

            if (this.board[row][col] !== 0) {
                this.board[row][col] = 0;
                count--;
            }
        }
    }

    isCompleted(): boolean {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === 0 || !this.isValid(this.board, row, col, this.board[row][col])) {
                    return false;
                }
            }
        }
        return true;
    }

    findErrors(): number[][] {
        let errors: number[][] = [];

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] !== 0 && !this.isValidPlacement(row, col)) {
                    errors.push([row, col]);
                }
            }
        }

        return errors;
    }

    isValidPlacement(row: number, col: number): boolean {
        let num = this.board[row][col];

        // Satır ve sütun kontrolü
        for (let i = 0; i < 9; i++) {
            if (i !== col && this.board[row][i] === num) {
                return false;
            }
            if (i !== row && this.board[i][col] === num) {
                return false;
            }
        }

        // Blok kontrolü
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;

        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if ((i !== row || j !== col) && this.board[i][j] === num) {
                    return false;
                }
            }
        }

        return true;
    }
    
    printBoard(): void {
        console.log(this.board.map(row => row.join(' ')).join('\n'));
    }

}

