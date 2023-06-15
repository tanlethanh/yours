export const Resources = () => {
	return (
		<div className="w-[700px]">
			<h1 className="text-xl font-medium text-zinc-700 mb-2">
				Resources
			</h1>
			<div>
				<table className="table-auto">
					<tbody>
						<tr className="font-normal">
							<th className="px-6 py-2 text-left font-normal">
								Notion: Pratice english
							</th>
							<th className="text-right font-normal px-12">
								32 sentences
							</th>
							<th className="text-right font-normal">
								Updated: 20/11
							</th>
						</tr>
						<tr className="">
							<th className="px-6 py-2 text-left font-normal">
								Notion: Practice grammar
							</th>
							<th className="text-right font-normal px-12">
								8 sentences
							</th>
							<th className="text-right font-normal">
								Updated: 20/11
							</th>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Resources;
