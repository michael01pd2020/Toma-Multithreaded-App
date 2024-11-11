export function intensiveCPUWork(n: number): void {
    for (let i = 0; i < n * 1000000; i++) {
        Math.sqrt(i);
    }
}

export async function calculateFactorial(n: number): Promise<bigint> {
    if (n < 0) {
        throw new Error('Factorial not defined for negative numbers');
    }
    
    if (n === 0) {
        return 1n;
    }
    
    let result = 1n;
    for (let i = 1n; i <= BigInt(n); i++) {
        result *= i;
    }
    
    return result;
}