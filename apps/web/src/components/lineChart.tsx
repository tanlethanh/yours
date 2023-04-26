import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { randInt } from '@yours/utils';
// import faker from 'faker';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom' as const,
        },
        // title: {
        //     display: true,
        //     text: 'Tiến trình luyện tập',
        // },
    },
    maintainAspectRatio: true,
};

const labels = ['18/01', '20/01', '22/01', '23/01', '28/02', '30/03', '20/04'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Số từ vựng',
            data: labels.map(() => randInt(1, 10)),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Điểm kiểm tra',
            data: labels.map(() => randInt(1, 10)),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

export function LineChart() {
    return <Line options={options} data={data} />;
}
