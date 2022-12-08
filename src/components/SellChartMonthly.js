import React from 'react'
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto'

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

const SellChartMonthly = ({ dta }) => {
    console.log(dta);
    const data = {
        labels: dta.map((value) => value.monthlong),
        datasets: [{
            data: dta.map((value) => value.revenue),
            backgroundColor: 'transparent',
            borderColor: '#08E1E1',
            pointBorderColor: dta.map((value) => value.revenue == 0 ? 'transparent' : 'rgb(8,225,225,0.6)'),
            pointBorderWidth: 4,
            tension: 0,
            label: 'Revenue'
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
                max: Math.max(dta.revenue) + 100,
                ticks: {
                    stepSize: 1000,
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

            <Line data={data} options={options} ></Line>

        </div>


    )
}

export default SellChartMonthly