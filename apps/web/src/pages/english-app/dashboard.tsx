import { type FC } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import {
	ChartStatistic,
	PracticeBlock,
	Resources,
	TextStatistic,
} from 'screens/Dashboard/components';
import { MainLayout, withAuth } from 'utils';

interface Props {
	notionAuthUrl: string;
}

const DashboardPage: FC<Props> = ({ notionAuthUrl }) => {
	console.log({ notionAuthUrl });

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

				<PracticeBlock notionAuthUrl={notionAuthUrl} />

				<ChartStatistic />

				<TextStatistic />

				<Resources />
			</div>
		</MainLayout>
	);
};

export const getStaticProps: GetStaticProps<Props> = () => {
	let notionAuthUrl;
	if (process.env.NODE_ENV === 'production') {
		notionAuthUrl = process.env.NOTION_AUTH_URL_PRO || '';
	} else notionAuthUrl = process.env.NOTION_AUTH_URL_DEV || '';

	return {
		props: {
			notionAuthUrl,
		},
	};
};

export default withAuth(DashboardPage);
