export interface IMap<V> {
    [key: string]: V
}



export class TLineItem {
    line_id: number;
    debug: string;
    target: number;
    probability: number;
}

export class FileItem {
    txtFileName: string
    txtFilePath: string
    name: string;
    lineCount: number;
    useForTraining: 0 | 1;
    grp: string;
    subGrp: string;

    public setName(name) {
        this.name = name;
    }
}

export class PLineItem extends TLineItem {
    predict: number
}

export class ClassDetails {
    label: string | number
    actual: number = 0;
    correctPrediction: number = 0;
    score: number = 0.0;
    wrongPrediction: number = 0;

    //predictions: Map<string | number, number> = new Map();

    constructor(label) {
        this.label = label;
    }
    setActual(actual): void {
        this.actual = actual;
        this.calcScore()
    }

    setPrediction(prediction): void {
        this.correctPrediction = prediction;
        this.calcScore()
    }
    public incrementActual() {
        this.setActual(this.actual + 1)
    }

    public incrementPrediction(label, prediction: boolean) {
        if (prediction)
            this.setPrediction(this.correctPrediction + 1)
        /*
                if (this.predictions.has(label)) {
                    this.predictions.set(label, this.predictions.get(label) + 1);
                }
                else {
                    this.predictions.set(label, 1);
                }
                */
    }


    calcScore() {
        this.wrongPrediction = this.actual - this.correctPrediction;
        this.score = (this.actual > 0) ? 100 * (this.correctPrediction / this.actual) : 0;
    }


}

interface IPrediction {
    target: string | number;
    predict: string | number;
}


export class Accuracy {
    total: number = 0;
    lableMap: Map<string | number, ClassDetails> = new Map();
    labels: Array<ClassDetails> = [];
    score: number = 0.0

    confusionMatrix: Array<Array<any>> = [[]];

    constructor(prediction: Array<IPrediction>) {
        this.total = prediction.length;
        this.calc(prediction);
    }

    calc(prediction: Array<IPrediction>) {
        prediction.forEach((result: IPrediction) => {
            var label: ClassDetails
            if (this.lableMap.has(result.target)) {
                label = this.lableMap.get(result.target)

            }
            else {
                label = new ClassDetails(result.target);
                this.lableMap.set(label.label, label);
            }

            label.incrementActual();
            label.incrementPrediction(result.predict, result.target == result.predict)
            //if (result.target == result.predict) { label.incrementPrediction() }
            //else { label.incrementWrongPredection(result.predict) }
            //console.log(label)
        })
        this.labels = [];
        this.lableMap.forEach((val: ClassDetails, key: any) => {
            this.labels.push(val);
            this.score += val.score;
        });
        this.score = this.score / this.labels.length;


    }



}