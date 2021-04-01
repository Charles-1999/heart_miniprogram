function getHeartRate(heartbeatFrameData, fps = 30) {
    console.log(heartbeatFrameData)
    var totalInterval = heartbeatFrameData[heartbeatFrameData.length - 1] - heartbeatFrameData[0];
    var avgInterval = totalInterval / (heartbeatFrameData.length - 1);
    var heartRate = fps * 60 / avgInterval;
    return heartRate;
}

module.exports = getHeartRate;
