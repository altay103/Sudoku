import { __private, _decorator, CCInteger, Color, Component, error, instantiate, Node, Prefab, Sprite, Vec2, Vec3 } from 'cc';
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
    currentDirection:string="null";
    next:boolean=false;
    start() {

        this.sudokuBoard=new SudokuBoard();
        this.createBoard();
        this.sudokuBoard.printBoard();

        this.zoomIn(this.currentPos);
        window["airconsole"].onMessage=(deviceId,data)=>{
            this.inputAnalyzer(data);
        }

        
    }

    inputAnalyzer(inputPackage){    
        this.moveCursor(inputPackage.direction);        
        if(inputPackage.numpad!=null){
            this.writeValue(inputPackage.numpad);
        }
    }

    async moveCursor(direction){//default box must be skip   ===================================> look at me
        this.currentDirection=direction;
        if(direction=="null"){
            return;
        }
        while(this.next){
            await new Promise(resolve=>setTimeout(resolve,100));
        }

        this.next=true;
        while(true){
            if(direction!=this.currentDirection){
                this.next=false;
                break;
            }

            this.zoomOut(this.currentPos);
            if(direction=="left"){
                if(this.currentPos.x>0){
                    this.currentPos.x--;
                }
            }else if(direction=="right"){
                if(this.currentPos.x<8){
                    this.currentPos.x++;
                }
            }else if(direction=="up"){
                if(this.currentPos.y<8){
                    this.currentPos.y++;
                }
            }else if(direction=="down"){
                if(this.currentPos.y>0){
                    this.currentPos.y--;
                }
            }
            this.zoomIn(this.currentPos);

            await new Promise(resolve=>setTimeout(resolve,400));
        }
        
    }

    zoomIn(boxPosition:Vec2){
        if(boxPosition.x<this.sudokuNodes.length && boxPosition.x>=0 &&
           boxPosition.y<this.sudokuNodes.length && boxPosition.y>=0){
            this.sudokuNodes[boxPosition.x][boxPosition.y].getComponent(PartofSudoku).size=this.partSize*0.9;
        }else{
            console.log("zoomIn size error");
        }   
        
    }
    zoomOut(boxPosition:Vec2){
        if(boxPosition.x<this.sudokuNodes.length && boxPosition.x>=0 &&
            boxPosition.y<this.sudokuNodes.length && boxPosition.y>=0){
            this.sudokuNodes[boxPosition.x][boxPosition.y].getComponent(PartofSudoku).size=this.partSize;
        }else{
            console.log("zoomIn size error");
        }  
    }
    

    writeValue(numpad){//not valid values must be marked ==================================================> look at me
        const partOfSudoku:PartofSudoku=this.sudokuNodes[this.currentPos.x][this.currentPos.y].getComponent(PartofSudoku);
        partOfSudoku.value=numpad;
        
        this.sudokuBoard.board[this.currentPos.x][this.currentPos.y]=partOfSudoku.value;
        if(this.sudokuBoard.isValidPlacement(this.currentPos.x,this.currentPos.y)){
            console.log("true");
            partOfSudoku.valid=true;
        }else{
            console.log("false");
            partOfSudoku.valid=false;
        }
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
                
                if(this.sudokuBoard.board[i][j]!=0){
                    this.sudokuNodes[i][j].getComponent(PartofSudoku).default=true;
                    
                }
                const subi=Math.floor(i/3);
                const subj=Math.floor(j/3);
                if(((subi+subj)==2)||(subi==subj)){
                    this.sudokuNodes[i][j].getComponent(Sprite).color=new Color("#FFCDAC");
                }

                
            }
        }
        

    }


    
    update(deltaTime: number) {

    }
}

