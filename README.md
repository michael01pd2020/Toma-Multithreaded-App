# Multithreaded Calculator with Real-time Monitoring

A high-performance factorial calculator built with Bun that demonstrates multithreading, WebSocket communication, and real-time monitoring capabilities.

## Features

- **Multithreaded Processing**: Utilizes a pool of worker threads to handle calculations in parallel
- **Real-time Monitoring**: WebSocket-based dashboard showing worker status and performance metrics
- **Load Balancing**: Automatically distributes tasks across available workers
- **CPU-intensive Calculations**: Handles factorial calculations with simulated workload
- **Interactive Dashboard**: Visual representation of worker status and task progress
- **IPC (Inter-Process Communication)**: Workers communicate status and progress updates

## Prerequisites

- [Bun](https://bun.sh/) runtime installed
- Modern web browser for monitoring dashboard

## Installation

1. Install Bun if you haven't already:

''' 
bash
curl -fsSL https://bun.sh/install | bash
'''

2. Clone the repository:

''' 
bash
git clone <repository-url>
cd multihead
'''

3. Install dependencies:

''' 
bash
bun install
'''

## Running the Application

1. Start the server:

''' 
bash
bun run dev
'''

2. Open the monitoring dashboard:

''' 
bash
open http://localhost:3000/monitor
'''

## Testing the Application

### Basic Tests
Single calculation:

''' 
bash
curl "http://localhost:3000/calculate?number=10"
'''

### Parallel Tests
Multiple simultaneous calculations:

''' 
bash
curl "http://localhost:3000/calculate?number=5" & \
curl "http://localhost:3000/calculate?number=10" & \
curl "http://localhost:3000/calculate?number=15" & \
curl "http://localhost:3000/calculate?number=20"
'''

### Load Testing Script
Create and run a load test:

''' 
bash
Create test script
echo '#!/bin/bash
for i in {1..5}; do
echo "=== Batch $i ==="
curl "http://localhost:3000/calculate?number=5" & \
curl "http://localhost:3000/calculate?number=10" & \
curl "http://localhost:3000/calculate?number=15" & \
curl "http://localhost:3000/calculate?number=20"
echo ""
sleep 2
done' > test.sh
Make executable
chmod +x test.sh
Run tests
./test.sh
'''

## Project Structure

multihead/
├── src/
│ ├── main.ts # Server setup and route handling
│ ├── types/
│ │ └── ipc.ts # TypeScript interfaces for IPC
│ ├── utils/
│ │ ├── calculations.ts # Factorial calculation logic
│ │ └── WorkerManager.ts # Worker pool management
│ └── workers/
│ └── calculationWorker.ts # Worker thread implementation
├── public/
│ └── monitor.html # Real-time monitoring dashboard
├── package.json
└── README.md



## How It Works

1. **Server Initialization**
   - Creates a pool of worker threads
   - Sets up WebSocket server for real-time monitoring
   - Initializes HTTP endpoints

2. **Worker Management**
   - WorkerManager maintains a pool of worker threads
   - Distributes incoming calculation requests
   - Tracks worker status and performance metrics

3. **Calculation Process**
   - Incoming requests are assigned to available workers
   - Workers perform factorial calculations with simulated CPU load
   - Results are returned to clients

4. **Real-time Monitoring**
   - WebSocket connections maintain live dashboard updates
   - Monitor shows worker status, task progress, and performance metrics
   - System provides visual feedback for worker activity

5. **IPC System**
   - Workers communicate status updates to main thread
   - Main thread broadcasts updates to connected monitoring clients
   - Enables real-time visualization of system state

## API Endpoints

- `GET /calculate?number=<value>`: Calculate factorial of a number
- `GET /monitor`: Access the monitoring dashboard
- WebSocket endpoint for real-time updates

## Performance Considerations

- System utilizes multiple worker threads for parallel processing
- Load balancing ensures even distribution of tasks
- Real-time monitoring helps identify performance bottlenecks

## Error Handling

- Input validation for calculation requests
- Worker error recovery
- WebSocket connection management
- Graceful degradation under heavy load

## Contributing

Feel free to submit issues and pull requests.
