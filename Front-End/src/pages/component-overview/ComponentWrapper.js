import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const ComponentWrapper = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5)
  }
}));

export default ComponentWrapper;
