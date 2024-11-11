import { Worker } from "worker_threads";
import { WorkerManager } from './utils/WorkerManager';

const workerManager = new WorkerManager(4);

const server = Bun.serve({
    port: 3000,
    websocket: {
        message(ws, message) {
            console.log('Received message:', message);
        },
        open(ws) {
            console.log('WebSocket Client connected');
            workerManager.addWebSocketClient(ws);
        },
        close(ws) {
            console.log('WebSocket Client disconnected');
            workerManager.removeWebSocketClient(ws);
        },
    },
    async fetch(req) {
        const url = new URL(req.url);
        
        // Handle WebSocket upgrade
        if (req.headers.get('upgrade')?.toLowerCase() === 'websocket') {
            return server.upgrade(req);
        }

        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        };

        try {
            switch (url.pathname) {
                case '/calculate': {
                    const number = parseInt(url.searchParams.get('number') || '1');
                    console.log(`Received calculation request for ${number}`);
                    const result = await workerManager.scheduleTask(number);
                    console.log('Calculation result:', result); // Debug log
                    return new Response(JSON.stringify(result), { headers });
                }

                case '/monitor': {
                    return new Response(Bun.file('./public/monitor.html'), {
                        headers: { 'Content-Type': 'text/html' }
                    });
                }

                default:
                    return new Response(JSON.stringify({
                        error: 'Invalid endpoint',
                        usage: '/calculate?number=<value> or /monitor'
                    }), {
                        status: 400,
                        headers
                    });
            }
        } catch (error) {
            console.error('Server error:', error);
            return new Response(JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error'
            }), {
                status: 500,
                headers
            });
        }
    }
});

console.log(`Server running at http://localhost:3000`);