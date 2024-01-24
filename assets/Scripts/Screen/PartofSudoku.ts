import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PartofSudoku')
export class PartofSudoku extends Component {
    private _value: number = 0; // Private değişken olarak _value tanımlandı

    // Setter metodu
    set value(val: number) {
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

    start() {
        if(this.value==0){
            this.node.getComponentInChildren(Label).string="";
        }else{
            this.node.getComponentInChildren(Label).string=this.value.toString();
        }
        
    }
}

