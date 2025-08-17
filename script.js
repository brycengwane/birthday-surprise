document.addEventListener("DOMContentLoaded", function () {
    const cake = document.querySelector(".cake");
    const candleCountDisplay = document.getElementById("candleCount");
    const playSongBtn = document.getElementById('playSongBtn');
    const birthdaySong = document.getElementById('birthdaySong');
    let candles = [];
    let audioContext;
    let analyser;
    let microphone;

    // This function creates and places a new candle on the cake.
    function addCandle(left, top) {
        const candle = document.createElement("div");
        candle.className = "candle";
        candle.style.left = left + "px";
        candle.style.top = top + "px";

        const flame = document.createElement("div");
        flame.className = "flame";
        candle.appendChild(flame);

        cake.appendChild(candle);
        candles.push(candle);
        updateCandleCount();
    }
    
    // This function updates the text display to show how many candles are left.
    function updateCandleCount() {
        const activeCandles = candles.filter(
            (candle) => !candle.classList.contains("out")
        ).length;
        candleCountDisplay.textContent = activeCandles;
    }

    // This event listener adds a new candle whenever you click on the cake.
    cake.addEventListener("click", function (event) {
        const rect = cake.getBoundingClientRect();
        const left = event.clientX - rect.left;
        const top = event.clientY - rect.top;
        addCandle(left, top);
    });

    // This function checks the microphone for a loud sound (like a puff of air).
    function isBlowing() {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        let average = sum / bufferLength;

        // The "40" is a threshold. You might need to adjust this value.
        return average > 40; 
    }

    // This function turns off the flames when it detects a "blow" sound.
    function blowOutCandles() {
        let blownOut = 0;

        if (isBlowing()) {
            candles.forEach((candle) => {
                // Randomly "blow out" some candles with each puff.
                if (!candle.classList.contains("out") && Math.random() > 0.5) {
                    candle.classList.add("out");
                    blownOut++;
                }
            });
        }

        if (blownOut > 0) {
            updateCandleCount();
        }
    }

    // This part of the code asks for microphone permission and starts the detection process.
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(function (stream) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256;
                // This checks for a blowing sound every 200 milliseconds.
                setInterval(blowOutCandles, 200);
            })
            .catch(function (err) {
                console.log("Unable to access microphone: " + err);
            });
    } else {
        console.log("getUserMedia not supported on your browser!");
    }

    // Play the birthday song when the button is clicked.
    playSongBtn.addEventListener('click', function() {
        birthdaySong.play();
    });
});