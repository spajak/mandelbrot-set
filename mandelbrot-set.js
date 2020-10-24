import * as colors from "./colors.js";

export class MandelbrotSetFormula
{
    constructor({iterations = 100, radius = 2**4, smooth = true} = {}) {
        this.iterations = iterations;
        this.radius = radius;
        this.smooth = smooth;
        this.defaultExtent = MandelbrotSetFormula.extent;
    }

    calculate(Cr, Ci) {
        return this.doCalculate(0, 0, Cr, Ci);
    }

    doCalculate(Zr, Zi, Cr, Ci) {
        let Tr = Zr*Zr, Ti = Zi*Zi;
        for (let i = 0; i < this.iterations; ++i) {
            Zi = 2*Zr*Zi + Ci;
            Zr = Tr - Ti + Cr;
            Tr = Zr*Zr;
            Ti = Zi*Zi;

            if (Tr + Ti > this.radius) {
                if (this.smooth) {
                    return i + 1 - Math.log(Math.log(Math.sqrt(Tr + Ti)))/Math.log(2);
                } else {
                    return i;
                }
            }
        }

        return null;
    }
}

MandelbrotSetFormula.extent = {
    x_min: -2.5,
    x_max:  1.0,
    y_min: -1.5,
    y_max:  1.5
};

export class JuliaSetFormula extends MandelbrotSetFormula
{
    constructor({iterations = 100, radius = 2**4, smooth = true} = {}) {
        super(iterations, radius, smooth);
        // tedius repeat, but above does not work as expected
        this.iterations = iterations;
        this.radius = radius;
        this.smooth = smooth;
        this.defaultExtent = JuliaSetFormula.extent;
    }

    calculate(Zr, Zi) {
        return this.doCalculate(Zr, Zi, -0.8, 0.156);
    }
}

JuliaSetFormula.extent = {
    x_min: -1.5,
    x_max:  1.5,
    y_min: -1.5,
    y_max:  1.5
};

export class FractalGenerator {
    constructor({
        width = 2000,
        height = 2000,
        formula = null,
        extent = null,
        interior = false,
        axes = false,
        palette = "default"
    } = {}) {
        this.width = width;
        this.height = height;

        if (null == formula) {
            throw new Error('Formula must be set');
        }

        this.formula = formula;

        if (null == extent) {
            extent = formula.defaultExtent;
        }

        this.extent = extent;

        this.interior = interior;
        this.axes = axes;
        this.palette = colors.palettes[palette];

        this.adjustExtent();
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.adjustExtent();
    }

    setExtent(extent) {
        this.extent = extent;
        this.adjustExtent();
    }

    adjustExtent() {
        let width  = this.extent.x_max - this.extent.x_min;
        let height = this.extent.y_max - this.extent.y_min;

        let [x_step, y_step] = [width / this.width, height / this.height];

        if (y_step > x_step) {
            this.step = y_step;
            let d = (this.width * this.step - width) / 2;
            this.x_min = this.extent.x_min - d;
            this.x_max = this.extent.x_max + d;
            this.y_min = this.extent.y_min;
            this.y_max = this.extent.y_max;
        } else {
            this.step = x_step;
            let d = (this.height * this.step - height) / 2;
            this.x_min = this.extent.x_min;
            this.x_max = this.extent.x_max;
            this.y_min = this.extent.y_min - d;
            this.y_max = this.extent.y_max + d;
        }
    }

    getExtentValueAt(x, y) {
        return [this.x_min + x * this.step, this.y_min + y * this.step];
    }

    calculate(x, y) {
        let [Er, Ei] = this.getExtentValueAt(x, y);

        if (this.axes && ((Er < this.step && Er >= 0) || (Ei < this.step && Ei >= 0))) {
            return colors.palettes["grey"][10];
        }

        let value = this.formula.calculate(Er, Ei);

        if (null === value) {
            return this.interior ?
                colors.palettes["grey"][15]:
                colors.palettes["grey"][0];
        }

        let hue = Math.log(0.02 * value + 1);

        while (hue > 1) {
            hue--;
        }

        hue *= (this.palette.length - 1);
        let hue1 = Math.max(Math.floor(hue), 0);
        let hue2 = Math.min(hue1 + 1, this.palette.length - 1);

        return colors.interpolate(
            this.palette[hue1],
            this.palette[hue2],
            hue - hue1
        );
    }

    /**
     * Pixel by pixel generator
     */
    *pixelGenerator() {
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                yield this.calculate(x, y);
            }
        }
    }

    /**
     * Line by line generator
     */
    *lineGenerator() {
        for (let y = 0; y < this.height; ++y) {
            let buffer = new Uint8ClampedArray(this.width*4);

            for (let x = 0; x < this.width; ++x) {
                buffer.set(this.calculate(x, y), 4*x);
            }

            yield buffer;
        }
    }

    getData() {
        let buffer = new Uint8ClampedArray(this.width*this.height*4);

        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                buffer.set(this.calculate(x, y), (y*this.width + x)*4);
            }
        }

        return buffer;
    }
}
