import Jimp from 'jimp';
import * as mandelbrot from '../mandelbrot-set.js';

function createImage() {
    return new Promise(resolve => {
        let formula = new mandelbrot.JuliaSetFormula({
            iterations: 2500,
            radius: 2**8,
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
        let image = new Jimp({
            data: mandelbrotSet.getData(),
            width: mandelbrotSet.width,
            height: mandelbrotSet.height
        });
        resolve(image);
    });
}

createImage().then(function(image) {
    image.write("julia.jpg");
}).catch(function(reason) {
    console.log(reason);
});
