function get_angle (current: number, target: number, pitch_angle_get: number) {
    if (pitch_angle_get == 0) {
        ans_get_angle = target
        ans_set_angle += -1
    } else {
        ans_get_angle = current
        if (current >= target + pitch_angle_get) {
            ans_get_angle += 0 - pitch_angle_get
        } else if (current <= target - pitch_angle_get) {
            ans_get_angle += pitch_angle_get
        } else {
            ans_get_angle = target
            ans_set_angle += -1
        }
    }
    return ans_get_angle
}
function Check_command () {
    if (cmd_request == "forward") {
        list_pointer = 0
        playing_mode = "forward"
        list = [
        "130,80,130,40,5",
        "70,80,130,40,9",
        "20,50,130,40,9",
        "50,140,50,100,5",
        "50,140,100,100,9",
        "50,140,160,130,9"
        ]
    } else if (cmd_request == "right") {
        list_pointer = 0
        playing_mode = "right"
        list = [
        "50,50,50,50,9",
        "130,130,130,130,9",
        "145,130,130,130,9",
        "145,130,130,30,9",
        "130,130,130,30,9",
        "50,130,130,30,9",
        "50,130,130,50,9",
        "50,130,160,50,9",
        "50,30,160,50,9",
        "50,30,50,50,9"
        ]
    } else if (cmd_request == "left") {
        list_pointer = 0
        playing_mode = "left"
        list = [
        "130,130,130,130,9",
        "50,50,50,50,9",
        "50,50,30,50,9",
        "50,130,30,50,9",
        "50,160,50,50,9",
        "50,160,130,50,9",
        "30,130,130,50,9",
        "30,130,130,130,9",
        "50,130,130,140,9",
        "130,130,130,140,9"
        ]
    } else if (cmd_request == "back") {
        list_pointer = 0
        playing_mode = "back"
        list = [
        "50,140,160,130,5",
        "50,140,100,100,9",
        "50,140,50,100,9",
        "20,50,130,40,5",
        "70,80,130,40,9",
        "130,80,130,40,9"
        ]
    } else if (cmd_request == "sit") {
        list_pointer = 0
        playing_mode = "sit"
        list = ["80,35,100,140,5"]
    } else if (cmd_request == "paw") {
        playing_mode = "paw"
        list_pointer = 0
        list = ["80,40,170,130,5"]
    } else if (cmd_request == "other paw") {
        list_pointer = 0
        playing_mode = "other paw"
        list = ["10,50,100,140,5"]
    } else if (cmd_request == "down") {
        list_pointer = 0
        playing_mode = "down"
        list = ["45,40,135,140,5"]
    } else if (cmd_request == "stop") {
        list_pointer = 0
        playing_mode = "stop"
        list = ["90,90,90,90,5"]
    }
}
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Happy)
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.Sad)
})
function Execute_a_command () {
    if (list_pointer >= list.length) {
        list_pointer = 0
        if (playing_mode == "stop") {
            playing_mode = "stoped"
        } else if (playing_mode != cmd_request) {
            playing_mode = "stop"
            list = ["90,90,90,90,5"]
        }
    }
    if (playing_mode != "stoped") {
        if (list.length > 0) {
            list_para = list[list_pointer].split(",")
            if (0 == set_angle(list_para[0], list_para[1], list_para[2], list_para[3], parseFloat(list_para[4]) * 3)) {
                list_pointer += 1
            }
        }
    }
}
control.onEvent(EventBusSource.MES_DPAD_CONTROLLER_ID, EventBusValue.MICROBIT_EVT_ANY, function () {
    if (lastvalue != control.eventValue()) {
        if (control.eventValue() == 1) {
            cmd_request = "forward"
        } else if (control.eventValue() == 3) {
            cmd_request = "back"
        } else if (control.eventValue() == 5) {
            cmd_request = "left"
        } else if (control.eventValue() == 7) {
            cmd_request = "right"
        } else if (control.eventValue() == 9) {
            cmd_request = "sit"
        } else if (control.eventValue() == 11) {
            cmd_request = "down"
        } else if (control.eventValue() == 13) {
            cmd_request = "other paw"
        } else if (control.eventValue() == 15) {
            cmd_request = "paw"
        } else {
            cmd_request = "stop"
        }
        lastvalue = control.eventValue()
    }
})
function set_angle (front_left: string, back_left: string, front_right: string, back_right: string, pitch_angle: number) {
    ans_set_angle = 4
    front_left_angle = get_angle(front_left_angle, parseFloat(front_left), pitch_angle)
    kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo1, front_left_angle + (front_left_angle_init - 90))
    back_left_angle = get_angle(back_left_angle, parseFloat(back_left), pitch_angle)
    kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo2, back_left_angle + (back_left_angle_init - 90))
    front_right_angle = get_angle(front_right_angle, parseFloat(front_right), pitch_angle)
    kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo3, front_right_angle + (front_right_angle_init - 90))
    back_right_angle = get_angle(back_right_angle, parseFloat(back_right), pitch_angle)
    kitronik_i2c_16_servo.servoWrite(kitronik_i2c_16_servo.Servos.Servo4, back_right_angle + (back_right_angle_init - 90))
    return ans_set_angle
}
let back_right_angle = 0
let front_right_angle = 0
let back_left_angle = 0
let front_left_angle = 0
let list_para: string[] = []
let list_pointer = 0
let cmd_request = ""
let ans_set_angle = 0
let ans_get_angle = 0
let list: string[] = []
let playing_mode = ""
let back_right_angle_init = 0
let front_right_angle_init = 0
let back_left_angle_init = 0
let front_left_angle_init = 0
let lastvalue = 0
led.setBrightness(10)
basic.showIcon(IconNames.Heart)
lastvalue = 0
bluetooth.startLEDService()
front_left_angle_init = 91
back_left_angle_init = 87
front_right_angle_init = 93
back_right_angle_init = 95
set_angle("90", "90", "90", "90", 0)
playing_mode = "stoped"
list = []
loops.everyInterval(50, function () {
    if (playing_mode == "stoped") {
        Check_command()
    } else {
        Execute_a_command()
    }
})
