const workBgm = "BGM/task/Secret_Talk_2.mp3"
const breakBgm = "BGM/break/oyasuminasai.mp3"

class PomodoroTimer {

    constructor() {
        this.workTime = 25 * 60; // 25分
        this.breakTime = 5 * 60;  // 5分
        this.timeLeft = this.workTime;
        this.isRunning = false;
        this.isWorkMode = true;
        this.timer = null;

        // DOM要素
        this.timeDisplay = document.querySelector('.time');
        this.modeDisplay = document.querySelector('.mode');
        this.progressCircle = document.querySelector('.progress-ring__circle-progress');
        this.container = document.querySelector('.container');

        // ボタン
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');

        // 音声
        this.workAudio = document.getElementById('workAudio');
        this.breakAudio = document.getElementById('breakAudio');
        this.volumeControlBGM = document.getElementById('volumeControlBGM');

        // イベントリスナー
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());

        this.volumeControlBGM.addEventListener('input', () => {
            this.workAudio.volume = this.volumeControlBGM.value;
        });

        // 円形プログレスバーの設定
        const radius = this.progressCircle.r.baseVal.value;
        this.circumference = radius * 2 * Math.PI;
        this.progressCircle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.progressCircle.style.strokeDashoffset = this.circumference;

        this.updateDisplay();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timer = setInterval(() => this.tick(), 1000);
            this.playBGM();
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timer);
            this.pauseBGM();
        }
    }

    reset() {
        this.pause();
        this.isWorkMode = true;
        this.timeLeft = this.workTime;
        this.updateDisplay();
        this.container.classList.remove('break-mode');
        this.container.classList.add('work-mode');
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.switchMode();
        }
    }

    switchMode() {
        this.isWorkMode = !this.isWorkMode;
        this.timeLeft = this.isWorkMode ? this.workTime : this.breakTime;
        this.updateDisplay();
        this.playBGM();

        if (this.isWorkMode) {
            this.container.classList.remove('break-mode');
            this.container.classList.add('work-mode');
        } else {
            this.container.classList.remove('work-mode');
            this.container.classList.add('break-mode');
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.modeDisplay.textContent = this.isWorkMode ? '作業時間' : '休憩時間';

        // プログレスバーの更新
        const totalTime = this.isWorkMode ? this.workTime : this.breakTime;
        const progress = this.timeLeft / totalTime;
        const offset = this.circumference - (progress * this.circumference);
        this.progressCircle.style.strokeDashoffset = offset;
    }

    playBGM() {
        if (this.isWorkMode) {
            this.workAudio.src = workBgm;
            this.workAudio.play();
        } else {
            this.workAudio.src = breakBgm;
            this.workAudio.play();
        }
    }

    pauseBGM() {
        this.workAudio.pause();
    }

}

// タイマーの初期化
const pomodoro = new PomodoroTimer();
