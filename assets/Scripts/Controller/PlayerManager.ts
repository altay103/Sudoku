import { _decorator, Component, Node } from 'cc';
import { PlayerStates } from './PlayerStates';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends Component {
    playerStates:PlayerStates;
    start() {
        this.playerStates=new PlayerStates(this);
        
        window["airconsole"].message(0,{status:"connected"});
        window["airconsole"].onMessage=(deviceId,data)=>{
            if(deviceId==0){
                if(data.status=="connected"){
                    window["airconsole"].message(0,{status:"connected"});
                }
            }
        }
    }

    update(deltaTime: number) {
        
    }
}

