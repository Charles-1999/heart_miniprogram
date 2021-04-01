export default function PeakCount(frameData) {
    var peak = 0;
    var peakNtrough = new Array(frameData.length).fill('');

    for (var low = 0, middle = 1, high = 2; high < frameData.length; high++) {
        //令data[low]不等于data[middle]
        while (middle < frameData.length && frameData[middle] === frameData[low]) {
            middle++;
        }

        high = middle + 1;

        //令data[high]不等于data[middle]
        while (high < frameData.length && frameData[high] === frameData[middle]) {
            high++;
        }

        if (high >= frameData.length) {
            break;
        }

        //检测是否为峰值
        if (frameData[middle] > frameData[low] && frameData[middle] > frameData[high]) {
            peakNtrough[middle] = 1;       //1代表波峰
        } else if (frameData[middle] < frameData[low] && frameData[middle] < frameData[high]) {
            peakNtrough[middle] = -1;      //-1代表波谷
        }

        low = middle;
        middle = high;
    }

    //计算均值
    var avg = 0;
    for (var i = 0; i < frameData.length; i++) {
        avg += Number(frameData[i])
    }
    avg /= frameData.length;

    //排除大于均值的波谷和小于均值的波峰
    for (var i = 0; i < peakNtrough.length; i++) {
        if ((peakNtrough[i] > 0 && frameData[i] < avg) || (peakNtrough[i] < 0 && frameData[i] > avg)) {
            peakNtrough[i] = 0;
        }
    }

    var frames = [];
    //统计波峰数量
    for (var i = 0; i < peakNtrough.length;) {
        while (i < peakNtrough.length && peakNtrough[i] <= 0) {
            i++;
        }

        if (i >= peakNtrough.length) {
            break;
        }

        peak++;
        

        while (i < peakNtrough.length && peakNtrough[i] >= 0) {
            i++;
        }
        
        frames.push(i);
        
    }

    var avgInterval = 0;
    for(var i = 1; i < frames.length; i++){
        avgInterval += frames[i] - frames[i -1];
    }
    avgInterval /= frames.length;

    var final_count = [];//心跳帧

    final_count.push(frames[0])
    var ld = 1; //上一个有效帧
    for(var i = 1; i < frames.length; i++){        
        if(frames[i] - frames[i - ld] > avgInterval){
            final_count.push(frames[i]);
            ld = 1;
        }else{
            ld++;
        }
    }

    return final_count;
}

module.exports = PeakCount;