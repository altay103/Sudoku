import { _decorator, Component, Node } from 'cc';
import { PlayerStates } from './PlayerStates';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends Component {
    playerStates:PlayerStates;
    
    @property(Node)
    waitingUI:Node;
    @property(Node)
    roomFullUI:Node;
    @property(Node)
    inputUI:Node;
    @property(Node)
    turnUI:Node;
    @property(Node)
    completedUI:Node;

    @property(Node)
    masterUI:Node;

    start() {
        this.playerStates=new PlayerStates(this);
        
        this.setMasterSetting(false);//default setting
        this. setCurrentUI(this.waitingUI);

    
        window["airconsole"].message(0,{status:"connected"});
        window["airconsole"].onMessage=(deviceId,data)=>{
            if(deviceId==0){
                if(data.status=="connected"){
                    window["airconsole"].message(0,{status:"connected"});
                }
                else if(data.status=="full"){
                    this.setCurrentUI(this.roomFullUI);
                }
                else if(data.status=="waiting"){
                    this.setCurrentUI(this.waitingUI)
                }
                else if(data.status=="input"){
                    this.setCurrentUI(this.inputUI);
                }
                else if(data.status=="turn"){
                    this.setCurrentUI(this.turnUI)
                }
                else if(data.status=="completed"){
                    this.setCurrentUI(this.completedUI);
                }
                else if(data.status=="checkMaster" && data.package=="true"){
                    this.setMasterSetting(true);
                }
            }
        }
        
    }
    setCurrentUI(currentUI:Node){
        this.waitingUI.active=false;
        this.roomFullUI.active=false;
        this.inputUI.active=false;
        this.turnUI.active=false;
        this.completedUI.active=false;

        currentUI.active=true;
    }
    setMasterSetting(mode:boolean){
        this.masterUI.active=mode;
    }
   
    update(deltaTime: number) {
        
    }
}

