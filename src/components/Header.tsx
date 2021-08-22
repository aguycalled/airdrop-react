import * as React from "react";
import styled from "@emotion/styled"
import * as PropTypes from "prop-types";
import Banner from "./Banner";
import { transitions } from "../styles";
import logo from "../assets/token.svg";
import Icon from "./Icon";

const SHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface IHeaderProps {
  killSession: () => void;
  connected: boolean;
  address: string;
  chainId: number;
}

const Header = (props: IHeaderProps) => {
  return (
    <SHeader {...props}>

      <Banner/>
      <Icon src={logo} size={32}></Icon>

    </SHeader>
  );
};

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string,
};

export default Header;
