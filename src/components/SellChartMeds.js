import React from 'react'
import { Bar } from 'react-chartjs-2';
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

const SellChartMeds = ({ dta }) => {
    console.log(dta);
    const data = {
        labels: dta.map((value) => value.global_brand_name),
        datasets: [{
            axis: 'y',
            data: dta.map((value) => value.revenue),
            backgroundColor: 'rgb(8,225,225,0.5)',
            borderSkipped: false,
            label: 'Revenue',
            barPercentage: 0.5,
            barThickness: 15,
            fill: false,
            axis: 'y',
        }

        ]
    };
    const options = {
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {

        },
        scales: {
            x: {
                min: 0,
                max: Math.max(dta.revenue),
                ticks: {
                    stepSize: Math.max(dta.revenue)/2,
                    callback: (value) => value + ""
                },
                grid: {
                    borderDash: [10]
                }

            },
            y: {
                grid: {
                    display: false
                }
            }

        }

    }

    return (

        <div style={{ width: '1200px', height: '500px' }} >

            <Bar data={data} options={options} ></Bar>

        </div>


    )
}

export default SellChartMeds