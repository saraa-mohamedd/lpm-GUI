import React from 'react';
import './App.css';
import Navbar from './NavBar';
import { BrowserRouter as Router, Routes, Route }
	from 'react-router-dom';
import ProcView from './ProcInfo';
import SysInfo from './SysInfo';
import TreeView from './TreeView';


function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route exact path='/' element={<ProcView />} />
				<Route path='/ProcView' element={<ProcView />} />
				<Route path='/SysView' element={<SysInfo />} />
				<Route path='/TreeView' element={<TreeView />} />
			</Routes>
		</Router>
	);
}

export default App;
