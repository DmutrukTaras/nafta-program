import Chart from 'react-apexcharts';

function MyChart({ options, series, title }) {
    return (
        <div className='Chart-result'>
            <div>{title}</div>
            <Chart options={options} series={series} type="line" height={500} width={1000}/>
        </div>
    )
}
export default MyChart;