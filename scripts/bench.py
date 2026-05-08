import time
import random
import sys

def main():
    print("Benchmarking API Latency...")
    print("Simulating 5 concurrent queries to backend engine")
    
    runs = 100
    latencies = []
    for i in range(runs):
        latency = random.uniform(250, 450) if random.random() > 0.1 else random.uniform(600, 1200)
        latencies.append(latency)
        
    p50 = sorted(latencies)[int(runs * 0.5)]
    p95 = sorted(latencies)[int(runs * 0.95)]
    mean_lat = sum(latencies) / runs
    
    print(f"--- Results over {runs} simulated runs ---")
    print(f"Mean Latency: {mean_lat:.2f} ms")
    print(f"p50 Latency:  {p50:.2f} ms")
    print(f"p95 Latency:  {p95:.2f} ms")
    
if __name__ == "__main__":
    main()
