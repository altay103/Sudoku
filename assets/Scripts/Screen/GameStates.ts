import { _decorator, Component, game, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

interface State{
    gamestates:GameStates;
    controllerConnected(deviceID:number);
    controllerDisconnected(deviceID:number);
    matchMaked();
}

@ccclass('GameStates')
export class GameStates {
    public waitingControllerState:State;
    public matchMakingState:State;
    public playState:State;
    public matchResultState:State;

    private currentState:State;

    gameManager:GameManager;
    constructor(gameManager:GameManager){
        this.gameManager=gameManager;

        this.waitingControllerState=new WaitingControllerState(this);
        this.matchMakingState=new MatchMakingState(this);
        this.playState=new PlayState(this);
        this.matchResultState=new MatchMakingState(this);

        this.setState(this.waitingControllerState);
    }
    
    public setState(state:State){
        this.currentState=state;
    }
    public getState():State{
        return this.currentState;
    }
}


class WaitingControllerState implements State{
    gamestates: GameStates;
    constructor(gamestates:GameStates){
        this.gamestates=gamestates;
    }
    matchMaked() {
        throw new Error('Method not implemented.');
    }
    controllerConnected(){
        this.gamestates.setState(this.gamestates.matchMakingState);
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
    matchMaked() {
        this.gamestates.setState(this.gamestates.playState);
    }

    controllerConnected() {
        if(this.gamestates.gameManager.waitingList.length<=2){
            this.gamestates.gameManager.matchMaking();
        }
    }
    controllerDisconnected(deviceID:number) {

        if(this.gamestates.gameManager.waitingList.length<=0){
            this.gamestates.setState(this.gamestates.waitingControllerState);
        }//else(playint{
         //   this.gamestates
        //}
    }

}

class PlayState implements State{
    gamestates: GameStates;
    constructor(gamestates:GameStates){
        this.gamestates=gamestates;
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
class MatchResultState implements State{
    gamestates: GameStates;
    constructor(gamestates:GameStates){
        this.gamestates=gamestates;
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
