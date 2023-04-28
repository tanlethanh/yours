import { Home, Narbar } from 'components';
import type { NextPage } from 'next';

const AboutPage: NextPage = () => {
	return (
		<div className="">
			<Narbar />
			<Home />
		</div>
	);
};

AboutPage.propTypes = {};

export default AboutPage;
