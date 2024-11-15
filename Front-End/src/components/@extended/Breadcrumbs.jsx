import { Link, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import MainCard from 'components/MainCard';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

export default function Breadcrumbs({ navigation, title, maxItems = 8, separator = '/', ...others }) {
  const location = useLocation();
  const [main, setMain] = useState();
  const [item, setItem] = useState();

  // Memoize the collapse function to prevent unnecessary recalculations
  const getCollapse = useMemo(
    () => (menu) => {
      if (!menu.children) return;

      menu.children.forEach((collapse) => {
        if (collapse.type === 'collapse') {
          getCollapse(collapse);
        } else if (collapse.type === 'item' && location.pathname === collapse.url) {
          setMain(menu);
          setItem(collapse);
        }
      });
    },
    [location.pathname]
  );

  useEffect(() => {
    navigation?.items?.forEach((menu) => {
      if (menu.type === 'group') {
        getCollapse(menu);
      }
    });
  }, [navigation, getCollapse]);

  const renderBreadcrumbLink = (to, text, isLast = false) => (
    <Typography
      component={isLast ? 'span' : Link}
      to={to}
      variant="h6"
      sx={{
        textDecoration: 'none',
        color: isLast ? 'black' : 'text.secondary',
        fontWeight: isLast ? 'bold' : 'normal',
        '&:hover': {
          color: 'black'
        }
      }}
    >
      {text}
    </Typography>
  );

  const breadcrumbContent = useMemo(() => {
    if (!item || item.type !== 'item' || item.breadcrumbs === false) {
      return <Typography />;
    }

    return (
      <MainCard border={false} sx={{ mb: 3, bgcolor: 'transparent' }} {...others} content={false}>
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <MuiBreadcrumbs
                separator={separator}
                maxItems={maxItems}
                aria-label="breadcrumb"
                sx={{
                  '& .MuiBreadcrumbs-separator': {
                    mx: 1.5,
                    color: 'text.secondary'
                  }
                }}
              >
                {renderBreadcrumbLink('/dashboard', 'Home')}
                {renderBreadcrumbLink(location.pathname, item.title, true)}
              </MuiBreadcrumbs>
            </Grid>
            {title && (
              <Grid item sx={{ mt: 1 }}>
                <Typography variant="h5" color="black">
                  {item.title}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </MainCard>
    );
  }, [item, main, title, maxItems, separator, others, location.pathname]);

  return breadcrumbContent;
}

Breadcrumbs.propTypes = {
  navigation: PropTypes.shape({
    items: PropTypes.array
  }).isRequired,
  title: PropTypes.bool,
  maxItems: PropTypes.number,
  separator: PropTypes.node,
  sx: PropTypes.object,
  others: PropTypes.object
};
