import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const DrawerHeaderStyled = styled(Box, {
  shouldForwardProp: (prop) => !['open', 'elevation'].includes(prop)
})(({ theme, open, elevation = 0 }) => ({
  ...theme.mixins.toolbar,
  display: 'flex',
  alignItems: 'center',
  justifyContent: open ? 'flex-start' : 'center',

  paddingLeft: theme.spacing(open ? 3 : 0),
  paddingRight: theme.spacing(2),
  transition: theme.transitions.create(['padding', 'justify-content'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  boxShadow: elevation ? theme.shadows[elevation] : 'none',
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  zIndex: theme.zIndex.drawer + 1
}));

export default DrawerHeaderStyled;
