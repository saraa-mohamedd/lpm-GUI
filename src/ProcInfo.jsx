import React, { useState, useCallback } from 'react';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import {
  DataGridPremium, GridScrollArea, GridToolbar, GridRow,
  GridColumnHeaders, useGridApiRef, gridFilteredSortedRowIdsSelector
} from '@mui/x-data-grid-premium';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const MemoizedRow = React.memo(GridRow);
const MemoizedColumnHeaders = React.memo(GridColumnHeaders);

const tabletheme = createTheme({
  palette: {
    primary: {
      main: '#1a1a1a',
    },
    secondary: {
      main: '#1a1a1a',
    },
  },
});

const columns = [
  {
    field: 'processName', headerName: 'Process Name', width: 250,
    headerClassName: 'theme--header',

  },
  {
    field: 'pid',
    headerName: 'PID',
    width: 150,
    headerClassName: 'theme--header',
  },
  {
    field: 'ppid',
    headerName: 'PPID',
    width: 125,
    headerClassName: 'theme--header',

  },
  {
    field: 'state',
    headerName: 'State',
    width: 125,
    headerClassName: 'theme--header',

  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 150,
    headerClassName: 'theme--header',

  },
  {
    field: 'niceness',
    headerName: 'Niceness',
    width: 150,
    headerClassName: 'theme--header',

  },
  {
    field: 'startTime',
    headerName: 'Start Time',
    width: 150,
    headerClassName: 'theme--header',

  },
  {
    field: 'vsize',
    headerName: 'Vsize',
    width: 150,
    headerClassName: 'theme--header',

  },
  {
    field: 'rss',
    headerName: 'RSS',
    width: 150,
    headerClassName: 'theme--header',

  },
  {
    field: 'threads',
    headerName: 'Threads',
    width: 150,
    headerClassName: 'theme--header',

  },
  {
    field: 'cpuTime',
    headerName: '%CPU',
    width: 150,
    headerClassName: 'theme--header',

  },
];
const data = [];
let filteredBool = 0;
let filteredRows = [];
let filterValue = "";
let fieldValue = "";
let filterOperator = "";

export default function ProcView() {



  const [cpuChartData, setCpuChartData] = useState(data);
  const [memoryChartData, setMemoryChartData] = useState(data);

  const [sysinfo, setSysInfo] = useState([]);

  const [processes, setProcesses] = useState([]);

  async function fetchData() {
    setSysInfo(await invoke('get_sysinfo'));

  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(interval);
  }, [sysinfo]);



  useEffect(() => {
    const interval = setInterval(() => {
      cpuChartData.push({ name: "", CPU: addCpuTimes() });
      var newChartData = cpuChartData.slice(-50);
      newChartData.push({ name: "", CPU: addCpuTimes() });
      setCpuChartData(newChartData);
    }, 1000);
    return () => clearInterval(interval);
  }, [cpuChartData, sysinfo]);


  useEffect(() => {
    const interval = setInterval(() => {
      memoryChartData.push({ name: "", Memory: addMemoryTimes() });

      const newMemoryData = memoryChartData.slice(-50);
      newMemoryData.push({ name: "", Memory: addMemoryTimes() });
      setMemoryChartData(newMemoryData);
    }, 1000);
    return () => clearInterval(interval);
  }, [memoryChartData, sysinfo]);




  useEffect(() => {
    const interval = setInterval(() => {
      getProcesses();
    }
      , 5000);
    return () => clearInterval(interval);
  }, []);

  async function getProcesses() {
    setProcesses(await invoke("get_process_vector"));
  }

  const rows = processes.map((process) => {
    return {
      id: process.pid,
      processName: process.name,
      pid: process.pid,
      ppid: process.ppid,
      state: process.state,
      priority: process.priority,
      niceness: process.niceness,
      startTime: process.start_time,
      vsize: Math.round(process.vsize * Math.pow(10, 2)) / Math.pow(10, 2),
      rss: process.rss,
      threads: process.threads,
      cpuTime: Math.round(process.cpu_time * Math.pow(10, 2)) / Math.pow(10, 2),

    }
  })


  if (filteredBool == 0) {

    filteredRows = rows;
  }

  const addCpuTimes = () => {
    let sum = 0;
    for (let i = 0; i < filteredRows.length; i++) {
      sum += filteredRows[i].cpuTime;
    }
    return sum;
  }
  const addMemoryTimes = () => {
    let sum = 0;
    for (let i = 0; i < filteredRows.length; i++) {
      sum += filteredRows[i].rss;
    }
    return sum;
  }

  useEffect(() => {
    getProcesses();
  }, []);

  const apiRef = useGridApiRef();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(filteredBool);
      if (filteredBool == 1) {
        getFilterResult(filterOperator, filterValue, fieldValue);
        console.log("op: " + filterOperator + " val: " + filterValue + " field: " + fieldValue);
        console.log("in if");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [filteredRows]);



  const getFilterResult = (filterOperator, filterValue, fieldValue) => {
    if (filterOperator == "contains") {
      if (fieldValue == "processName") {
        filteredRows = rows.filter((row) => row.processName.includes(filterValue))
      }
      if (fieldValue == "pid") {
        filteredRows = rows.filter((row) => row.pid.includes(filterValue))
      }
      if (fieldValue == "ppid") {
        filteredRows = rows.filter((row) => row.ppid.includes(filterValue))
      }
      if (fieldValue == "state") {
        filteredRows = rows.filter((row) => row.state.includes(filterValue))
      }
      if (fieldValue == "priority") {
        filteredRows = rows.filter((row) => row.priority.includes(filterValue))
      }
      if (fieldValue == "niceness") {
        filteredRows = rows.filter((row) => row.niceness.includes(filterValue))
      }
      if (fieldValue == "startTime") {
        filteredRows = rows.filter((row) => row.startTime.includes(filterValue))
      }
      if (fieldValue == "vsize") {
        filteredRows = rows.filter((row) => row.vsize.includes(filterValue))
      }
      if (fieldValue == "rss") {
        filteredRows = rows.filter((row) => row.rss.includes(filterValue))

      }
      if (fieldValue == "threads") {
        filteredRows = rows.filter((row) => row.threads.includes(filterValue))
      }
      if (fieldValue == "cpuTime") {
        filteredRows = rows.filter((row) => row.cpuTime.includes(filterValue))
      }
    }
    if (filterOperator == "equals") {
      if (fieldValue == "processName") {
        filteredRows = rows.filter((row) => row.processName == filterValue)
      }
      if (fieldValue == "pid") {
        filteredRows = rows.filter((row) => row.pid == filterValue)
      }
      if (fieldValue == "ppid") {
        filteredRows = rows.filter((row) => row.ppid == filterValue)
      }
      if (fieldValue == "state") {
        filteredRows = rows.filter((row) => row.state == filterValue)
      }
      if (fieldValue == "priority") {
        filteredRows = rows.filter((row) => row.priority == filterValue)
      }
      if (fieldValue == "niceness") {
        filteredRows = rows.filter((row) => row.niceness == filterValue)
      }
      if (fieldValue == "startTime") {
        filteredRows = rows.filter((row) => row.startTime == filterValue)
      }
      if (fieldValue == "vsize") {
        filteredRows = rows.filter((row) => row.vsize == filterValue)
      }
      if (fieldValue == "rss") {
        filteredRows = rows.filter((row) => row.rss == filterValue)

      }
      if (fieldValue == "threads") {
        filteredRows = rows.filter((row) => row.threads == filterValue)

      }
      if (fieldValue == "cpuTime") {
        filteredRows = rows.filter((row) => row.cpuTime == filterValue)


      }
    }
    if (filterOperator == "greaterThan") {
      if (fieldValue == "pid") {
        filteredRows = rows.filter((row) => row.pid > filterValue)
      }
      if (fieldValue == "ppid") {
        filteredRows = rows.filter((row) => row.ppid > filterValue)
      }
      if (fieldValue == "priority") {
        filteredRows = rows.filter((row) => row.priority > filterValue)
      }
      if (fieldValue == "niceness") {
        filteredRows = rows.filter((row) => row.niceness > filterValue)
      }
      if (fieldValue == "startTime") {
        filteredRows = rows.filter((row) => row.startTime > filterValue)
      }
      if (fieldValue == "vsize") {
        filteredRows = rows.filter((row) => row.vsize > filterValue)
      }
      if (fieldValue == "rss") {
        filteredRows = rows.filter((row) => row.rss > filterValue)
      }
      if (fieldValue == "threads") {
        filteredRows = rows.filter((row) => row.threads > filterValue)
      }
      if (fieldValue == "cpuTime") {
        filteredRows = rows.filter((row) => row.cpuTime > filterValue)
      }
    }

    if (filterOperator == "startsWith") {
      if (fieldValue == "processName") {
        filteredRows = rows.filter((row) => row.processName.startsWith(filterValue))
      }
      if (fieldValue == "pid") {
        filteredRows = rows.filter((row) => row.pid.startsWith(filterValue))
      }
      if (fieldValue == "ppid") {
        filteredRows = rows.filter((row) => row.ppid.startsWith(filterValue))
      }
      if (fieldValue == "state") {
        filteredRows = rows.filter((row) => row.state.startsWith(filterValue))
      }
      if (fieldValue == "priority") {
        filteredRows = rows.filter((row) => row.priority.startsWith(filterValue))
      }
      if (fieldValue == "niceness") {
        filteredRows = rows.filter((row) => row.niceness.startsWith(filterValue))
      }
      if (fieldValue == "startTime") {
        filteredRows = rows.filter((row) => row.startTime.startsWith(filterValue))
      }
      if (fieldValue == "vsize") {
        filteredRows = rows.filter((row) => row.vsize.startsWith(filterValue))
      }
      if (fieldValue == "rss") {
        filteredRows = rows.filter((row) => row.rss.startsWith(filterValue))

      }
      if (fieldValue == "threads") {
        filteredRows = rows.filter((row) => row.threads.startsWith(filterValue))
      }
      if (fieldValue == "cpuTime") {
        filteredRows = rows.filter((row) => row.cpuTime.startsWith(filterValue))
      }

    }
    if (filterOperator == "endsWith") {
      if (fieldValue == "processName") {
        filteredRows = rows.filter((row) => row.processName.endsWith(filterValue))
      }
      if (fieldValue == "pid") {
        filteredRows = rows.filter((row) => row.pid.endsWith(filterValue))
      }
      if (fieldValue == "ppid") {
        filteredRows = rows.filter((row) => row.ppid.endsWith(filterValue))
      }
      if (fieldValue == "state") {
        filteredRows = rows.filter((row) => row.state.endsWith(filterValue))
      }
      if (fieldValue == "priority") {
        filteredRows = rows.filter((row) => row.priority.endsWith(filterValue))
      }
      if (fieldValue == "niceness") {
        filteredRows = rows.filter((row) => row.niceness.endsWith(filterValue))
      }
      if (fieldValue == "startTime") {
        filteredRows = rows.filter((row) => row.startTime.endsWith(filterValue))
      }
      if (fieldValue == "vsize") {
        filteredRows = rows.filter((row) => row.vsize.endsWith(filterValue))
      }
      if (fieldValue == "rss") {
        filteredRows = rows.filter((row) => row.rss.endsWith(filterValue))

      }
      if (fieldValue == "threads") {
        filteredRows = rows.filter((row) => row.threads.endsWith(filterValue))
      }
      if (fieldValue == "cpuTime") {
        filteredRows = rows.filter((row) => row.cpuTime.endsWith(filterValue))
      }
    }
    if (filterOperator == "isEmpty") {
      if (fieldValue == "processName") {
        filteredRows = rows.filter((row) => row.processName == "")
      }
      if (fieldValue == "pid") {
        filteredRows = rows.filter((row) => row.pid == "")
      }
      if (fieldValue == "ppid") {
        filteredRows = rows.filter((row) => row.ppid == "")
      }
      if (fieldValue == "state") {
        filteredRows = rows.filter((row) => row.state == "")
      }
      if (fieldValue == "priority") {
        filteredRows = rows.filter((row) => row.priority == "")
      }
      if (fieldValue == "niceness") {
        filteredRows = rows.filter((row) => row.niceness == "")
      }
      if (fieldValue == "startTime") {
        filteredRows = rows.filter((row) => row.startTime == "")
      }
      if (fieldValue == "vsize") {
        filteredRows = rows.filter((row) => row.vsize == "")
      }
      if (fieldValue == "rss") {
        filteredRows = rows.filter((row) => row.rss == "")

      }
      if (fieldValue == "threads") {
        filteredRows = rows.filter((row) => row.threads == "")
      }
      if (fieldValue == "cpuTime") {
        filteredRows = rows.filter((row) => row.cpuTime == "")
      }
    }

    if (filterOperator == "isNotEmpty") {
      if (fieldValue == "processName") {
        filteredRows = rows.filter((row) => row.processName != "")
      }
      if (fieldValue == "pid") {
        filteredRows = rows.filter((row) => row.pid != "")
      }
      if (fieldValue == "ppid") {
        filteredRows = rows.filter((row) => row.ppid != "")
      }
      if (fieldValue == "state") {
        filteredRows = rows.filter((row) => row.state != "")
      }
      if (fieldValue == "priority") {
        filteredRows = rows.filter((row) => row.priority != "")
      }
      if (fieldValue == "niceness") {
        filteredRows = rows.filter((row) => row.niceness != "")
      }
      if (fieldValue == "startTime") {
        filteredRows = rows.filter((row) => row.startTime != "")
      }
      if (fieldValue == "vsize") {
        filteredRows = rows.filter((row) => row.vsize != "")
      }
      if (fieldValue == "rss") {
        filteredRows = rows.filter((row) => row.rss != "")

      }
      if (fieldValue == "threads") {
        filteredRows = rows.filter((row) => row.threads != "")
      }
      if (fieldValue == "cpuTime") {
        filteredRows = rows.filter((row) => row.cpuTime != "")
      }
    }
    if (filterOperator == "isAnyOf") {
      if (fieldValue == "processName") {
        filteredRows = rows.filter((row) => row.processName == filterValue)
      }
      if (fieldValue == "pid") {
        filteredRows = rows.filter((row) => row.pid == filterValue)
      }
      if (fieldValue == "ppid") {
        filteredRows = rows.filter((row) => row.ppid == filterValue)
      }
      if (fieldValue == "state") {
        filteredRows = rows.filter((row) => row.state == filterValue)
      }
      if (fieldValue == "priority") {
        filteredRows = rows.filter((row) => row.priority == filterValue)
      }
      if (fieldValue == "niceness") {
        filteredRows = rows.filter((row) => row.niceness == filterValue)
      }
      if (fieldValue == "startTime") {
        filteredRows = rows.filter((row) => row.startTime == filterValue)
      }
      if (fieldValue == "vsize") {
        filteredRows = rows.filter((row) => row.vsize == filterValue)
      }
      if (fieldValue == "rss") {
        filteredRows = rows.filter((row) => row.rss == filterValue)

      }
      if (fieldValue == "threads") {
        filteredRows = rows.filter((row) => row.threads == filterValue)
      }
      if (fieldValue == "cpuTime") {
        filteredRows = rows.filter((row) => row.cpuTime == filterValue)
      }
    }
  }

  return (
    <>
      <Box sx={{
        height: '50vh', width: '88vw', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', m: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1, marginLeft: '4.5vw'
      }}>
        <ThemeProvider theme={tabletheme}>
          <DataGridPremium
            apiRef={apiRef}
            onFilterModelChange={() => {

              filterValue = apiRef.current.state.filter.filterModel.items[0].value; // "k"

              if (filterValue == "" || filterValue == null || filterValue == undefined)
                filteredBool = 0;
              else
                filteredBool = 1;
              filterOperator = apiRef.current.state.filter.filterModel.items[0].operator; // contains
              fieldValue = apiRef.current.state.filter.filterModel.items[0].field; // processName
              getFilterResult(filterOperator, filterValue, fieldValue);
              ``

              console.log(apiRef.current.state.filter.filterModel);

              // console.log(filteredRows)

            }
            }
            slots={
              {
                toolbar: GridToolbar,
                row: MemoizedRow,
                columnHeaders: MemoizedColumnHeaders,
              }
            }
            density='compact'
            rows={rows}
            columns={columns}

            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 300,
                },
              },
            }}
            pageSizeOptions={[5]}

            columnBuffer={2} columnThreshold={10}
            sx={{
              boxShadow: 3,
              border: 2,
              borderRadius: 3,
              borderColor: '#448b79',
              '& .MuiDataGrid-cell:hover': {
                color: '#609e88',
              },
              '.MuiDataGrid-columnSeparator': {
                display: 'none',
              },
              '&.MuiDataGrid-cell': {
                backgroundColor: '#000000',
              },
              '& .theme--header': {
                backgroundColor: '#a9c4b8',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 'bolder',
                font: 'Helvetica Neue',
              },
            }}
          />
        </ThemeProvider>
      </Box>
      <div style={{ display: "flex" }}>
        <ResponsiveContainer width={850} height={400}>
          <AreaChart data={cpuChartData} dot={true}>
            <XAxis dataKey="name" />
            <YAxis type="number" domain={[0, 100]} />
            <Legend />
            <Area type="monotone" dataKey="CPU" isAnimationActive={true} fill="url(#cpuPerGraph)" />
            <defs>
              <linearGradient id="cpuPerGraph" x1="0" y1="0" x2="0" y2="1">
                <stop offset="1%" stopColor="rgb(88, 80, 141)" stopOpacity={0.9} />
                <stop offset="99%" stopColor="rgb(88, 80, 141)" stopOpacity={0.15} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer >
        <ResponsiveContainer width={850} height={400}>
          <AreaChart data={memoryChartData} dot={true}>
            <XAxis dataKey="name" />
            <YAxis type="number" domain={[0, 100]} />
            <Legend />
            <Area type="monotone" dataKey="Memory" isAnimationActive={true} animationDuration={50} fill="url(#memPerGraph)" />
            <defs>
              <linearGradient id="memPerGraph" x1="0" y1="0" x2="0" y2="1">
                <stop offset="1%" stopColor="rgb(11, 60, 73)" stopOpacity={0.9} />
                <stop offset="99%" stopColor="rgb(11, 60, 73)" stopOpacity={0.15} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer >
      </div>

    </>

  );
}
