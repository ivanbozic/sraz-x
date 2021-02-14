class AudioEngineSingleton {
    constructor(options) {
        this.enabled = options.enabled;
    }

    play(identifier) {
        if (!this.enabled) return;

        const audioFile = new Audio(`audio/${identifier}.wav`);
        
        audioFile.play();
    }
}