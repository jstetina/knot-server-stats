import json
import os
import subprocess


def run_command(command):
    """Run a shell command and return the output."""
    try:
        result = subprocess.check_output(command, shell=True, text=True).strip()
        return result
    except subprocess.CalledProcessError:
        return None


def get_cpu_usage():
    """Get CPU usage."""
    cpu_usage = run_command(
        "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'"
    )
    return {"cpu_usage": f"{cpu_usage}%" if cpu_usage else "N/A"}


def get_memory_usage():
    """Get memory usage."""
    memory = run_command("free -h | grep Mem | awk '{print $3, $4}'")
    if memory:
        used, free = memory.split()
        return {"memory_usage": {"used": used, "free": free}}
    return {"memory_usage": "N/A"}


def get_disk_usage():
    """Get disk usage."""
    disks = run_command("df -h | grep '^/dev/' | awk '{print $1, $5}'")
    disk_info = {}
    if disks:
        for line in disks.splitlines():
            disk, usage = line.split()
            disk_info[disk] = usage
    return {"disk_usage": disk_info}


def get_gpu_usage():
    """Get NVIDIA GPU usage if available."""
    if run_command("command -v nvidia-smi"):
        gpu_info = run_command(
            "nvidia-smi --query-gpu=name,temperature.gpu,utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits"
        )
        if gpu_info:
            gpu_details = []
            for line in gpu_info.splitlines():
                name, temp, utilization, mem_used, mem_total = line.split(", ")
                gpu_details.append(
                    {
                        "name": name,
                        "temperature": f"{temp}C",
                        "utilization": f"{utilization}%",
                        "memory_used": f"{mem_used}MiB",
                        "memory_total": f"{mem_total}MiB",
                    }
                )
            return {"gpu_usage": gpu_details}
    return {"gpu_usage": "GPU not detected"}


def get_uptime():
    """Get server uptime."""
    uptime = run_command("uptime -p")
    return {"uptime": uptime.replace("up ", "") if uptime else "N/A"}


def get_network_usage():
    """Get network usage."""
    network_data = run_command(
        'ip -s link | awk \'/^[0-9]+:/{gsub(":",""); iface=$2} iface~/^e/{getline; rx=$1; getline; tx=$1; printf "%s %s %s\\n", iface, rx, tx}\''
    )
    network_info = {}
    if network_data:
        for line in network_data.splitlines():
            iface, rx, tx = line.split()
            network_info[iface] = {"rx_bytes": rx, "tx_bytes": tx}
    return {"network_usage": network_info}


def get_logged_in_users():
    """Get currently logged in users."""
    users = run_command("who | awk '{print $1, $2, $5}'")
    logged_in_users = []
    if users:
        for line in users.splitlines():
            user, tty, host = line.split()
            logged_in_users.append({"user": user, "tty": tty, "host": host})
    return {"logged_in_users": logged_in_users}


def get_running_processes():
    """Get number of running processes."""
    process_count = run_command("ps aux | wc -l")
    return {"running_processes": int(process_count) if process_count else "N/A"}


def get_hostname():
    """Get the hostname of the server."""
    hostname = run_command("hostname")
    return {"hostname": hostname if hostname else "N/A"}


def main():
    # Gather all statistics
    stats = {}
    stats.update(get_hostname())
    stats.update(get_cpu_usage())
    stats.update(get_memory_usage())
    stats.update(get_disk_usage())
    stats.update(get_gpu_usage())
    stats.update(get_uptime())
    stats.update(get_network_usage())
    stats.update(get_logged_in_users())
    stats.update(get_running_processes())

    # Output to JSON
    with open("server_stats.json", "w") as json_file:
        json.dump(stats, json_file, indent=4)

    print("Server statistics have been saved to server_stats.json")


if __name__ == "__main__":
    main()
