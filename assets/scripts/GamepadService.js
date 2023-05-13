class GamepadService{
    gamepads = [];
    xaxisThreshold =.35;
    yaxisThreshold = .4;

    gamePadInterval = null;
    gamePadIntervalRate = 100;

    button0Pressed = false;
    button0LastPressed = null;
    button0PressedEvents = [];
    button0HeldEvents = [];
    button0ReleasedEvents = [];

    button1Pressed = false;
    button1LastPressed = null;
    button1PressedEvents = [];
    button1HeldEvents = [];
    button1ReleasedEvents = [];

    button2Pressed = false;
    button2LastPressed = null;
    button2PressedEvents = [];
    button2HeldEvents = [];
    button2ReleasedEvents = [];

    button3Pressed = false;
    button3LastPressed = null;
    button3PressedEvents = [];
    button3HeldEvents = [];
    button3ReleasedEvents = [];

    button4Pressed = false;
    button4LastPressed = null;
    button4PressedEvents = [];
    button4HeldEvents = [];
    button4ReleasedEvents = [];

    button5Pressed = false;
    button5LastPressed = null;
    button5PressedEvents = [];
    button5HeldEvents = [];
    button5ReleasedEvents = [];

    button6Pressed = false;
    button6LastPressed = null;
    button6PressedEvents = [];
    button6HeldEvents = [];
    button6ReleasedEvents = [];

    button7Pressed = false;
    button7LastPressed = null;
    button7PressedEvents = [];
    button7HeldEvents = [];
    button7ReleasedEvents = [];

    button8Pressed = false;
    button8LastPressed = null;
    button8PressedEvents = [];
    button8HeldEvents = [];
    button8ReleasedEvents = [];

    axes0Changed = false;
    primaryYaxisChanged = false;
    primaryYaxisLastChanged = null;
    primaryYaxisEvents = [];

    primaryXaxisChanged = false;
    primaryXaxisLastChanged = null;
    primaryXaxisEvents = [];

    axes2Changed = false;
    secondaryYaxisChanged = false;
    secondaryXaxisLastChanged = null;
    bsecondaryXaxisEvents = [];

    secondaryXaxisChanged = false;
    secondaryXaxisLastChanged = null;
    secondaryXaxisEvents = [];

    
    checkGamepadButtons(){
        var gamePad = navigator.getGamepads()[0];	
        var primaryXaxis = gamePad.axes[0];
        var primaryYaxis = gamePad.axes[1];
        var secondaryXaxis = gamePad.axes[2];
        var secondaryYaxis = gamePad.axes[3];
        if(this.primaryYaxis < (-1 * this.yaxisThreshold) || this.primaryYaxisChanged){ //primary joystick up (next video tag mark)
            this.primaryYaxisChanged = true;
            if(this.primaryYaxis < (-1 * this.yaxisThreshold) ){
                this.primaryYaxisChanged = false;
            }
        }
        
        if(gamePad.buttons[0].pressed || this.button0Pressed ){// A button pressed
            if(gamePad.buttons[0].pressed && !this.button0Pressed){
                console.log("button 0 pressed")
                this.button0PressedEvents.forEach((e) => e.callBack());
            }
            else if (gamePad.buttons[0].pressed && this.button0Pressed){
                console.log("button 0 held")
                this.button0LastPressed = this.button0LastPressed == null ? 0 : this.button0LastPressed + this.gamePadIntervalRate;
                this.button0HeldEvents.forEach((e) => e.callBack(this.button0LastPressed));
            }
            else{
                console.log("button 0 released")
                this.button0ReleasedEvents.forEach((e) => e.callBack(this.button0LastPressed));
                this.button0LastPressed = 0;

            }
            this.button0Pressed = gamePad.buttons[0].pressed ;
        }

        if(gamePad.buttons[1].pressed || this.button1Pressed ){// A button pressed
            if(gamePad.buttons[1].pressed && !this.button1Pressed){
                console.log("button 1 pressed")
                this.button1PressedEvents.forEach((e) => e.callBack(this.button1LastPressed));
            }
            else if (gamePad.buttons[1].pressed && this.button1Pressed){
                console.log("button 1 held")
                this.button1LastPressed = this.button1LastPressed == null ? 0 : this.button1LastPressed + this.gamePadIntervalRate;
                this.button1HeldEvents.forEach((e) => e.callBack(this.button1LastPressed));
            }
            else{
                this.button1ReleasedEvents.forEach((e) => e.callBack(this.button1LastPressed));
                this.button1LastPressed = 0;

            }
            this.button1Pressed = gamePad.buttons[1].pressed ;
        }

        if(gamePad.buttons[2].pressed || this.button2Pressed ){// A button pressed
            if(gamePad.buttons[2].pressed && !this.button2Pressed){
                console.log("button 2 pressed")
                this.button2PressedEvents.forEach((e) => e.callBack(this.button2LastPressed));
            }
            else if (gamePad.buttons[2].pressed && this.button2Pressed){
                console.log("button 2 held")
                this.button2LastPressed = this.button2LastPressed == null ? 0 : this.button2LastPressed + this.gamePadIntervalRate;
                this.button2HeldEvents.forEach((e) => e.callBack(this.button2LastPressed));
            }
            else{
                this.button2ReleasedEvents.forEach((e) => e.callBack(this.button2LastPressed));
                this.button2LastPressed = 0;

            }
            this.button2Pressed = gamePad.buttons[2].pressed ;
        }

        if(gamePad.buttons[3].pressed || this.button3Pressed ){// A button pressed
            if(gamePad.buttons[3].pressed && !this.button3Pressed){
                console.log("button 3 pressed");
                this.button3PressedEvents.forEach((e) => e.callBack(this.button3LastPressed));
            }
            else if (gamePad.buttons[3].pressed && this.button3Pressed){
                console.log("button 3 held")
                this.button3LastPressed = this.button3LastPressed == null ? 0 : this.button3LastPressed + this.gamePadIntervalRate;
                this.button3HeldEvents.forEach((e) => e.callBack(this.button3LastPressed));
            }
            else{
                this.button3ReleasedEvents.forEach((e) => e.callBack(this.button3LastPressed));
                this.button3LastPressed = 0;

            }
            this.button3Pressed = gamePad.buttons[3].pressed ;
        }

        if(gamePad.buttons[4].pressed || this.button4Pressed ){// A button pressed
            if(gamePad.buttons[4].pressed && !this.button4Pressed){
                console.log("button 4 pressed")
                this.button4PressedEvents.forEach((e) => e.callBack(this.button4LastPressed));
            }
            else if (gamePad.buttons[4].pressed && this.button4Pressed){
                console.log("button 4 held")
                this.button4LastPressed = this.button4LastPressed == null ? 0 : this.button4LastPressed + this.gamePadIntervalRate;
                this.button4HeldEvents.forEach((e) => e.callBack(this.button4LastPressed));
            }
            else{
                this.button4ReleasedEvents.forEach((e) => e.callBack(this.button4LastPressed));
                this.button4LastPressed = 0;

            }
            this.button4Pressed = gamePad.buttons[4].pressed ;
        }

        if(gamePad.buttons[5].pressed || this.button5Pressed ){// A button pressed
            if(gamePad.buttons[5].pressed && !this.button5Pressed){
                console.log("button 5 pressed");
                this.button5PressedEvents.forEach((e) => e.callBack(this.button5LastPressed));
            }
            else if (gamePad.buttons[5].pressed && this.button5Pressed){
                console.log("button 5 held")
                this.button5LastPressed = this.button5LastPressed == null ? 0 : this.button5LastPressed + this.gamePadIntervalRate;
                this.button5HeldEvents.forEach((e) => e.callBack(this.button5LastPressed));
            }
            else{
                this.button5ReleasedEvents.forEach((e) => e.callBack(this.button5LastPressed));
                this.button5LastPressed = 0;

            }
            this.button5Pressed = gamePad.buttons[5].pressed ;
        }

        if(gamePad.buttons[6].pressed || this.button6Pressed ){// A button pressed
            if(gamePad.buttons[6].pressed && !this.button6Pressed){
                console.log("button 6 pressed");
                this.button6PressedEvents.forEach((e) => e.callBack(this.button6LastPressed));
            }
            else if (gamePad.buttons[6].pressed && this.button6Pressed){
                console.log("button 6 held")
                this.button6LastPressed = this.button6LastPressed == null ? 0 : this.button6LastPressed + this.gamePadIntervalRate;
                this.button6HeldEvents.forEach((e) => e.callBack(this.button6LastPressed));
            }
            else{
                this.button6ReleasedEvents.forEach((e) => e.callBack(this.button6LastPressed));
                this.button6LastPressed = 0;

            }
            this.button6Pressed = gamePad.buttons[6].pressed ;
        }

        if(gamePad.buttons[7].pressed || this.button7Pressed ){// A button pressed
            if(gamePad.buttons[7].pressed && !this.button7Pressed){
                console.log("button 7 pressed")
                this.button7PressedEvents.forEach((e) => e.callBack(this.button7LastPressed));
            }
            else if (gamePad.buttons[7].pressed && this.button7Pressed){
                console.log("button 7 held")
                this.button7LastPressed = this.button7LastPressed == null ? 0 : this.button7LastPressed + this.gamePadIntervalRate;
                this.button7HeldEvents.forEach((e) => e.callBack(this.button7LastPressed));
            }
            else{
                this.button7ReleasedEvents.forEach((e) => e.callBack(this.button7LastPressed));
                this.button7LastPressed = 0;

            }
            this.button7Pressed = gamePad.buttons[7].pressed ;
        }

        if(gamePad.buttons[8].pressed || this.button8Pressed ){// A button pressed
            if(gamePad.buttons[8].pressed && !this.button8Pressed){
                console.log("button 8 pressed")
                this.button8PressedEvents.forEach((e) => e.callBack(this.button8LastPressed));
            }
            else if (gamePad.buttons[8].pressed && this.button8Pressed){
                console.log("button 8 held")
                this.button8LastPressed = this.button8LastPressed == null ? 0 : this.button8LastPressed + this.gamePadIntervalRate;
                this.button8HeldEvents.forEach((e) => e.callBack(this.button8LastPressed));
            }
            else{
                this.button8ReleasedEvents.forEach((e) => e.callBack(this.button8LastPressed));
                this.button8LastPressed = 0;

            }
            this.button8Pressed = gamePad.buttons[8].pressed ;
        }
        
    }
    constructor (){
        var GamepadServiceInstance = this;
        window.addEventListener("gamepadconnected", function(e){
            console.log(e);
            //setTimeout(function(){
            GamepadServiceInstance.gamePadInterval = setInterval(GamepadServiceInstance.checkGamepadButtons.bind(GamepadServiceInstance),GamepadServiceInstance.gamePadIntervalRate);
            //},350);
            });
        window.addEventListener("gamepaddisconnected", function(e){
            console.log("gamepad disconnected");
            clearInterval(GamepadServiceInstance.gamePadInterval);
            });
    }
    
    addPressedEvent(buttonNumber, callback){
        switch(buttonNumber){
            case 0:
                this.button0PressedEvents = [...this.button0PressedEvents,{callBack:callback}];
                break;
            case 1:
                this.button1PressedEvents = [...this.button1PressedEvents,{callBack:callback}];
                break;
            case 2:
                this.button2PressedEvents = [...this.button2PressedEvents,{callBack:callback}];
                break;
            case 3:
                this.button3PressedEvents = [...this.button3PressedEvents,{callBack:callback}];
                break;
            case 4:
                this.button4PressedEvents = [...this.button4PressedEvents,{callBack:callback}];
                break;
            case 5:
                this.button5PressedEvents = [...this.button5PressedEvents,{callBack:callback}];
                break;
            case 6:
                this.button6PressedEvents = [...this.button6PressedEvents,{callBack:callback}];
                break;
            case 7:
                this.button7PressedEvents = [...this.button7PressedEvents,{callBack:callback}];
                break;
            case 8:
                this.button8PressedEvents = [...this.button8PressedEvents,{callBack:callback}];
                break;
        }
    }

    addHeldEvent(buttonNumber, callback){
        switch(buttonNumber){
            case 0:
                this.button0HeldEvents = [...this.button0HeldEvents,{callBack:callback}];
                break;
            case 1:
                this.button1HeldEvents = [...this.button1HeldEvents,{callBack:callback}];
                break;
            case 2:
                this.button2HeldEvents = [...this.button2HeldEvents,{callBack:callback}];
                break;
            case 3:
                this.button3HeldEvents = [...this.button3HeldEvents,{callBack:callback}];
                break;
            case 4:
                this.button4HeldEvents = [...this.button4HeldEvents,{callBack:callback}];
                break;
            case 5:
                this.button5HeldEvents = [...this.button5HeldEvents,{callBack:callback}];
                break;
            case 6:
                this.button6HeldEvents = [...this.button6HeldEvents,{callBack:callback}];
                break;
            case 7:
                this.button7HeldEvents = [...this.button7HeldEvents,{callBack:callback}];
                break;
            case 8:
                this.button8HeldEvents = [...this.button8HeldEvents,{callBack:callback}];
                break;
        }
    }

    addReleasedEvent(buttonNumber, callback){
        switch(buttonNumber){
            case 0:
                this.button0ReleasedEvents = [...this.button0ReleasedEvents,{callBack:callback}];
                break;
            case 1:
                this.button1ReleasedEvents = [...this.button1ReleasedEvents,{callBack:callback}];
                break;
            case 2:
                this.button2ReleasedEvents = [...this.button2ReleasedEvents,{callBack:callback}];
                break;
            case 3:
                this.button3ReleasedEvents = [...this.button3ReleasedEvents,{callBack:callback}];
                break;
            case 4:
                this.button4ReleasedEvents = [...this.button4ReleasedEvents,{callBack:callback}];
                break;
            case 5:
                this.button5ReleasedEvents = [...this.button5ReleasedEvents,{callBack:callback}];
                break;
            case 6:
                this.button6ReleasedEvents = [...this.button6ReleasedEvents,{callBack:callback}];
                break;
            case 7:
                this.button7ReleasedEvents = [...this.button7ReleasedEvents,{callBack:callback}];
                break;
            case 8:
                this.button8ReleasedEvents = [...this.button8ReleasedEvents,{callBack:callback}];
                break;
        }
    }

    disengage  (){
        console.log("disengage gamepad");
        clearInterval(this.gamePadInterval);
    }
    
}
