import * as React from "react";
import { styled } from '@material-ui/system';
import { fonts, colors } from "../styles";

const SBannerWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  textAlign: 'center',
  margin: '0px auto',
  flexWrap: 'wrap',
  width: '100%',
  '[& span]': {
    color: 'rgb('+colors.white+')',
    fontWeight: fonts.weight.normal,
    fontSize: fonts.size.h5
  }
}));

const STitleWrapper = styled('h3')(({ theme }) => ({
    display: 'table',
    margin: '0 auto',
    width: '100%'
}));

const Banner = () => (
  <SBannerWrapper>
    <STitleWrapper>{`Wrapped Navcoin Bridge`}</STitleWrapper>
  </SBannerWrapper>
);

export default Banner;
