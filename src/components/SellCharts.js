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

const SellCharts = ({lbl,dta}) => {
    const data = {
        labels: lbl,
        datasets: [{
            data: dta,
            backgroundColor: 'transparent',
            borderColor: '#08E1E1',
            pointBorderColor: 'transparent',
            pointBorderWidth: 4,
            tension: .2
        }]
    };
    const options = {
        plugins: {
            legend: false
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                min: Math.min(...dta),
                max: Math.max(...dta)+100,
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
        <div style={{ width: '900px', height: '500px'}} >
            <Line data={data} options={options}></Line>

        </div>


    )
}

export default SellCharts