import { _decorator, Component, Game, game, Node } from 'cc';
import { GameStates } from './GameStates';
const { ccclass, property } = _decorator;



@ccclass('GameManager')
export  class GameManager extends Component {
    gameStates:GameStates;
    waitingList:number[];
    playingList:number[];
    turnNumber:number;//0,1 
    
    start() {
        this.gameStates=new GameStates(this);
        
        window["airconsole"].broadcast({status:"connected"})

        window["airconsole"].onMessage=(deviceId,data)=>{
            if(data.status=="connected"){
                this.gameStates.getState().controllerConnected(deviceId);
            }else if(data.status=="disconnected"){
                this.gameStates.getState().controllerDisconnected(deviceId);
            }
        }
        window["airconsole"].onDisconnect=(deviceId)=>{
            this.gameStates.getState().controllerDisconnected(deviceId);
        }
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
        //
    }
    printWaitingList(){
        console.log(this.waitingList);
    }

}


