var Jimp = require("jimp");
var mandelbrot = require("../mandelbrot-set.js");

function createImage() {
    return new Promise(resolve => {
        let formula = new mandelbrot.MandelbrotSetFormula({
            iterations: 250,
            radius: 2**16,
            smooth: true
        });
        let mandelbrotSet = new mandelbrot.FractalGenerator({
            width: 2560,
            height: 1920,
            interior: false,
            axes: true,
            formula: formula,
            palette: "ultra-fractal-5",
            extent: { x_min: -0.9706332992849847, y_min: -0.3508682328907049, x_max: -0.6304902962206334, y_max: -0.05362614913176711 }
        });
        let image = new Jimp(mandelbrotSet.width, mandelbrotSet.height, (er, image) => {
			image.bitmap.data = mandelbrotSet.getData();
			resolve(image);
        });
    });
}

createImage().then(function(image) {
    image.write("mandelbrot.jpg");
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