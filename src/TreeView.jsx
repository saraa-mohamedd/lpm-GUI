import React, { useState, useEffect } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { invoke } from '@tauri-apps/api/tauri';
import { Box } from '@material-ui/core';
import "./treestyles.css";


function ProcessTreeTable() {
    const [processTreeData, setProcessTreeData] = useState([]);

    useEffect(() => {
        getProcessTreeData();
        // Load process tree data using Node.js child_process module or a Tauri plugin
        // and set the data to the state using setProcessTreeData
    }, []);

    async function getProcessTreeData() {
        setProcessTreeData(await invoke("get_process_vector"));
    }

    const renderProcessTreeItem = (processData, isExpanded) => {
        if (processData.children && processTreeData.length > 0) {
            return (
                <TreeItem nodeId={processData.pid} label={processData.name + " (" + processData.pid + ")"}>
                    {processData.children.map((childProcess) =>
                        renderProcessTreeItem(childProcess, isExpanded)
                    )}
                </TreeItem>
            );
        } else {
            return (
                <TreeItem nodeId={processData.pid} label={processData.name + " (" + processData.pid + ")"} />
            );
        }
    };

    const buildProcessTree = (processList) => {
        const processMap = {};
        const rootProcesses = [];

        // Create a map of process IDs to process data
        processList.forEach((processData) => {
            processMap[processData.pid] = processData;
        });

        // Assign each process to its parent process (if it has one)
        processList.forEach((processData) => {
            const parentProcess = processMap[processData.ppid];
            if (parentProcess) {
                if (!parentProcess.children) {
                    parentProcess.children = [];
                }
                parentProcess.children.push(processData);
            } else {
                rootProcesses.push(processData);
            }
        });

        return rootProcesses;
    };

    const processTree = buildProcessTree(processTreeData);

    return (
        <>
            <div className="tab">Tree View</div>
            <div className="App">
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    disabledItemsFocusable={true}
                >
                    {processTree && processTree.map((rootProcess) => renderProcessTreeItem(rootProcess, true))}
                </TreeView>
            </div>
        </>
    );
}

export default ProcessTreeTable;