import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Splash')
export class Splash extends Component {
    start() {
        console.log("Splash Loaded ");
        if(window["airconsole"].getDeviceId() === window["AirConsole"].SCREEN) {
            director.loadScene("Screen");
          } else {
            director.loadScene("Controller");
          }
    }

    update(deltaTime: number) {
        
    }
}

