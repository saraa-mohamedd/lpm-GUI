// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use procfs::process::*;
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

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_process_vector])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
