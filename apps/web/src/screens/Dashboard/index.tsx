import Head from 'next/head';
import { MainLayout } from 'utils';

import PracticeBlock from './components/PracticeBlock';
import Resources from './components/Resources';
import ChartStatistic from './components/StatisticBlock';
import TextStatistic from './components/TextStatistic';

function Dashboard() {
	return (
		<MainLayout
			withHeader={true}
			className="bg-white"
			headerClassName="text-black"
		>
			<div className="flex flex-row flex-wrap justify-around gap-y-6 pt-8">
				<Head>
					<title>Sipo English | Dashboard</title>
				</Head>

				<PracticeBlock />

				<ChartStatistic />

				<TextStatistic />

				<Resources />
			</div>
		</MainLayout>
	);
}

export default Dashboard;
