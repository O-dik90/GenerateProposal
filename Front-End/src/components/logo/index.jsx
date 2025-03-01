import { Box, ButtonBase, Typography } from '@mui/material';

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import config from 'config';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ sx, to }) => {
  return (
    <ButtonBase disableRipple component={Link} to={!to ? config.defaultPath : to} sx={sx}>
      <Stack direction="row" spacing={1} alignItems="center">
        {/* <Logo /> */}
        {/*  Main Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography variant="h4" align="center">
            GEN-PROPOSAL
          </Typography>
        </Box>
      </Stack>
    </ButtonBase>
  );
};

LogoSection.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;
