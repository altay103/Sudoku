import { __private, _decorator, Component, instantiate, Node, Prefab, Vec2, Vec3 } from 'cc';
import { SudokuBoard } from './SudokuBoard';
import { PartofSudoku } from './PartofSudoku';
const { ccclass, property } = _decorator;

@ccclass('SudokuController')
export class SudokuController extends Component {
    
    @property(Prefab)
    sudokuPart:Prefab;
    @property
    margin:number;
    @property(Node)
    spawnPoint:Node;
    
    sudokuBoard:SudokuBoard;
    sudokuNodes:Node[][];

    partSize:number=60;
    start() {
        // Sudoku tahtasını oluştur ve yazdır
        this.sudokuBoard=new SudokuBoard();
        this.createBoard();
        this.sudokuBoard.printBoard();
    
    }
    
    createBoard(){ 
        console.log("Creating Sudoku...");
        //destroy all child
        //bir array doldur
        //bir for aç
        //açılan forda oluşturulan her bir nodu arraya ekle değerini gir ve istenilen yere yerleştir
        this.spawnPoint.removeAllChildren();

        this.sudokuNodes=new Array(9);

        for (let i = 0; i < 9; i++) {
            this.sudokuNodes[i] = new Array(9);
            for (let j = 0; j < 9; j++) {
                let partInstantiate = instantiate(this.sudokuPart); 
    
                this.spawnPoint.addChild(partInstantiate); 
                this.sudokuNodes[i][j] = partInstantiate; 

                this.sudokuNodes[i][j].position=new Vec3((this.partSize/2+this.partSize*i+i*this.margin)-(4.5*this.partSize+4*this.margin),
                                                  (this.partSize/2+this.partSize*j+j*this.margin)-(4.5*this.partSize+4*this.margin));
                
                this.sudokuNodes[i][j].getComponent(PartofSudoku).value=this.sudokuBoard.board[i][j];
            }
        }
        

    }


    
    update(deltaTime: number) {
        
    }
}

