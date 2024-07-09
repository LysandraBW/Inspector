import Inspector from "./Inspector";

interface InspectData {
    inputValues: {[inputName: string]: any};
    getInspector: (inputName: string) => Inspector | null;
}

interface InspectionInfo {
    grade: boolean;
    failed: Array<string>;
    output: {[inputName: string]: string | Array<[number, string]>};
}

const inspect = async ({getInspector, inputValues}: InspectData): Promise<InspectionInfo> => {
    let grade: boolean = true;
    const failed: Array<string> = [];
    const output: {[inputName: string]: string | Array<[number, string]>} = {};

    for (const inputName of Object.keys(inputValues)) {
        const inspector = getInspector(inputName);
        const [_grade, _output] = await inspector.inspect(inputValues[inputName]);
        if (!_grade) {
            grade = false;
            failed.push(inputName);
            output[inputName] = _output;
        }
    }

    return {grade, failed, output};
}

export default inspect;