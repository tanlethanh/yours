import Dashboard from 'screens/Dashboard';
import { withAuth } from 'utils';

const DashboardPage = () => {
	return <Dashboard />;
};

export default withAuth(DashboardPage);
