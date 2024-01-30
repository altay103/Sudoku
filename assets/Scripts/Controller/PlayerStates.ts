import { _decorator, Component, Node } from 'cc';
import { PlayerManager } from './PlayerManager';
const { ccclass, property } = _decorator;

interface State{
    playerStates:PlayerStates;
    chosen();
    played();
    matchDone();
}

@ccclass('PlayerStates')
export class PlayerStates  {
    public waitingChosenState:State;
    public waitingTurnState:State;
    public playingState:State;
    public matchResultState:State;

    private currentState:State;
    playerManager:PlayerManager;
    constructor(playerManager:PlayerManager){
        this.playerManager=playerManager;

        this.waitingChosenState=new WaitingChosenState(this);
        this.waitingTurnState=new WaitingTurnState(this);
        this.playingState=new PlayingState(this);
        this.matchResultState=new MatchResultState(this);

        this.setState(this.waitingChosenState);
    }

    public setState(state:State){
        this.currentState=state;
    }

    public getState():State{
        return this.currentState;
    }


}
class WaitingChosenState implements State{
    playerStates: PlayerStates;
    constructor(playerStates:PlayerStates){
        this.playerStates=playerStates;
    }
    chosen() {
        this.playerStates
    }
    played() {
        throw new Error('Method not implemented.');
    }
    matchDone() {
        throw new Error('Method not implemented.');
    }

}
class WaitingTurnState implements State{
    playerStates: PlayerStates;
    constructor(playerStates:PlayerStates){
        this.playerStates=playerStates;
    }
    chosen() {
        throw new Error('Method not implemented.');
    }
    played() {
        throw new Error('Method not implemented.');
    }
    matchDone() {
        throw new Error('Method not implemented.');
    }

}
class PlayingState implements State{
    playerStates: PlayerStates;
    constructor(playerStates:PlayerStates){
        this.playerStates=playerStates;
    }
    chosen() {
        throw new Error('Method not implemented.');
    }
    played() {
        throw new Error('Method not implemented.');
    }
    matchDone() {
        throw new Error('Method not implemented.');
    }

}
class MatchResultState implements State{
    playerStates: PlayerStates;
    constructor(playerStates:PlayerStates){
        this.playerStates=playerStates;
    }
    chosen() {
        throw new Error('Method not implemented.');
    }
    played() {
        throw new Error('Method not implemented.');
    }
    matchDone() {
        throw new Error('Method not implemented.');
    }

}
