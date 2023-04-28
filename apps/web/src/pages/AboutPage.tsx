import React from 'react';
import PropTypes from 'prop-types';
import type { NextPage } from 'next';
import {Narbar, Home} from 'components';

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
