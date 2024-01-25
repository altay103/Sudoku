import { _decorator, Component, Label, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PartofSudoku')
export class PartofSudoku extends Component {
    private _value: number = 0; // Private değişken olarak _value tanımlandı
    private _size:number=60;
    private _default:boolean=false;
    // Setter metodu
    set value(val: number) {
        if(this._default){
            console.log("You can change default box");
            return;
        }
        this._value = val;
        if(this.value==0){
            this.node.getComponentInChildren(Label).string="";
        }else{
            this.node.getComponentInChildren(Label).string=this.value.toString();
        }
    }

    // Getter metodu
    get value(): number {
        return this._value;
    }

    set size(val:number){
        this._size=val;
        this.node.getComponent(UITransform).width=this._size;
        this.node.getComponent(UITransform).height=this._size;
    }

    set default(val:boolean){
        this._default=val;
    }

    start() {
        if(this.value==0){
            this.node.getComponentInChildren(Label).string="";
        }else{
            this.node.getComponentInChildren(Label).string=this.value.toString();
        }
        
    }
}

