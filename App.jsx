// import * as React from 'react';
// import { useState } from "react";
import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";



export default function DenseTable() {
  const [processes, setProcesses] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      getProcesses();
    }
      , 2000);
    return () => clearInterval(interval);
  }, []);
  

  { console.log("hello"); }
  async function getProcesses() {
    setProcesses(await invoke("get_process_vector"));
  }
  return (
    <>
      {/* <TableContainer component={Paper}> */}
        {/* <Table stickyHeader sx={{ minWidth: 650, maxHeight: 150 }} size="small" aria-label="a dense table"> */}
    <Paper sx={{ width: '100%'}}>
      <TableContainer sx={{ maxHeight: '90vh'}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" width= '9vw'>Process Name</TableCell>
              <TableCell align="right" width= '9vw'>PID</TableCell>
              <TableCell align="right" width= '9vw'>PPID</TableCell>
              <TableCell align="right" width= '9vw'>State</TableCell>
              <TableCell align="right" width= '9vw'>Priority</TableCell>
              <TableCell align="right" width= '9vw'>Niceness</TableCell>
              <TableCell align="right" width= '9vw'>Start Time</TableCell>
              <TableCell align="right" width= '9vw'>Vsize</TableCell>
              <TableCell align="right" width= '9vw'>RSS</TableCell>
              <TableCell align="right" width= '9vw'>Threads</TableCell>
              <TableCell align="right" width= '9vw'>CPU Time</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {
              processes.map(p => (
                <TableRow
                  key={p.pid}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left" component="th">
                    {p.name}
                  </TableCell>
                  <TableCell align="right" width= '9vw'>{p.pid}</TableCell>
                  <TableCell align="right" width= '9vw'>{p.ppid}</TableCell>
                  <TableCell align="right" width= '9vw'>{p.state}</TableCell>
                  <TableCell align="right" width= '9vw'>{p.priority}</TableCell>
                  <TableCell align="right" width= '9vw'>{p.niceness}</TableCell>
                  <TableCell align="right" width= '9vw'>{p.start_time}</TableCell>
                  <TableCell align="right" width= '9vw'>{p.vsize}</TableCell>
                  <TableCell align="right" width= '9vw'>{p.rss}</TableCell>
                  <TableCell align="right" width= '9vw'>{p.threads}</TableCell>
                  <TableCell align="right" width= '9vw'>{p.cpu_time}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      {/* </TableContainer> */}
      {/* <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("getProcesses");
        getProcesses();
      }}
    >
      <button type="submit">Get Processes</button>
    </form> */}
    </TableContainer>
    </Paper>
    </>
  );
}








// import * as React from 'react';
// import { DataGrid } from '@mui/x-data-grid';

// const columns = [
//   { field: 'id', headerName: 'ID', width: 70 },
//   { field: 'firstName', headerName: 'First name', width: 130 },
//   { field: 'lastName', headerName: 'Last name', width: 130 },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 150,
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (params) =>
//       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//   },
// ];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

// function App() {
//   return (
//     <div style={{ height: 400, width: '100%', backgroundColor: '#FFFFFF'}}>
//       <DataGrid
//         autoHeight
//         rows={rows}
//         columns={columns}
//       />
//     </div>
//   );
// }
// export default App;





// // import { useState } from "react";
// // import { invoke } from "@tauri-apps/api/tauri";
// // import "./App.css";

// // function App() {
// //   const [greetMsg, setGreetMsg] = useState("");
// //   const [name, setName] = useState("");

// //   async function greet() {
// //     // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// //     setGreetMsg(await invoke("greet", { name }));
// //   }

// //   return (
// //     <div className="container">
// //       <h1>Welcome to Tauri!</h1>

// //       {/* <div className="row">
// //         <a href="https://vitejs.dev" target="_blank">
// //           <img src="/vite.svg" className="logo vite" alt="Vite logo" />
// //         </a>
// //         <a href="https://tauri.app" target="_blank">
// //           <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
// //         </a>
// //         <a href="https://reactjs.org" target="_blank">
// //           <img src={reactLogo} className="logo react" alt="React logo" />
// //         </a>
// //       </div>

// //       <p>Click on the Tauri, Vite, and React logos to learn more.</p> */}

// //       <div className="row">
// //         <form
// //           onSubmit={(e) => {
// //             e.preventDefault();
// //             greet();
// //           }}
// //         >
// //           <input
// //             id="greet-input"
// //             onChange={(e) => setName(e.currentTarget.value)}
// //             placeholder="Enter a name..."
// //           />
// //           <button type="submit">Greet</button>
// //         </form>
// //       </div>

// //       <p>{greetMsg}</p>
// //     </div>
// //   );
// // }

// // export default App;
