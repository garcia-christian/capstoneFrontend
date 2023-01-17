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

const SellCharts = ({ lbl, dta, ldta, smy, lmy }) => {
    console.log(smy);
    const data = {
        labels: lbl,
        datasets: [{
            data: dta,
            backgroundColor: 'transparent',
            borderColor: '#08E1E1',
            pointBorderColor: 'transparent',
            pointBorderWidth: 4,
            tension: .2,
            label: smy
        }, {
            data: ldta,
            backgroundColor: 'transparent',
            borderColor: '#FAA0A0',
            pointBorderColor: 'transparent',
            pointBorderWidth: 4,
            tension: .2,
            label: lmy
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
                max: (dta + ldta) / 2,
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