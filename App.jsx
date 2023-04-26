// import * as React from 'react';
// import { useState } from "react";
import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";



function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function DenseTable() {
  const [processes, setProcesses] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      getProcesses();
    }
      , 1000);
    return () => clearInterval(interval);
  }, []);

  
  { console.log("hello"); }
  async function getProcesses() {
    setProcesses(await invoke("get_process_vector"));
  }
  return (
    <> 
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, maxHeight: 150 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Process Name</TableCell>
              <TableCell align="right">PID</TableCell>
              <TableCell align="right">PPID</TableCell>
              <TableCell align="right">State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))} */}
            {
              processes.map(p => (
                <TableRow
                  key={p.pid}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {p.name}
                  </TableCell>
                  <TableCell align="right">{p.pid}</TableCell>
                  <TableCell align="right">{p.ppid}</TableCell>
                  <TableCell align="right">{p.state}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      {/* <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("getProcesses");
        getProcesses();
      }}
    >
      <button type="submit">Get Processes</button>
    </form> */}
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
