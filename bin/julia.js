var Jimp = require("jimp");
var mandelbrot = require("../mandelbrot-set.js");

function createImage() {
    return new Promise(resolve => {
        let formula = new mandelbrot.JuliaSetFormula({
            iterations: 250,
            radius: 2**2,
            smooth: true
        });
        let mandelbrotSet = new mandelbrot.FractalGenerator({
            width: 2560,
            height: 1920,
            interior: false,
            axes: true,
            formula: formula,
            palette: "ultra-fractal-5"
        });
        let image = Object.create(Jimp.prototype);
        image.bitmap = {
            data: mandelbrotSet.getData(),
            width: mandelbrotSet.width,
            height: mandelbrotSet.height
        };
        resolve(image);
    });
}

createImage().then(function(image) {
    image.write("julia.jpg");
}).catch(function(reason) {
    console.log(reason);
});

/*
            extent: {
                x_min: -0.753501752448,
                x_max: -0.732558247552,
                y_min:  0.134286814336,
                y_max:  0.118579185664
            }
*/