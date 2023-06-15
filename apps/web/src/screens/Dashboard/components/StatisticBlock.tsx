import { LineChart } from 'components';

export const ChartStatistic = () => {
	return (
		<div className="md:w-[700px] h-[400px] sm:w-[430px]">
			<h1 className="text-xl font-medium text-zinc-700 mb-4">
				{'Progress'}
			</h1>
			<LineChart />
		</div>
	);
};

export default ChartStatistic;
