class GamepadService{
    gamepads = [];
    xaxisThreshold =.35;
    yaxisThreshold = .4;

    gamePadInterval = null;
    gamePadIntervalRate = 50;

        //buttons are a two dimensional array for dynamic button counts
    buttonsPressed = new Array(20);
    buttonsLastPressed = new Array(20);
    buttonsPressedEvents = new Array(20);
    buttonsHeldEvents = new Array(20);
    buttonsReleasedEvents = new Array(20);

    axesChangedEvents = new Array(20);
    axesEnabled = new Array(20);

    
    checkGamepadButtons(){
        var gamePad = navigator.getGamepads()[0];	
        // var primaryXaxis = gamePad.axes[0];
        // var primaryYaxis = gamePad.axes[1];
        // var secondaryXaxis = gamePad.axes[2];
        // var secondaryYaxis = gamePad.axes[3];
        // if(this.primaryYaxis < (-1 * this.yaxisThreshold) || this.primaryYaxisChanged){ //primary joystick up (next video tag mark)
        //     this.primaryYaxisChanged = true;
        //     if(this.primaryYaxis < (-1 * this.yaxisThreshold) ){
        //         this.primaryYaxisChanged = false;
        //     }
        // }
        let currentXCord = 0;
        for(var axisIndex = 0;axisIndex < gamePad.axes.length; axisIndex++){
            if(axisIndex % 2 === 0){
                //x coordinate
                currentXCord = gamePad.axes[axisIndex];
            }
            else{
                //y coordinate
               if( this.axesChangedEvents[axisIndex / 2])this.axesChangedEvents[axisIndex / 2].forEach((callback) => {callback(currentXCord,gamePad.axes[axisIndex / 2])})
            }
        }
        for(var buttonIndex = 0;buttonIndex < gamePad.buttons.length; buttonIndex++){
            if(gamePad.buttons[buttonIndex].pressed || this.buttonsPressed[buttonIndex]){
                if(gamePad.buttons[buttonIndex].pressed && !this.buttonsPressed[buttonIndex]){
                    console.log("button "+buttonIndex+" pressed")
                    this.buttonsPressedEvents[buttonIndex].forEach((e) => e.callBack());
                }
                else if (gamePad.buttons[buttonIndex].pressed && this.buttonsPressed[buttonIndex]){
                    console.log("button "+buttonIndex+" held")
                    this.buttonsLastPressed[buttonIndex] = this.buttonsLastPressed[buttonIndex] + this.gamePadIntervalRate;
                    this.buttonsHeldEvents[buttonIndex].forEach((e) => e.callBack(this.buttonsLastPressed[buttonIndex]));
                }
                else if(this.buttonsPressed[buttonIndex]){
                    console.log("button "+buttonIndex+" released")
                    this.buttonsReleasedEvents[buttonIndex].forEach((e) => e.callBack(this.buttonsLastPressed[buttonIndex]));
                    this.buttonsLastPressed[buttonIndex] = 0;
    
                }
                this.buttonsPressed[buttonIndex] = gamePad.buttons[buttonIndex].pressed;
            }
        }    
        
    }
    constructor (){
        
        window.addEventListener("gamepaddisconnected", function(e){
            console.log("gamepad disconnected");
            clearInterval(GamepadServiceInstance.gamePadInterval);
            });
    }

    enableControlls(){
        var GamepadServiceInstance = this;
        window.addEventListener("gamepadconnected", function(e){
            console.log(e);
            //setTimeout(function(){
            for(var buttonIndex = 0;buttonIndex < navigator.getGamepads()[0].buttons.length; buttonIndex++){
                GamepadServiceInstance.buttonsLastPressed[buttonIndex] = null;
                GamepadServiceInstance.buttonsPressed[buttonIndex] = false;
                if(GamepadServiceInstance.buttonsPressedEvents[buttonIndex] == undefined) GamepadServiceInstance.buttonsPressedEvents[buttonIndex] = [];
                if(GamepadServiceInstance.buttonsHeldEvents[buttonIndex] == undefined) GamepadServiceInstance.buttonsHeldEvents[buttonIndex] = [];
                if(GamepadServiceInstance.buttonsReleasedEvents[buttonIndex] == undefined) GamepadServiceInstance.buttonsReleasedEvents[buttonIndex] = [];
            }
            // for(var axisIndex = 0;axisIndex < navigator.getGamepads()[0].axes.length; buttonIndex++){
            //     if(GamepadServiceInstance.axesChangedEvents[axisIndex / 2] == undefined) GamepadServiceInstance.axesChangedEvents[axisIndex / 2] = [];
            // }

            GamepadServiceInstance.gamePadInterval = setInterval(GamepadServiceInstance.checkGamepadButtons.bind(GamepadServiceInstance),GamepadServiceInstance.gamePadIntervalRate);

            //},350);
            });
    }
    
    addPressedEvent(buttonNumber, callback){
        this.buttonsPressedEvents[buttonNumber] = this.buttonsPressedEvents[buttonNumber] == undefined ? [{callBack:callback}] : [...this.buttonsPressedEvents[buttonNumber] ,{callBack:callback}];
    }
    

    addHeldEvent(buttonNumber, callback){
        this.buttonsHeldEvents[buttonNumber] = this.buttonsHeldEvents[buttonNumber] == undefined ? [{callBack:callback}] :[...this.buttonsHeldEvents[buttonNumber] ,{callBack:callback}];        
    }

    addReleasedEvent(buttonNumber, callback)  {
        this.buttonsReleasedEvents[buttonNumber] = this.buttonsReleasedEvents[buttonNumber] == undefined ? [{callBack:callback}] :[...this.buttonsReleasedEvents[buttonNumber] ,{callBack:callback}];        
    }

    addAxisEvent(axisNumber, callback)  {
        this.axesChangedEvents[axisNumber] = this.axesChangedEvents[axisNumber] == undefined ? [{callBack:callback}] :[...this.axesChangedEvents[axisNumber] ,{callBack:callback}];        
    }

    disengage  (){
        console.log("disengage gamepad");
        clearInterval(this.gamePadInterval);
    }
    
}
