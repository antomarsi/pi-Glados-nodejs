
class Motor {
    deg_0_pulse = 0.5
    deg_180_pulse = 2.5
    f = 50.0
    constructor(gpio, pin, options) {
        this.motor = new gpio(pin, { mode: gpio.OUTPUT })
        period = 1000 / f
        k = 100 / period
        this.deg_0_duty = deg_0_pulse * k
        pulse_range = deg_180_pulse - deg_0_pulse
        this.duty_range = pulse_range * k
    }

    SetAngle(angle) {
        if (angle < 0 || angle > 180) {
            throw new Error("invalid");
        }
        duty = deg_0_duty + (angle / 180.0) * duty_range;
        this.motor.servoWrite(duty);
        this.angle = angle;
    }
    GetAngle() {
        return this.angle;
    }
    ResetAngle() {
        this.SetAngle(90);
    }
}

class ArmControl {
    constructor(pigpio) {
        this.gpio = pigpio.Gpio;
        this.ServoBase = new Motor(gpio, 10);
        this.ServoHead = new Motor(gpio, 13);
    }

    ResetAngle() {
        this.ServoBase.ResetAngle();
        this.ServoHead.ResetAngle();
    }

    MoveRight() {

    }
    MoveLeft() {

    }
    MoveUp() {

    }
    MoveDown() {

    }
}

export default ArmControl;