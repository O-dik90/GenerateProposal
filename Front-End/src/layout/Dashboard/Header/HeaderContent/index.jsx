import Box from '@mui/material/Box';
// import { GithubOutlined } from '@ant-design/icons';
// import IconButton from '@mui/material/IconButton';
// import Link from '@mui/material/Link';
import MobileSection from './MobileSection';
// import Notification from './Notification';
import Profile from './Profile';
// import Search from './Search';
import useMediaQuery from '@mui/material/useMediaQuery';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {/* {!downLG && <Search />} */}
      {!downLG && <Box sx={{ flexGrow: 1 }} />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      {/* <Notification /> */}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
