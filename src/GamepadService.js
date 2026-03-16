export default class GamepadService {
  gamepads = []
  xaxisThreshold = 0.35
  yaxisThreshold = 0.4

  gamePadInterval = null
  gamePadIntervalRate = 200

  buttonsPressed = new Array(20)
  buttonsLastPressed = new Array(20)
  buttonsPressedEvents = new Array(20)
  buttonsHeldEvents = new Array(20)
  buttonsReleasedEvents = new Array(20)

  axesChangedEvents = new Array(20)
  axesEnabled = new Array(20)

  checkGamepadButtons() {
    var gamePad = navigator.getGamepads()[0]
    let currentXCord = 0
    for (var axisIndex = 0; axisIndex < gamePad.axes.length; axisIndex++) {
      if (axisIndex % 2 === 0) {
        currentXCord = gamePad.axes[axisIndex]
      } else {
        if (this.axesChangedEvents[axisIndex / 2])
          this.axesChangedEvents[axisIndex / 2].forEach((callback) => {
            callback(currentXCord, gamePad.axes[axisIndex / 2])
          })
      }
    }
    for (var buttonIndex = 0; buttonIndex < gamePad.buttons.length; buttonIndex++) {
      if (gamePad.buttons[buttonIndex].pressed || this.buttonsPressed[buttonIndex]) {
        if (gamePad.buttons[buttonIndex].pressed && !this.buttonsPressed[buttonIndex]) {
          this.buttonsPressedEvents[buttonIndex].forEach((e) => e.callBack())
        } else if (gamePad.buttons[buttonIndex].pressed && this.buttonsPressed[buttonIndex]) {
          this.buttonsLastPressed[buttonIndex] = this.buttonsLastPressed[buttonIndex] + this.gamePadIntervalRate
          this.buttonsHeldEvents[buttonIndex].forEach((e) => e.callBack(this.buttonsLastPressed[buttonIndex]))
        } else if (this.buttonsPressed[buttonIndex]) {
          this.buttonsReleasedEvents[buttonIndex].forEach((e) => e.callBack(this.buttonsLastPressed[buttonIndex]))
          this.buttonsLastPressed[buttonIndex] = 0
        }
        this.buttonsPressed[buttonIndex] = gamePad.buttons[buttonIndex].pressed
      }
    }
  }

  constructor() {
    window.addEventListener('gamepaddisconnected', () => {
      console.log('gamepad disconnected')
      clearInterval(this.gamePadInterval)
    })
  }

  enableControlls() {
    var GamepadServiceInstance = this
    window.addEventListener('gamepadconnected', function (e) {
      console.log(e)
      for (var buttonIndex = 0; buttonIndex < navigator.getGamepads()[0].buttons.length; buttonIndex++) {
        GamepadServiceInstance.buttonsLastPressed[buttonIndex] = null
        GamepadServiceInstance.buttonsPressed[buttonIndex] = false
        if (GamepadServiceInstance.buttonsPressedEvents[buttonIndex] == undefined)
          GamepadServiceInstance.buttonsPressedEvents[buttonIndex] = []
        if (GamepadServiceInstance.buttonsHeldEvents[buttonIndex] == undefined)
          GamepadServiceInstance.buttonsHeldEvents[buttonIndex] = []
        if (GamepadServiceInstance.buttonsReleasedEvents[buttonIndex] == undefined)
          GamepadServiceInstance.buttonsReleasedEvents[buttonIndex] = []
      }
      GamepadServiceInstance.gamePadInterval = setInterval(
        GamepadServiceInstance.checkGamepadButtons.bind(GamepadServiceInstance),
        GamepadServiceInstance.gamePadIntervalRate,
      )
    })
  }

  addPressedEvent(buttonNumber, callback) {
    this.buttonsPressedEvents[buttonNumber] =
      this.buttonsPressedEvents[buttonNumber] == undefined
        ? [{ callBack: callback }]
        : [...this.buttonsPressedEvents[buttonNumber], { callBack: callback }]
  }

  addHeldEvent(buttonNumber, callback) {
    this.buttonsHeldEvents[buttonNumber] =
      this.buttonsHeldEvents[buttonNumber] == undefined
        ? [{ callBack: callback }]
        : [...this.buttonsHeldEvents[buttonNumber], { callBack: callback }]
  }

  addReleasedEvent(buttonNumber, callback) {
    this.buttonsReleasedEvents[buttonNumber] =
      this.buttonsReleasedEvents[buttonNumber] == undefined
        ? [{ callBack: callback }]
        : [...this.buttonsReleasedEvents[buttonNumber], { callBack: callback }]
  }

  addAxisEvent(axisNumber, callback) {
    this.axesChangedEvents[axisNumber] =
      this.axesChangedEvents[axisNumber] == undefined
        ? [{ callBack: callback }]
        : [...this.axesChangedEvents[axisNumber], { callBack: callback }]
  }

  disengage() {
    console.log('disengage gamepad')
    clearInterval(this.gamePadInterval)
  }
}
