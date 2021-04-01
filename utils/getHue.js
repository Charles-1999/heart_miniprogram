// frameDatum: 每一帧数据(宽*高*通道数 = 长度的数组)
export default function getHueFromRBG(frameDatum) {
    var hue_data_sum_perFrame = 0;
    var h = 0, s = 0, v = 0;
    for(var i = 0; i < frameDatum.length; i++){
        var r = frameDatum[i++];
        var g = frameDatum[i++];
        var b = frameDatum[i++];
        var arr = [];
        arr.push(r);
        arr.push(g);
        arr.push(b);
        arr.sort(function (a1, a2) {
            return a1 - a2;
        })
        var max = arr[2]
        var min = arr[0];
        // v = max / 255;
        if (max === 0) {
            s = 0;
        } else {
            s = 1 - (min / max);
        }
        if (max === min) {
            h = 0;
        } else if (max === r && g >= b) {
            h = 60 * ((g - b) / (max - min)) + 0;
        } else if (max === r && g < b) {
            h = 60 * ((g - b) / (max - min)) + 360
        } else if (max === g) {
            h = 60 * ((b - r) / (max - min)) + 120
        } else if (max === b) {
            h = 60 * ((r - g) / (max - min)) + 240
        }
        h = parseInt(h);
        // s = parseInt(s * 100);
        // v = parseInt(v * 100);
        hue_data_sum_perFrame += h;
    }
    return hue_data_sum_perFrame;
}

module.exports = getHueFromRBG;