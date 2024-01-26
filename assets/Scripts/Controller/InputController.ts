import { _decorator, Component, Node,Input , input } from 'cc';
import { Joystick } from './Joystick';
const { ccclass, property } = _decorator;

@ccclass('Input')
export class InputController extends Component {

    inputPackage={deviceID:0,direction:null,numpad:null}

    private static instance:InputController;


    public static getInstance():InputController{
        if(!InputController.instance){
            InputController.instance=new InputController();
        }
        return InputController.instance;
    }

    start() {
        this.inputPackage.deviceID=window["airconsole"].getDeviceId();
        console.log("controller")
    }
    
    onJoyStick(direction) {
        if(direction!=this.inputPackage.direction){
            this.inputPackage.direction=direction;
            this.sendPackage();
        }
    }
    onClickNumpad(event: Event,CustomEventData:number){
        if(CustomEventData!=this.inputPackage.numpad){
            this.inputPackage.numpad=CustomEventData;
            this.sendPackage();
        }
    }

    sendPackage(){
        console.log("inputPackage: "+JSON.stringify(this.inputPackage));
        window["airconsole"].message(0,this.inputPackage);

    }
    
}
