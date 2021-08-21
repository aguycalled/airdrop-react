import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "@emotion/styled";
import { keyframes } from '@emotion/react'

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

interface IWrapperStyleProps {
  center: boolean;
}

const SWrapper = styled.div<IWrapperStyleProps>`
  will-change: transform, opacity;
  animation: ${fadeIn} 0.7s ease 0s normal 1;
  min-height: 200px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  align-items: ${({ center }) => (center ? `center` : `flex-start`)};
`;

interface IWrapperProps extends IWrapperStyleProps {
  children: React.ReactNode;
}

const Wrapper = (props: IWrapperProps) => {
  const { children, center } = props;
  return (
    <SWrapper {...props} center={center}>
      {children}
    </SWrapper>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  center: PropTypes.bool,
};

Wrapper.defaultProps = {
  center: false,
};

export default Wrapper;
