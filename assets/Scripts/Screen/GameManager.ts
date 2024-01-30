import { _decorator, Component, Game, game, Node } from 'cc';
import { GameStates, State } from './GameStates';
import { SudokuController } from './SudokuController';
import { SudokuBoard } from './SudokuBoard';
const { ccclass, property } = _decorator;



@ccclass('GameManager')
export  class GameManager extends Component {
    gameStates:GameStates;
    waitingList:number[]=[];
    playingList:number[]=[];
    turnNumber:number=0;//0,1 

    @property(SudokuController)
    sudokuController:SudokuController;

    @property(Node)
    waitingControllerUI:Node;
    @property(Node)
    gameUI:Node;
    
    
    

    
    start() {
        this.gameStates=new GameStates(this);
        console.log("hello");
        this.setCurrentUI(this.waitingControllerUI);

        window["airconsole"].broadcast({status:"connected"})
        window["airconsole"].onMessage=(deviceId,data)=>{
            if(data.status=="connected"){
                console.log("Connected! "+deviceId);
                this.pushWaitingList(deviceId);
                this.gameStates.getState().controllerConnected(deviceId);
            }else if(data.status=="input"){
                this.sudokuController.inputAnalyzer(data);
            }
            /*else if(data.status=="disconnected"){
                this.popWaitingList(deviceId);
                this.playingList=this.playingList.filter((e)=>e!==deviceId);
                this.gameStates.getState().controllerDisconnected(deviceId);
                
            }*/
            
        }
        window["airconsole"].onDisconnect=(deviceId)=>{
            this.gameStates.getState().controllerDisconnected(deviceId);
            this.popWaitingList(deviceId);
            this.playingList=this.playingList.filter((e)=>e!==deviceId);
            this.gameStates.getState().controllerDisconnected(deviceId);
        }
    }
    startState(){
        const state:State=this.gameStates.getState();
        if(state==this.gameStates.waitingControllerState){
            console.log("Waiting Controller State");
            this.setCurrentUI(this.waitingControllerUI);
            this.playingList.forEach(e=>{
                window["airconsole"].message(e,{status:"waiting"});
            });
        }else if(state==this.gameStates.playState){
            console.log("Play State");
            
        }else if(state==this.gameStates.matchMakingState){
            console.log("Match Making State");
            this.matchMaking();
        }else if(state==this.gameStates.resultState){
            console.log("Result State");
            
            this.waitingList.forEach(e=>{
                window["airconsole"].message(e,{status:"completed"});
            })
         
            setTimeout(() => {
                if(this.waitingList.length>=2){
                    this.gameStates.setState(this.gameStates.matchMakingState);
                }else{
                    this.gameStates.setState(this.gameStates.waitingControllerState);
                }
                
              }, 4000);   
            //Change timer start
        }
    }
    changeTurn(){
        this.turnNumber++;
        this.turnNumber%=2;

        window["airconsole"].message(this.playingList[this.turnNumber],{status:"input"});
        window["airconsole"].message(this.playingList[(this.turnNumber+1)%2],{status:"turn"});
    }
    setCurrentUI(currentUI:Node){
        
        this.waitingControllerUI.active=false;
        this.gameUI.active=false;
        
        currentUI.active=true;
    }
    pushWaitingList(deviceId){
        this.waitingList.push(deviceId);
        this.printWaitingList();
        //think matchMaking?
    }
    popWaitingList(deviceId){
        this.waitingList=this.waitingList.filter((e,i)=>e!==deviceId);
        this.printWaitingList();
        //think matchMaking or waitingController ?
    }
    matchMaking(){
        console.log("Match Making");

        this.sudokuController.sudokuBoard=new SudokuBoard();
        this.sudokuController.createBoard();
        this.sudokuController.sudokuBoard.printBoard();
        this.sudokuController.zoomIn(this.sudokuController.currentPos);

        if(this.waitingList.length<2){
            this.gameStates.setState(this.gameStates.waitingControllerState);
        }
        this.playingList=[];
        this.playingList.push(this.waitingList[0]);
        this.playingList.push(this.waitingList[1]);
        
        this.gameStates.getState().matchMaked();

        window["airconsole"].message(this.playingList[0],{status:"input"});
        window["airconsole"].message(this.playingList[0],{status:"checkMaster",package:"true"});
        window["airconsole"].message(this.playingList[1],{status:"turn"});

        this.setCurrentUI(this.gameUI);
    }
    printWaitingList(){
        console.log("WaitingList: "+this.waitingList);
    }

}


