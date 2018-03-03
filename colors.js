
var palettes = {
    "default": [
        new Uint8ClampedArray([  9,   1,  47, 255]),
        new Uint8ClampedArray([  4,   4,  73, 255]),
        new Uint8ClampedArray([  0,   7, 100, 255]),
        new Uint8ClampedArray([ 12,  44, 138, 255]),
        new Uint8ClampedArray([ 24,  82, 177, 255]),
        new Uint8ClampedArray([ 57, 125, 209, 255]),
        new Uint8ClampedArray([134, 181, 229, 255]),
        new Uint8ClampedArray([211, 236, 248, 255]),
        new Uint8ClampedArray([241, 233, 191, 255]),
        new Uint8ClampedArray([248, 201,  95, 255]),
        new Uint8ClampedArray([255, 170,   0, 255]),
        new Uint8ClampedArray([204, 128,   0, 255]),
        new Uint8ClampedArray([153,  87,   0, 255]),
        new Uint8ClampedArray([106,  52,   3, 255]),
        new Uint8ClampedArray([66,   30,  15, 255]),
        new Uint8ClampedArray([25,    7,  26, 255])
    ],
    "grey": [
        new Uint8ClampedArray([  0,   0,   0, 255]),
        new Uint8ClampedArray([ 16,  16,  16, 255]),
        new Uint8ClampedArray([ 32,  32,  32, 255]),
        new Uint8ClampedArray([ 48,  48,  48, 255]),
        new Uint8ClampedArray([ 64,  64,  64, 255]),
        new Uint8ClampedArray([ 80,  80,  80, 255]),
        new Uint8ClampedArray([ 96,  96,  96, 255]),
        new Uint8ClampedArray([112, 112, 112, 255]),
        new Uint8ClampedArray([128, 128, 128, 255]),
        new Uint8ClampedArray([144, 144, 144, 255]),
        new Uint8ClampedArray([160, 160, 160, 255]),
        new Uint8ClampedArray([176, 176, 176, 255]),
        new Uint8ClampedArray([192, 192, 192, 255]),
        new Uint8ClampedArray([210, 210, 210, 255]),
        new Uint8ClampedArray([228, 228, 228, 255]),
        new Uint8ClampedArray([255, 255, 255, 255])
    ],
    "ultra-fractal-5": [
        new Uint8ClampedArray([  0,  7,  100, 255]),
        new Uint8ClampedArray([  4,  32, 154, 255]),
        new Uint8ClampedArray([ 21,  84, 191, 255]),
        new Uint8ClampedArray([ 54, 142, 218, 255]),
        new Uint8ClampedArray([119, 194, 239, 255]),
        new Uint8ClampedArray([185, 234, 250, 255]),
        new Uint8ClampedArray([230, 254, 255, 255]),
        new Uint8ClampedArray([249, 251, 226, 255]),
        new Uint8ClampedArray([252, 232, 122, 255]),
        new Uint8ClampedArray([255, 199,  25, 255]),
        new Uint8ClampedArray([249, 149,   0, 255]),
        new Uint8ClampedArray([156,  81,   0, 255]),
        new Uint8ClampedArray([44,   22,   0, 255]),
        new Uint8ClampedArray([0,     2,   2, 255]),
        new Uint8ClampedArray([0,     4,  38, 255]),
        new Uint8ClampedArray([0,     6, 100, 255])
    ]
};

function makeRGB(C, H, m, alpha) {
    let X = C * (1 - Math.abs((H % 2) - 1));
    let RGB = [0, 0, 0];

    if (H >= 0 && H < 1) {
        RGB = [C, X, 0];
    } else if (H >= 1 && H < 2) {
        RGB = [X, C, 0];
    } else if (H >= 2 && H < 3) {
        RGB = [0, C, X];
    } else if (H >= 3 && H < 4) {
        RGB = [0, X, C];
    } else if (H >= 4 && H < 5) {
        RGB = [X, 0, C];
    } else if (H >= 5 && H <= 6) {
        RGB = [C, 0, X];
    }

    let buffer = new Uint8ClampedArray(4);

    buffer[0] = Math.round((RGB[0] + m) * 255);
    buffer[1] = Math.round((RGB[1] + m) * 255);
    buffer[2] = Math.round((RGB[2] + m) * 255);
    buffer[3] = Math.round(alpha * 255);

    return buffer;
}

function HSL2RGB(hue, saturation, lightness, alpha = 1) {
    let C = (1 - Math.abs(2*lightness - 1)) * saturation;
    let H = hue/60.0;
    let m = lightness - C/2;

    return makeRGB(C, H, m, alpha);
}

function HSV2RGB(hue, saturation, value, alpha = 1) {
    let C = value * saturation;
    let H = hue/60.0;
    let m = value - C;

    return makeRGB(C, H, m, alpha);
}

function interpolate(color1, color2, fraction) {
    return new Uint8ClampedArray([
        color1[0] + (color2[0] - color1[0]) * fraction,
        color1[1] + (color2[1] - color1[1]) * fraction,
        color1[2] + (color2[2] - color1[2]) * fraction,
        color1[3] + (color2[3] - color1[3]) * fraction
    ]);
}


exports.HSL2RGB = HSL2RGB;
exports.HSV2RGB = HSV2RGB;
exports.interpolate = interpolate;
exports.palettes = palettes;
