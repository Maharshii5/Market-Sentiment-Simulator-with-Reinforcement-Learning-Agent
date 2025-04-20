import * as tf from '@tensorflow/tfjs';

export class TradingAgent {
  private model: tf.LayersModel;
  private stateDim: number;
  private actionDim: number;
  private learningRate: number;
  private gamma: number;
  private epsilon: number;

  constructor(stateDim: number = 10, actionDim: number = 3) {
    this.stateDim = stateDim;
    this.actionDim = actionDim;
    this.learningRate = 0.001;
    this.gamma = 0.99;
    this.epsilon = 0.1;
    this.buildModel();
  }

  private buildModel() {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [this.stateDim]
    }));
    
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: this.actionDim,
      activation: 'softmax'
    }));

    model.compile({
      optimizer: tf.train.adam(this.learningRate),
      loss: 'meanSquaredError'
    });

    this.model = model;
  }

  async predict(state: number[]): Promise<number[]> {
    const stateTensor = tf.tensor2d([state]);
    const prediction = await this.model.predict(stateTensor) as tf.Tensor;
    const actionProbs = await prediction.array() as number[][];
    return actionProbs[0];
  }

  async act(state: number[]): Promise<number> {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.actionDim);
    }
    
    const actionProbs = await this.predict(state);
    return actionProbs.indexOf(Math.max(...actionProbs));
  }

  async train(state: number[], action: number, reward: number, nextState: number[]) {
    const stateTensor = tf.tensor2d([state]);
    const nextStateTensor = tf.tensor2d([nextState]);
    
    const currentQ = await this.model.predict(stateTensor) as tf.Tensor;
    const nextQ = await this.model.predict(nextStateTensor) as tf.Tensor;
    
    const currentQArray = await currentQ.array() as number[][];
    const nextQArray = await nextQ.array() as number[][];
    
    const target = currentQArray[0];
    target[action] = reward + this.gamma * Math.max(...nextQArray[0]);
    
    await this.model.fit(stateTensor, tf.tensor2d([target]), {
      epochs: 1,
      verbose: 0
    });
  }

  getState(price: number, volume: number, sentiment: number): number[] {
    return [
      price,
      volume,
      sentiment,
      // Add more features as needed
    ];
  }

  interpretDecision(action: number): 'BUY' | 'SELL' | 'HOLD' {
    const actions: ('BUY' | 'SELL' | 'HOLD')[] = ['BUY', 'SELL', 'HOLD'];
    return actions[action];
  }
}