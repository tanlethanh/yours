import React from 'react';
import PropTypes from 'prop-types';
import type { NextPage } from 'next';
import Narbar from '../components/about/Narbar';
import { Home } from '../components/about/Home';

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
