import React from "react";
import { Nav, NavLink, NavMenu }
	from "./NavBarElements";

const Navbar = () => {
return (
	<>
	<Nav>
		<NavMenu>
		<NavLink to="/ProcView" activeStyle>
			Process View
		</NavLink>
		<NavLink to="/SysView" activeStyle>
			System View
		</NavLink>
		</NavMenu>
	</Nav>
	</>
);
};

export default Navbar;
