const TextStatistic = () => {
	return (
		<div className="lg:w-[300px] md:w-[300px] sm:w-[430px]">
			<h1 className="text-xl font-medium text-zinc-700 mb-2">
				Number of questions
			</h1>
			<table className="w-full">
				<tbody>
					<tr>
						<th className="px-6 py-2 text-left font-normal">
							Total sentences
						</th>
						<th className="font-normal">200</th>
					</tr>
					<tr>
						<th className="px-6 py-2 text-left font-normal">
							Reviewed sentences
						</th>
						<th className="font-normal">178</th>
					</tr>
					<tr>
						<th className="px-6 py-2 text-left font-normal">
							Number of practice tests
						</th>
						<th className="font-normal">18</th>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default TextStatistic;
