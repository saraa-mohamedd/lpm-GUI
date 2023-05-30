// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use procfs::process::*;
use serde::{Deserialize, Serialize};
use std::thread;
use std::time::Duration;
use sysinfo::{CpuExt, Pid, ProcessExt, System, SystemExt};

#[derive(Deserialize, Serialize)]
struct Proc {
    name: String,
    pid: i32,
    ppid: i32,
    state: char,
    priority: i64,
    niceness: i64,
    start_time: u64,
    vsize: f32,
    rss: f32,
    threads: i64,
    cpu_time: f32,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
fn get_perc() -> Vec<f32> {
    let mut sys = System::new_all();
    sys.refresh_all();
    sys.refresh_cpu();
    std::thread::sleep(System::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu();
    let mut per: Vec<f32> = Vec::new();
    per.push(sys.global_cpu_info().cpu_usage()); //CPU%
    per.push(100.0 - sys.global_cpu_info().cpu_usage()); //100-CPU%
    per.push((sys.used_memory() as f32 / sys.total_memory() as f32) * 100.0); //MEM%
    per.push(100.0 - ((sys.used_memory() as f32 / sys.total_memory() as f32) * 100.0)); //100-MEM%
    per.push((sys.used_swap() as f32 / sys.total_swap() as f32) * 100.0); //SWAP%
    per.push(100.0 - ((sys.used_swap() as f32 / sys.total_swap() as f32) * 100.0)); //100-SWAP%
    per.push(sys.global_cpu_info().frequency() as f32); //CPU Freq
    per.push(sys.total_memory() as f32 * 1e-9); //Total Mem
    per.push(sys.total_swap() as f32 * 1e-9); //Total Swap

    per
}

#[tauri::command]
fn get_cpus_data() -> Vec<f32> {
    let mut sys = System::new_all();
    let mut cpus_data: Vec<f32> = Vec::new();

    sys.refresh_all();
    std::thread::sleep(System::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu();

    for cpu in sys.cpus() {
        cpus_data.push(cpu.cpu_usage());
    }
    std::thread::sleep(System::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu();

    cpus_data
}

#[tauri::command]
fn get_cpus_names() -> Vec<String> {
    let mut sys = System::new_all();
    sys.refresh_all();
    sys.refresh_cpu();
    std::thread::sleep(System::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu();
    let mut cpus_names: Vec<String> = Vec::new();

    let mut index: i32 = 1;
    for _cpu in sys.cpus() {
        cpus_names.push(format!("CPU {}:", index));
        index += 1;
    }

    cpus_names
}

#[tauri::command]
fn get_overall_info() -> Vec<String> {
    let mut sys = System::new_all();
    sys.refresh_all();
    let mut overall_info: Vec<String> = Vec::new();

    overall_info.push(format!("OS Name: {:?}", sys.name().unwrap()));
    overall_info.push(format!("CPU Type: {:?}", sys.cpus()[0].brand()));

    overall_info.push(format!("OS Version: {:?}", sys.os_version().unwrap()));
    overall_info.push(format!("# of Disks: {:?}", sys.disks().len()));
    overall_info.push(format!("{}", sys.uptime()));

    overall_info.push(format!("Processor: {:?}", sys.cpus()[0].name()));
    overall_info.push(format!(
        "Kernel Version: {:?}",
        sys.kernel_version().unwrap()
    ));
    overall_info
}

#[tauri::command]
fn get_process_vector() -> Vec<Proc> {
    let process_vector: Vec<procfs::process::Process> = all_processes()
        .unwrap()
        .into_iter()
        .map(|x| x.unwrap())
        .collect();
    let mut proc_vector: Vec<Proc> = Vec::new();
    //let cpu = system.cpus().iter().len();
    let mut sys = System::new_all();
    sys.refresh_cpu();
    std::thread::sleep(System::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu();
    for p in process_vector {
        //system.refresh_all();
        let utime_sec = p.stat().unwrap().utime as f32 / procfs::ticks_per_second() as f32;
        let stime_sec = p.stat().unwrap().stime as f32 / procfs::ticks_per_second() as f32;
        let starttime_sec = p.stat().unwrap().starttime as f32 / procfs::ticks_per_second() as f32;
        let elapsed_sec = sys.uptime() as f32 - starttime_sec;
        let usage_sec = utime_sec + stime_sec;
        let cpu_usage = (usage_sec / elapsed_sec * 100.0) / sys.cpus().len() as f32;

        let float_var: f32 = cpu_usage;
        let formatted_string = format!("{:.2}", float_var);
        let mut cpu_usage1 = formatted_string.parse::<f32>().unwrap();
        if cpu_usage1 > 100.0 {
            cpu_usage1 = 100.0;
        }
        if cpu_usage1 < 0.0 {
            cpu_usage1 = 0.0;
        }
        //let mut system = System::new();

        // system.refresh_all();
        // system.refresh_processes();
        // std::thread::sleep(System::MINIMUM_CPU_UPDATE_INTERV AL);
        //let cpu = system.cpus().iter().len();
        //dbg!(cpu);

        //system.refresh_processes();
        // let mut system = System::new_all();
        // system.refresh_cpu();
        // std::thread::sleep(System::MINIMUM_CPU_UPDATE_INTERVAL);
        // system.refresh_cpu();
        // let sysInfoProcesss = system.process(Pid::from(p.stat().unwrap().pid as usize));
        // let mut cpu_usage = sysInfoProcesss.expect("REASON").cpu_usage();

        let proc = Proc {
            name: format!("{}", p.stat().unwrap().comm),
            pid: p.pid(),
            ppid: p.stat().unwrap().ppid,
            state: p.stat().unwrap().state,
            priority: p.stat().unwrap().priority,
            niceness: p.stat().unwrap().nice,
            start_time: p.stat().unwrap().starttime,
            vsize: ((p.stat().unwrap().vsize as f32) / 1e6),
            rss: (p.stat().unwrap().rss as f32 * procfs::page_size() as f32
                / (sys.total_memory() as f32))
                * 100.0,
            threads: p.stat().unwrap().num_threads,
            cpu_time: cpu_usage1,
        };
        proc_vector.push(proc);
    }
    proc_vector
}

#[tauri::command]
fn get_sysinfo() -> Vec<f32> {
    let mut sys = System::new_all();
    sys.refresh_all();
    sys.refresh_cpu();
    std::thread::sleep(System::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu();
    let mut sysinfo: Vec<f32> = Vec::new();
    sysinfo.push(sys.cpus().len() as f32);
    sysinfo.push(sys.global_cpu_info().cpu_usage() as f32);
    sysinfo.push(sys.used_memory() as f32 * 100.0 / sys.total_memory() as f32);

    sysinfo
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_process_vector,
            get_sysinfo,
            get_overall_info,
            get_cpus_names,
            get_cpus_data,
            get_perc
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
