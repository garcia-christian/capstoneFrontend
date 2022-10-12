import React from 'react'
import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js'

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)

const SellCharts = ({ lbl, dta, ldta }) => {
    const data = {
        labels: lbl,
        datasets: [{
            data: dta,
            backgroundColor: 'transparent',
            borderColor: '#08E1E1',
            pointBorderColor: 'transparent',
            pointBorderWidth: 4,
            tension: .2
        }, {
            data: ldta,
            backgroundColor: 'transparent',
            borderColor: '#FAA0A0',
            pointBorderColor: 'transparent',
            pointBorderWidth: 4,
            tension: .2
        }

        ]
    };
    const options = {
        maintainAspectRatio: false,
        plugins: {

        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                min: 5,
                max: Math.round(Math.max(...dta) + 100, 2),
                ticks: {
                    stepSize: 100,
                    callback: (value) => value + ""
                },
                grid: {
                    borderDash: [10]
                }
            }

        }

    }

    return (

        <div style={{ width: '1200px', height: '500px' }} >

            <Line data={data} options={options} title="ssdsdsd"></Line>

        </div>


    )
}

export default SellCharts