import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
background: #78c2a7;
height: 40px;
display: flex;
justify-content: space-between;
padding: 0.2rem calc((10vw - 100px) / 2);
z-index: 80;
border-radius: 10px 10px 10px 10px;
`;

export const NavLink = styled(Link)`
color: #ffffff;
display: flex;
align-items: center;
text-decoration: none;
font-family: 'Manrope', sans-serif;
font-weight: 600;
padding: 0 1rem;
height: 100%;
cursor: pointer;
:hover {
    color: #2a7552;
}
&.active {
	color: #2a7552;
}
`;

export const NavMenu = styled.div`
display: flex;
align-items: center;
margin-right: -24px;
/* Second Nav */
/* margin-right: 24px; */
/* Third Nav */
/* width: 100vw;
white-space: nowrap; */
@media screen and (max-width: 768px) {
	display: none;
}
`;
