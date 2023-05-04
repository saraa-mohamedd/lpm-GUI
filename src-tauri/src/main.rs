// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use procfs::process::*;
use sysinfo::{System, CpuExt, SystemExt, UserExt};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
struct Proc {
    name: String,
    pid: i32,
    ppid: i32,
    state: char,
    priority: i64,
    niceness: i64,
    start_time: u64,
    vsize: String,
    rss: u64,
    threads: i64,
    cpu_time: String,
}

#[tauri::command]
fn get_process_vector() -> Vec<Proc> {
    let process_vector: Vec<procfs::process::Process> = all_processes().unwrap().into_iter().map(|x| x.unwrap()).collect();
    let mut proc_vector: Vec<Proc> = Vec::new();
    for p in process_vector {
        let proc = Proc {
            name: format!("{}", p.stat().unwrap().comm),
            pid: p.pid(),
            ppid: p.stat().unwrap().ppid,
            state: p.stat().unwrap().state,
            priority: p.stat().unwrap().priority,
            niceness: p.stat().unwrap().nice,
            start_time: p.stat().unwrap().starttime,
            vsize: format!("{:.2}", ((p.stat().unwrap().vsize as f64)/1e6)),
            rss: p.stat().unwrap().rss,
            threads: p.stat().unwrap().num_threads,
            cpu_time: format!("{}", ((p.stat().unwrap().utime + p.stat().unwrap().stime)
             as f32/(procfs::ticks_per_second() as f32)))
        };
        proc_vector.push(proc);
    }
    proc_vector
}

#[tauri::command]
fn get_perc()-> Vec<f32>{
    let mut sys = System::new_all();
    sys.refresh_all();
    sys.refresh_cpu();
    std::thread::sleep(System::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu();
    let mut per:Vec<f32> = Vec::new();
    per.push(sys.global_cpu_info().cpu_usage()); //CPU%
    per.push(100.0 - sys.global_cpu_info().cpu_usage()); //100-CPU%
    per.push((sys.used_memory() as f32/sys.total_memory() as f32) * 100.0); //MEM%
    per.push(100.0 - ((sys.used_memory() as f32/sys.total_memory() as f32) * 100.0)); //100-MEM%
    per.push((sys.used_swap() as f32/sys.total_swap() as f32) * 100.0); //SWAP%
    per.push(100.0 - ((sys.used_swap() as f32/sys.total_swap() as f32) * 100.0)); //100-SWAP%
    per.push(sys.global_cpu_info().frequency() as f32); //CPU Freq
    per.push(sys.total_memory() as f32 * 1e-9); //Total Mem
    per.push(sys.total_swap() as f32 * 1e-9); //Total Swap
    

    per
}


#[tauri::command]
fn get_cpus_data() -> Vec<f32>{
    let mut sys = System::new_all();
    let mut cpus_data:Vec<f32> = Vec::new();
    
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
fn get_cpus_names() -> Vec<String>{
    let mut sys = System::new_all();
    sys.refresh_all();
    sys.refresh_cpu();
    std::thread::sleep(System::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu();
    let mut cpus_names:Vec<String> = Vec::new();

    let mut index:i32 = 1;
    for _cpu in sys.cpus() {
        cpus_names.push(format!("CPU {}:", index));
        index += 1;
    }

    cpus_names
}

#[tauri::command]
fn get_overall_info() -> Vec<String>{
    let mut sys = System::new_all();
    sys.refresh_all();
    let mut overall_info:Vec<String> = Vec::new();


    //push system name
    overall_info.push(format!("System Name: {:?}", sys.name().unwrap()));
    //push system manufacturer
    overall_info.push(format!("CPU Type: {:?}", sys.cpus()[0].brand()));
    //push system model
    // overall_info.push(format!("System Model: {}", sys.model().unwrap()));
    // //push system type
    // overall_info.push(format!("System Type: {}", sys.host_type().unwrap()));
    // //push os name
    // overall_info.push(format!("OS Name: {}", sys.os_name()));
    //push os version
    overall_info.push(format!("OS Version: {:?}", sys.os_version().unwrap()));
    overall_info.push(format!("# of Disks: {:?}", sys.disks().len()));
    //push os build
    // overall_info.push(format!("OS Build: {}", sys.os_build().unwrap()));
    //push os manufacturer
    // overall_info.push(format!("OS Manufacturer: {}", sys.os_manufacturer().unwrap()));
    //push uptime
    overall_info.push(format!("{}", sys.uptime()));
   
    //push processor
    overall_info.push(format!("Processor: {:?}", sys.cpus()[0].name()));

    overall_info
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_process_vector, 
            get_perc, 
            get_cpus_data,
            get_cpus_names,
            get_overall_info ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}