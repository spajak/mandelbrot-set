import Jimp from 'jimp';
import * as mandelbrot from '../mandelbrot-set.js';

function createImage() {
    return new Promise(resolve => {
        let formula = new mandelbrot.MandelbrotSetFormula({
            iterations: 500,
            radius: 2**16,
            smooth: true
        });
        let mandelbrotSet = new mandelbrot.FractalGenerator({
            width: 2560,
            height: 1920,
            interior: false,
            axes: true,
            formula: formula,
            palette: "default",
            extent: { x_min: -1.0268373271737288, y_min: -0.3228901207293538, x_max: -0.9611859062531481, y_max: -0.2755397596229174 }
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
