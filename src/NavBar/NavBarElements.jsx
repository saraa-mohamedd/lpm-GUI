import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
background: #78c2a7;
height: 40px;
display: flex;
justify-content: center;
padding: 0.2rem calc((10vw - 100px) / 2);
z-index: 80;
`;

export const NavLink = styled(Link)`
color: #ffffff;
display: flex;
align-items: center;
text-decoration: none;
font-family: 'Inter', sans-serif;
font-weight: 600;
padding: 0 1rem;
height: 100%;
cursor: pointer;
:hover {
    color: #2a7552;
    // box-shadow: 4px 4px rgba(68, 140, 121, 1);
    // height: 80%;
    // padding: 0 1rem;
    // background-color: #ffffff;
}
&.active {
	color: #2a7552;
    background-color: #ffffff;
    padding: 0 1rem;
    height: 80%;
    box-shadow: 3px 3px rgba(68, 140, 121, 1);
    margin-left: 0.5rem;

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
