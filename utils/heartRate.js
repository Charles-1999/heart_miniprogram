function getHeartRate(heart_rate_frame_data, fps = 30) {
    // console.log(heart_rate_frame_data, fps)
    let heart_rate_distance = [], heart_rates = [], total_interval = 0, avg_interval;
    for (let i = 1; i < heart_rate_frame_data.length; i++) {
        heart_rate_distance.push(heart_rate_frame_data[i] - heart_rate_frame_data[i - 1]);
    }
    total_interval = heart_rate_frame_data[heart_rate_frame_data.length - 1] - heart_rate_frame_data[0];
    avg_interval = total_interval / (heart_rate_frame_data.length - 1);

    heart_rates.push(parseInt(fps * 60 / Math.max(...heart_rate_distance)));
    heart_rates.push(parseInt(fps * 60 / Math.min(...heart_rate_distance)));
    heart_rates.push(parseInt(fps * 60 / avg_interval));
    // console.log(heart_rate_distance);

    let rr_sum = 0, hrv_sdnn = 0;
    for (let d in heart_rate_distance) {
        rr_sum == ((avg_interval - d) / fps) ** 2;
    }
    hrv_sdnn = (rr_sum / heart_rate_distance.length) ** 0.5;
    heart_rates.push(parseInt(hrv_sdnn * 100));
    return heart_rates;
}

module.exports = getHeartRate;
