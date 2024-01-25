import { __private, _decorator, CCInteger, Component, instantiate, Node, Prefab, Vec2, Vec3 } from 'cc';
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
    currentPos:Vec2=new Vec2(4,4);
    partSize:number=60;

    start() {

        this.sudokuBoard=new SudokuBoard();
        this.createBoard();
        this.sudokuBoard.printBoard();
        
        window["airconsole"].onMessage=(deviceId,data)=>{
            this.inputAnalyzer(data);
        }
        
    }

    inputAnalyzer(inputPackage){
        if(inputPackage.direction!="null"){
            this.moveBox(inputPackage.direction);
        }
        if(inputPackage.numpad!=null){
            this.writeValue(inputPackage.numpad);
        }
    }

    moveBox(direction){
        
    }

    writeValue(numpad){

    }



    createBoard(){ 
        console.log("Creating Sudoku...");
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

