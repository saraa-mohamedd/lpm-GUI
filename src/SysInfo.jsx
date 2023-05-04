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
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding:0,
    textAlign: 'left',
    //   color: theme.palette.text.secondary,
    boxShadow: '0px 0px 0px 0px rgba(0,0,0,0.0)',
    fontSize: '1rem',
    font: 'News Cycle, sans-serif',

}));



ChartJS.register(
    ArcElement,
    Tooltip,
    BarElement,
    CategoryScale,
    LinearScale
);


const SysInfo = () => {

    
    var cpuinfo = [0,0,0,0,0,0,0,0];
    const [overallinfo, setOverallInfo] = useState([]);

    const [updatingsepcpus, getCPUsforbar] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
            getCPUsInfo();
            }
            , 2000);
            return () => clearInterval(interval);
    }, [updatingsepcpus]);
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

    const [updatingdoughnuts, getperforDoughnuts] = useState([]);
    useEffect(() => {
        const interval = setInterval(() => {
        getPerc();
        }
        , 2000);
        return () => clearInterval(interval);
    }, []);
    async function getPerc() {
        getperforDoughnuts(await invoke("get_perc"));
    }

    useEffect(() => {
        getOverallSysInfo();
    }, []);
    async function getOverallSysInfo() {
        setOverallInfo(await invoke("get_overall_info"));
    }

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(overallinfo[4]);
            console.log(parseInt(overallinfo[4], 10));
            overallinfo[4] = parseInt(overallinfo[4], 10) + 1;
        }
        , 1000);
        return () => clearInterval(interval);
    }, [overallinfo[4]]);


    if (updatingdoughnuts[0] == null || updatingdoughnuts[0] == undefined) {
        cpuinfo = [0,0,0,0,0,0,0,0,0];
    }
    else {
        cpuinfo = updatingdoughnuts;
    }


    const bardata = {
        labels: sepcpusnames,
        datasets: [
        {
            categoryPercentage: 0.8, // notice here 
            barPercentage: 0.8,
            label: '%',
            data: updatingsepcpus,
            backgroundColor: [
                'rgba(61, 173, 130, 0.5)',
                'rgba(196,153,145, 0.5)',
                'rgba(103,60,79, 0.5)',
                'rgba(11, 60, 73, 0.5)',
            ],
            borderColor: [
                'rgba(61, 173, 130, 1)',
                'rgba(196,153,145, 1)',
                'rgba(103,60,79, 1)',
                'rgba(11, 60, 73, 1)'
            ],
            borderWidth: 1,
        },
    ],
    };


    const baroptions = {
        indexAxis: 'y',
        scales:
        {
            x: {
                min: 0,
                max: 100,
                stepSize: 1,
                grid: { display: false },
            },
            y: {
                grid: { display: false },
            }
        },
        barThickness: 25,
        borderRadius: 3,
        maxBarThickness: 25,
        // maintainAspectRatio: false,
    }

    const cpudata = {
        labels: ['Used', 'Idle'],
        datasets: [
        {
            label: '%',
            data: [updatingdoughnuts[0], updatingdoughnuts[1]],
            backgroundColor: [
                'rgba(196,153,145, 0.5)',
                'rgba(0, 0, 0, 0.2)'
            ],
            borderColor: [
                'rgba(196,153,145, 1)',
                '#48524e'
            ],
            borderWidth: 1,
            circumference: 180,
            rotation: 270,
            cutout: '70%',
        },
        ],

    };

    const memdata = {
        labels: ['Used', 'Idle'],
        datasets: [
        {
            label: '%',
            data: [updatingdoughnuts[2], updatingdoughnuts[3]],
            backgroundColor: [
                'rgba(103,60,79, 0.5)',
                'rgba(0, 0, 0, 0.2)'
            ],
            borderColor: [
                'rgba(103,60,79, 1)',
                '#48524e'
            ],
            borderWidth: 1,
            cutout: '70%',
            circumference: 180,
            rotation: 270,
        },
        ],
    };

    const swapdata = {
        labels: ['Used', 'Idle'],
        datasets: [
        {
            label: '%',
            data: [updatingdoughnuts[4], updatingdoughnuts[5]],
            backgroundColor: [
                'rgba(11, 60, 73, 0.5)',
                'rgba(0, 0, 0, 0.2)'
            ],
            borderColor: [
                'rgba(11,60,73, 1)',
                '#48524e'
            ],
            borderWidth: 1,
            circumference: 180,
            rotation: 270,
            cutout: '70%',
        },
        ],
    };

    const options = {
        // aspectRation: 2,
        // responsive: false,
        maintainAspectRatio: false,
    };

    const cpucenter = {
        id : 'cpucenter',
        beforeDatasetsDraw(chart, args, options) {
            const {ctx, data} = chart;
            
            ctx.save();
            ctx.font = 'bolder 50px Arial';
            // ctx.font = '60px News Cycle sans-serif';
            // ctx.arc(chartArea.centerX, chartArea.centerY, 100, 0, 2 * Math.PI);
            ctx.textAlign = 'center';
            ctx.textBaseLine = 'middle';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillText('CPU', chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y);
            // ctx.restore();
        }
    };

    const memcenter = {
        id : 'cpucenter',
        beforeDatasetsDraw(chart, args, options) {
            const {ctx, data} = chart;
            
            ctx.save();
            ctx.font = 'bolder 50px Arial';
            // ctx.arc(chartArea.centerX, chartArea.centerY, 100, 0, 2 * Math.PI);
            ctx.textAlign = 'center';
            ctx.textBaseLine = 'middle';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillText('Mem', chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y);
            // ctx.restore();
        }
    };

    const swapcenter = {
        id : 'cpucenter',
        beforeDatasetsDraw(chart, args, options) {
            const {ctx, data} = chart;
            
            ctx.save();
            ctx.font = 'bolder 50px Arial';
            // ctx.arc(chartArea.centerX, chartArea.centerY, 100, 0, 2 * Math.PI);
            ctx.textAlign = 'center';
            ctx.textBaseLine = 'top';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillText('Swap', chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y);
            // ctx.restore();
        }
    };


    useEffect(()=> {
        getCPUsInfo();
        getCPUNames();
        getPerc();
    }, []);

    return (
    <div class = "main">
        <Box class = "overallinfo">
            <Grid container spacing={1}>
                <Grid container item spacing={3}>
                        <React.Fragment>
                            <Grid item xs={4}>
                                <Item>{overallinfo[0]}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item>{overallinfo[1]}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item>{overallinfo[2]}</Item>
                            </Grid>
                        </React.Fragment>
                </Grid>
                <Grid container item spacing={3}>
                        <React.Fragment>
                            <Grid item xs={4}>
                                <Item>{overallinfo[3]}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item>Uptime: {Math.floor(overallinfo[4]/3600).toFixed(0)}:{("0" + Math.floor((overallinfo[4]%3600)/60).toFixed(0)).slice(-2)}:{("0" + Math.floor((overallinfo[4]%3600)%60).toFixed(0)).slice(-2)}</Item>
                            </Grid>
                            <Grid item xs={4}>
                                <Item></Item>
                            </Grid>
                        </React.Fragment>
                </Grid>
            </Grid>
    </Box>
    <div class = "row">
         <div class = "column">
                <Doughnut
                class = "system"
                data = {cpudata}
                options = {options}
                plugins = {[cpucenter]}
                >
                </Doughnut>

        </div>
        <div class = "column">
                <Doughnut
                class = "system"
                data = {memdata}
                options = {options}
                plugins = {[memcenter]}
                >
                </Doughnut>
        </div> 
        <div class = "column">
                <Doughnut
                class = "system"
                data = {swapdata}
                options = {options}
                plugins = {[swapcenter]}
                >
                </Doughnut>
        </div> 
    </div>
    <div class = "doughnutlables">
        </div>

     <div class = "row">
        <div class = "labelcolumn">
            <h4 class = "a"> %Used:</h4>
            <h4 class = "b">{cpuinfo[0].toFixed(2)}%</h4>
            <h4 class = "a"> %Idle:</h4>
            <h4 class = "b">{cpuinfo[1].toFixed(2)}%</h4>
            <h4 class = "a"> CPU Frequency: </h4>
            <h4 class = "b">{cpuinfo[6]} MHz</h4>
        </div>
        <div class = "labelcolumn">
            <h4 class = "a"> %Used: </h4>
            <h4 class = "c"> {cpuinfo[2].toFixed(2)}%</h4>
            <h4 class = "a"> %Idle: </h4>
            <h4 class = "c">{cpuinfo[3].toFixed(2)}%</h4>
            <h4 class = "a"> Total Memory:</h4>
            <h4 class = "c">{cpuinfo[7].toFixed(2)} GB</h4>
        </div>
        <div class = "rightlabelcolumn">
            <h4 class = "a"> %Used: </h4>
            <h4 class = "d"> {cpuinfo[4].toFixed(2)}%</h4>
            <h4 class = "a"> %Idle: </h4>
            <h4 class = "d">{cpuinfo[5].toFixed(2)}%</h4>
            <h4 class = "a"> Total Swap:</h4>
            <h4 class = "d">{cpuinfo[8].toFixed(2)} GB</h4>
        </div>
    </div>
    <div class = "barChartRow">
    <Bar
        data = {bardata}
        options = {baroptions}
        ></Bar>
    </div>
    </div>
  );
};
  
export default SysInfo;