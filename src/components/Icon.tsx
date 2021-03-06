import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "@emotion/styled";

interface IIconStyleProps {
  size: number;
}

const SIcon = styled.img<IIconStyleProps>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  margin-right: 10px;
`;

const Icon = (props: any) => {
  const { src, fallback, size } = props;
  return (
    <SIcon
      {...props}
      src={src}
      size={size}
      onError={(event: any) => (event.target.src = fallback)}
    />
  );
};

Icon.propTypes = {
  src: PropTypes.string,
  fallback: PropTypes.string,
  size: PropTypes.number,
};

Icon.defaultProps = {
  src: null,
  fallback: null,
  size: 20,
};

export default Icon;
