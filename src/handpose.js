import * as tf from '@tensorflow/tfjs';
import * as handdetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';

tfjsWasm.setWasmPaths(
    `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${
        tfjsWasm.version_wasm}/dist/`);

const model = handdetection.SupportedModels.MediaPipeHands;
const detectorConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
    maxHands: 2,
    modelType: 'full',
}
await tf.ready();

const predictModel = await tf.loadGraphModel("/best/model.json");
const map = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
       'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export const aslPredict = (input, isLeft) => {
    input = input.flat();
    input.push(isLeft ? 0 : 1)
    const tensor = tf.tensor(input, [1, 64]);

    const prediction = predictModel.predict(tensor).arraySync();

    return map[prediction[0].indexOf(Math.max(...prediction[0]))];
}

const detector = await handdetection.createDetector(model, detectorConfig);
export async function detectHands(video) {
    const hands = await detector.estimateHands(video, { flipHorizontal: true });
    return hands;
}

