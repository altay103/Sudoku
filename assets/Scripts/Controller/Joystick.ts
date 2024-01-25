import {
  _decorator,
  EventTarget,
  Component,
  Node,
  Enum,
  UIOpacity,
  UITransform,
  EventTouch,
  Vec3,
  Vec2,
  Size,
  CCInteger,
  Input
} from "cc";
import { InputController } from "./InputController";
const { ccclass, property } = _decorator;

export const instance = new EventTarget();

export const SET_JOYSTICK_TYPE = "SET_JOYSTICK_TYPE";


export enum DirectionType {
  FOUR,
  EIGHT,
  ALL,
}


export enum SpeedType {
  STOP,
  NORMAL,
  FAST,
}


export enum JoystickType {
  FIXED,
  FOLLOW,
}

export interface JoystickDataType {
  speedType: SpeedType;

  moveVec: Vec3;
}

@ccclass("Joystick")
export class Joystick extends Component {
  @property({
    type: Node,
    displayName: "Dot",
    tooltip: "摇杆操纵点",
  })
  dot: Node | null = null;

  @property({
    type: Node,
    displayName: "Ring",
    tooltip: "摇杆背景节点",
  })
  ring: Node | null = null;

  @property({
    type: Enum(JoystickType),
    displayName: "Touch Type",
    tooltip: "触摸类型",
  })
  joystickType = JoystickType.FIXED;

  @property({
    type: Enum(DirectionType),
    displayName: "Direction Type",
    tooltip: "方向类型",
  })
  directionType = DirectionType.ALL;

  @property({
    type: Vec3,
    tooltip: "摇杆所在位置",
  })
  _stickPos = new Vec3();

  @property({
    type: Vec2,
    tooltip: "触摸位置",
  })
  _touchLocation = new Vec2();

  @property({
    type: CCInteger,
    displayName: "Ring Radius",
    tooltip: "半径",
  })
  radius = 50;

  @property(CCInteger)
  deadzone=30;

  onLoad() {
    if (!this.dot) {
      console.warn("Joystick Dot is null!");
      return;
    }

    if (!this.ring) {
      console.warn("Joystick Ring is null!");
      return;
    }

    const uiTransform = this.ring.getComponent(UITransform);
    const size = this.radius * 2;
    const ringSize = new Size(size, size);
    uiTransform?.setContentSize(ringSize);
    this.ring
      .getChildByName("bg")!
      .getComponent(UITransform)
      ?.setContentSize(ringSize);

    this._initTouchEvent();
    const uiOpacity = this.node.getComponent(UIOpacity);
    if (this.joystickType === JoystickType.FOLLOW && uiOpacity) {
      uiOpacity.opacity = 0;
    }
  }


  onEnable() {
    instance.on(SET_JOYSTICK_TYPE, this._onSetJoystickType, this);
  }

 
  onDisable() {
    instance.off(SET_JOYSTICK_TYPE, this._onSetJoystickType, this);
  }

  _onSetJoystickType(type: JoystickType) {
    this.joystickType = type;
    const uiOpacity = this.node.getComponent(UIOpacity);
    if (uiOpacity) {
      uiOpacity.opacity = type === JoystickType.FIXED ? 255 : 0;
    }
  }


  _initTouchEvent() {

    this.node.on(Input.EventType.TOUCH_START, this._touchStartEvent, this);
    this.node.on(Input.EventType.TOUCH_MOVE, this._touchMoveEvent, this);
    this.node.on(Input.EventType.TOUCH_END, this._touchEndEvent, this);
    this.node.on(Input.EventType.TOUCH_CANCEL, this._touchEndEvent, this);
  }


  _touchStartEvent(event: EventTouch) {
    if (!this.ring || !this.dot) return;

    instance.emit(Input.EventType.TOUCH_START, event);

    const location = event.getUILocation();
    const touchPos = new Vec3(location.x, location.y);

    if (this.joystickType === JoystickType.FIXED) {
      this._stickPos = this.ring.getPosition();


      const moveVec = touchPos.subtract(this.ring.getPosition());

      const distance = moveVec.length();


      if (this.radius > distance) {
        this.dot.setPosition(moveVec);
      }
    } else if (this.joystickType === JoystickType.FOLLOW) {

      this._stickPos = touchPos;
      this.node.getComponent(UIOpacity)!.opacity = 255;
      this._touchLocation = event.getUILocation();
      this.ring.setPosition(touchPos);
      this.dot.setPosition(new Vec3());
    }
  }


  _touchMoveEvent(event: EventTouch) {
    if (!this.dot || !this.ring) return;


    if (
      this.joystickType === JoystickType.FOLLOW &&
      this._touchLocation === event.getUILocation()
    ) {
      return false;
    }


    const location = event.getUILocation();
    const touchPos = new Vec3(location.x, location.y);
    // move vector
    const moveVec = touchPos.subtract(this.ring.getPosition());
    const distance = moveVec.length();

    let speedType = SpeedType.NORMAL;
    if (this.radius > distance) {
      this.dot.setPosition(moveVec);
      speedType = SpeedType.NORMAL;
    } else {
 
      this.dot.setPosition(moveVec.normalize().multiplyScalar(this.radius));
      speedType = SpeedType.FAST;
    }

    //calc direction
    let direction = '';

    if(Math.abs(moveVec.x)>this.deadzone||Math.abs(moveVec.y)>this.deadzone){
      if (Math.abs(moveVec.x) > Math.abs(moveVec.y)) {
        direction = moveVec.x > 0 ? 'right' : 'left';
      } else {
        direction = moveVec.y > 0 ? 'up' : 'down';
      }
    }else{
      direction="null";
    }
    
    InputController.getInstance().onJoyStick(direction);

    instance.emit(Input.EventType.TOUCH_MOVE, event, {
      speedType,
      moveVec: moveVec.normalize(),
    });
  }


  _touchEndEvent(event: EventTouch) {
    if (!this.dot || !this.ring) return;

    this.dot.setPosition(new Vec3());
    if (this.joystickType === JoystickType.FOLLOW) {
      this.node.getComponent(UIOpacity)!.opacity = 0;
    }

    InputController.getInstance().onJoyStick("null");

    instance.emit(Input.EventType.TOUCH_END, event, {
      speedType: SpeedType.STOP,
    });
  }
}
