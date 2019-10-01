
class Motor {

    constructor(gpio, pin, options) {
        this.motor = new gpio(pin, { mode: gpio.OUTPUT })
        this.deg_0_pulse = 0.5
        this.deg_180_pulse = 2.5
        let f = 50.0
        let period = 1000 / f
        let k = 100 / period
        this.deg_0_duty = this.deg_0_pulse * k
        let pulse_range = this.deg_180_pulse - this.deg_0_pulse
        this.duty_range = pulse_range * k
    }

    SetAngle(angle) {
        if (angle < 0 || angle > 180) {
            throw new Error("invalid");
        }
        let duty = this.deg_0_duty + (angle / 180.0) * this.duty_range;
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
        this.gpio = pigpio;
        this.ServoBase = new Motor(this.gpio, 10);
        this.ServoHead = new Motor(this.gpio, 13);
        console.log("Started ArmControl");
        this.ResetAngle();
    }

    ResetAngle() {
        this.ServoBase.ResetAngle();
        this.ServoHead.ResetAngle();
    }

    MoveRight(value) {
        this.ServoHead.SetAngle(this.ServoHead.GetAngle() + value)
    }
    MoveLeft(value) {
        this.ServoHead.SetAngle(this.ServoHead.GetAngle() - value)
    }
    MoveUp() {
        this.ServoBase.SetAngle(this.ServoHead.GetAngle() + value)
    }
    MoveDown() {
        this.ServoBase.SetAngle(this.ServoHead.GetAngle() - value)
    }
}

export default ArmControl;