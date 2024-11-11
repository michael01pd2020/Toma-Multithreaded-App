import { Worker } from "worker_threads";
import { WebSocket } from "bun";
import { WorkerMessage, WorkerStatus } from "../types/ipc";

export class WorkerManager {
    private workers: Worker[] = [];
    private workerStatus: Map<number, WorkerStatus> = new Map();
    private connectedClients: Set<WebSocket> = new Set();

    constructor(private maxWorkers: number) {
        this.initializeWorkers();
    }

    private initializeWorkers() {
        for (let i = 0; i < this.maxWorkers; i++) {
            const worker = new Worker(new URL('../workers/calculationWorker.ts', import.meta.url));
            this.workers.push(worker);
            this.workerStatus.set(i, {
                workerId: i,
                status: 'idle',
                completedTasks: 0,
                totalProcessingTime: 0
            });
            console.log(`Worker ${i} initialized`);
        }
    }

    public addWebSocketClient(ws: WebSocket) {
        this.connectedClients.add(ws);
        this.broadcastStatus();
    }

    public removeWebSocketClient(ws: WebSocket) {
        this.connectedClients.delete(ws);
    }

    private broadcastStatus() {
        const status = {
            type: 'SYSTEM_STATUS',
            data: {
                workers: Array.from(this.workerStatus.values()),
                timestamp: Date.now()
            }
        };
        
        this.connectedClients.forEach(client => {
            try {
                // Check if client is ready using Bun's WebSocket states
                if (client.readyState === 1) { // 1 is OPEN in WebSocket standard
                    client.send(JSON.stringify(status));
                }
            } catch (error) {
                console.error('Error broadcasting to client:', error);
                this.connectedClients.delete(client);
            }
        });
    }

    public async scheduleTask(number: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const availableWorker = this.workers.find((_, index) => 
                this.workerStatus.get(index)?.status === 'idle'
            );

            if (!availableWorker) {
                reject(new Error('No workers available'));
                return;
            }

            const workerId = this.workers.indexOf(availableWorker);
            const startTime = Date.now();

            // Update worker status to busy
            this.updateWorkerStatus(workerId, 'busy');

            const handleMessage = (result: any) => {
                const processingTime = Date.now() - startTime;
                
                // Update worker status
                const status = this.workerStatus.get(workerId);
                if (status) {
                    status.completedTasks += 1;
                    status.totalProcessingTime += processingTime;
                    status.status = 'idle';
                    this.workerStatus.set(workerId, status);
                }

                // Broadcast updated status
                this.broadcastStatus();

                // Clean up listener
                availableWorker.removeListener('message', handleMessage);

                // Resolve with result
                resolve({
                    input: number,
                    result: result,
                    timeMs: processingTime,
                    workerId
                });
            };

            availableWorker.on('message', handleMessage);
            availableWorker.postMessage(number);
        });
    }

    private updateWorkerStatus(workerId: number, status: 'idle' | 'busy') {
        const workerStatus = this.workerStatus.get(workerId);
        if (workerStatus) {
            workerStatus.status = status;
            this.workerStatus.set(workerId, workerStatus);
            this.broadcastStatus();
        }
    }
}
