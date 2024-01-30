import { GameManager } from './GameManager';

export interface State{
    gamestates:GameStates;
    controllerConnected(deviceID:number);
    controllerDisconnected(deviceID:number);
    matchMaked();
    completed();
}

export class GameStates {
    public waitingControllerState:State;
    public matchMakingState:State;
    public playState:State;
    public resultState:State;

    private currentState:State;
    
    public start:boolean=false;


    gameManager:GameManager;
    constructor(gameManager:GameManager){
        this.gameManager=gameManager;
        
        this.waitingControllerState=new WaitingControllerState(this);
        this.matchMakingState=new MatchMakingState(this);
        this.playState=new PlayState(this);
        this.resultState=new ResultState(this);
        
        this.currentState=this.waitingControllerState;
        this.start=true;
    }
    
    public setState(state:State){
        this.currentState=state;
        this.gameManager.startState();
    }
    public getState():State{
        return this.currentState;
    }
}


class WaitingControllerState implements State{
    gamestates: GameStates;
    constructor(gamestates:GameStates){
        this.gamestates=gamestates;
        if(this.gamestates.start){
            
            console.log("inside waiting");
        }
    }
    completed() {
        throw new Error('Method not implemented.');
    }
    matchMaked() {
        throw new Error('Method not implemented.');
    }
    controllerConnected(){
        if(this.gamestates.gameManager.waitingList.length>=2){
            this.gamestates.setState(this.gamestates.matchMakingState);
            this.gamestates.gameManager.matchMaking();
        }
        
    }
    controllerDisconnected(){
        console.log("Already waiting controller");
    }
}

class MatchMakingState implements State{
    gamestates: GameStates;

    constructor(gamestates:GameStates){
        this.gamestates=gamestates;
        
    }
    completed() {
        throw new Error('Method not implemented.');
    }
    matchMaked() {
        this.gamestates.setState(this.gamestates.playState);
        
    }
    controllerConnected() {
        this.gamestates.setState(this.gamestates.matchMakingState);
    }
    controllerDisconnected() {
        this.gamestates.setState(this.gamestates.matchMakingState);
    }
}

class PlayState implements State{
    gamestates: GameStates;
    constructor(gamestates:GameStates){
        this.gamestates=gamestates;
    }
    completed() {
       this.gamestates.setState(this.gamestates.resultState);
    }
    controllerConnected(deviceID: number) {
        
        throw new Error('Method not implemented.');
    }
    controllerDisconnected(deviceID: number) {
        if(this.gamestates.gameManager.playingList.find(()=>deviceID)!=undefined){
            this.gamestates.setState(this.gamestates.waitingControllerState);
        }
        
    }
    matchMaked() {
        throw new Error('Method not implemented.');
    }

}
class ResultState implements State{
    gamestates: GameStates;
    constructor(gamestates:GameStates){
        this.gamestates=gamestates;
    }
    completed() {
        throw new Error('Method not implemented.');
    }
    controllerConnected(deviceID: number) {
        throw new Error('Method not implemented.');
    }
    controllerDisconnected(deviceID: number) {
        throw new Error('Method not implemented.');
    }
    matchMaked() {
        throw new Error('Method not implemented.');
    }
}
