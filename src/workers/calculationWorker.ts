import { parentPort } from "worker_threads";
import { calculateFactorial } from "../utils/calculations";

if (parentPort) {
    parentPort.on('message', async (number: number) => {
        try {
            const result = await calculateFactorial(number);
            parentPort?.postMessage(result.toString());
        } catch (error) {
            parentPort?.postMessage({ error: error.message });
        }
    });
}
