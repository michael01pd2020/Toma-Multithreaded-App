export interface WorkerMessage {
    type: 'STATUS' | 'RESULT' | 'ERROR' | 'PROGRESS';
    workerId: number;
    data: any;
    timestamp: number;
  }
  
  export interface WorkerStatus {
    workerId: number;
    status: 'idle' | 'busy';
    currentTask?: number;
    completedTasks: number;
    totalProcessingTime: number;
  }