const formatTime = (totalSeconds) =>  {
    let hours = Math.floor(totalSeconds / 3600);
    let seconds = totalSeconds % 3600;

    // If hours or seconds are less than 10, prepend a '0'
    hours = hours < 10 ? '0' + hours : hours;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    console.log(`${hours}:${seconds}`, totalSeconds)
    return `${hours}:${seconds}`;
}

module.exports = formatTime;