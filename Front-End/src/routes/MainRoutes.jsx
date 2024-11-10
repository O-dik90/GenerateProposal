import Dashboard from 'layout/Dashboard';
// project import
import Loadable from 'components/Loadable';
import { lazy } from 'react';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const OldProposal = Loadable(lazy(() => import('pages/old-proposal/main')));
// render - proposal Page
const ProposalTable = Loadable(lazy(() => import('pages/proposal/index')));
const ProposalDetail = Loadable(lazy(() => import('pages/proposal/detail')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'old-proposal',
      element: <OldProposal />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'proposal-table',
      element: <ProposalTable />
    },
    {
      path: 'proposal-table/:name',
      element: <ProposalDetail />
    }
  ]
};

export default MainRoutes;
