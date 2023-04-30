import React, {useState} from "react";
import { Chart as ChartJS, 
         ArcElement, 
         Tooltip, 
         Legend, 
         BarElement, 
         CategoryScale, 
         LinearScale } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import "./systemstyles.css";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
  

ChartJS.register(
    ArcElement,
    Tooltip,
    BarElement,
    CategoryScale,
    LinearScale
);


const SysInfo = () => {


    const [updatingcpuinfo, getCPUforcard] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
            getCPUInfo();
            }
            , 2000);
            return () => clearInterval(interval);
    }, []);

    
    //{console.log(updatingcpuinfo[0]);}
    async function getCPUInfo() {
        getCPUforcard(await invoke("get_cpu_info"));
    }

    const [updatingsepcpus, getCPUsforbar] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
            getCPUsInfo();
            }
            , 1000);
            return () => clearInterval(interval);
    }, []);

    
    {console.log(updatingsepcpus);}
    async function getCPUsInfo() {
        getCPUsforbar(await invoke("get_cpus_data"));
    }

    const[sepcpusnames, getCPUNamesforBar] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
            getCPUNames();
        }
        , 2000);
        return () => clearInterval(interval);
    })

    async function getCPUNames() {
        getCPUNamesforBar(await invoke("get_cpus_names"));
    }

    const [updatingcpu, getCPUforDoughnut] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
        getCPUPerc();
        }
        , 2000);
        return () => clearInterval(interval);
    }, []);

    //{console.log("cpu data: " + updatingcpu[0]);}
    async function getCPUPerc() {
        getCPUforDoughnut(await invoke("get_cpu_perc"));
    }

    const [updatingmem, getMEMforDoughnut] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
        getMEMPerc();
        }
        , 2000);
        return () => clearInterval(interval);
    }, []);

    async function getMEMPerc() {
        getMEMforDoughnut(await invoke("get_mem_perc"));
    }

    const [updatingswap, getSWAPforDoughnut] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
        getSWAPPerc();
        }
        , 2000);
        return () => clearInterval(interval);
    }, []);

    async function getSWAPPerc() {
        getSWAPforDoughnut(await invoke("get_swap_perc"));
    }

    const bardata = {
        labels: sepcpusnames,
        datasets: [
        {
            label: '%',
            data: updatingsepcpus,
            backgroundColor: [
                'rgba(61, 173, 130, 0.2)',
                'rgba(0, 0, 0, 0.2)'
            ],
            borderColor: [
                'rgba(61, 173, 130, 1)',
                '#48524e'
            ],
            borderWidth: 1,
        },
    ],
    };


    const baroptions = {
        indexAxis: 'y',
        // scales:
        // {
        //     xAxes: [{
        //         gridLines: {
        //             display: false,
        //         }
        //     }],
        //     yAxes: [{
        //         gridLines: {
        //             display: false,
        //         }
        //     }],
        //     x: {
        //         min: 0,
        //         max: 100,
        //         stepSize: 1,
        //     },
        //     y: {
        //     }
        // }
    }

    const cpudata = {
        labels: ['Used', 'Idle'],
        datasets: [
        {
            label: '%',
            data: updatingcpu,
            backgroundColor: [
                'rgba(61, 173, 130, 0.2)',
                'rgba(0, 0, 0, 0.2)'
            ],
            borderColor: [
                'rgba(61, 173, 130, 1)',
                '#48524e'
            ],
            borderWidth: 1,
        },
    ],
    };

    const memdata = {
        labels: ['Used', 'Idle'],
        datasets: [
        {
            label: '%',
            data: updatingmem,
            backgroundColor: [
                'rgba(61, 173, 130, 0.2)',
                'rgba(0, 0, 0, 0.2)'
            ],
            borderColor: [
                'rgba(61, 173, 130, 1)',
                '#48524e'
            ],
            borderWidth: 1,
        },
    ],
    };

    const swapdata = {
        labels: ['Used', 'Idle'],
        datasets: [
        {
            label: '%',
            data: updatingswap,
            backgroundColor: [
                'rgba(61, 173, 130, 0.2)',
                'rgba(0, 0, 0, 0.2)'
            ],
            borderColor: [
                'rgba(61, 173, 130, 1)',
                '#48524e'
            ],
            borderWidth: 1,
        },
    ]
    };

    const options = {};

    return (
    <div class = "row">
        <div class = "card">
                {/* <h4 class = "a"> CPU% </h4>  */}
                {/* <div class = "diagram">
                <Doughnut
                class = "system"
                data = {cpudata}
                options = {options}
                >
                </Doughnut>
                </div>
                <div class = "info">
                {updatingcpuinfo.map((cpuinfo) => (
                    <div class = "a">
                        <h4 class = "a">{cpuinfo}</h4>
                    </div>
                ))}
                </div> */}
        </div>
        <Bar
        data = {bardata}
        options = {baroptions}
        ></Bar>
        {/* <div class = "column">
            <h1 class = "a">
                <h4 class = "a">Mem% </h4>
                <Doughnut
                class = "system"
                data = {memdata}
                options = {options}
                >
                </Doughnut>
            </h1>

        </div>
        <div class = "column">
            <h1 class = "a">
                <h4 class = "a">Swap% </h4>
                <Doughnut
                class = "system"
                data = {swapdata}
                options = {options}
                >
                </Doughnut>
            </h1>

        </div> */}
    </div>
  );
};
  
export default SysInfo;