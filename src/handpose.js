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
    maxHands: 1,
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

export const drawHand = (keypointsList, ctx) => {
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6],
      [6, 7], [7, 8], [0, 9], [9, 10], [10, 11], [11, 12],
      [0, 13], [13, 14], [14, 15], [15, 16], [0, 17], [17, 18],
      [18, 19], [19, 20]
    ];
    // Clear the canvas
    keypointsList.forEach((keypoints) => {
      keypoints["coords"] = keypoints["coords"].map(point => [ point[0], point[1], point[2]]);
      ctx.strokeStyle = keypoints["isLeft"] ? 'lime' : 'cyan';
      connections.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(keypoints["coords"][start][0], keypoints["coords"][start][1]);
        ctx.lineTo(keypoints["coords"][end][0], keypoints["coords"][end][1]);
        ctx.lineWidth = 5;
        ctx.stroke();
      });
      
      // Draw keypoints
      ctx.fillStyle = keypoints["isLeft"] ? 'red' : 'blue';
      keypoints["coords"].forEach(point => {
        ctx.beginPath();
        ctx.arc(point[0], point[1], 5, 0, 10 * Math.PI);
        ctx.fill();
      });
    })
}