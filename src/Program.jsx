import React, { useState, useEffect } from 'react';
import { TextField, Box, Divider, Button } from '@mui/material';

import Chart from './components/Chart';
import MyTable from './components/Table';

import { commonProps, functionS, frequency } from './utils'

const Program = () => {
    const [X1, setX1] = useState(0.9);
    const [RO1, setRO1] = useState(1100);
    const [C1, setC1] = useState(1800);
    const [E1, setE1] = useState(2200);
    const [X2, setX2] = useState(0.1);
    const [RO2, setRO2] = useState(2600);
    const [C2, setC2] = useState(2800);
    const [E2, setE2] = useState(10000);
    const [L, setL] = useState(2000);
    const [maxT, setMaxT] = useState(1);
    const [F0, setF0] = useState(1000);
    const [S, setS] = useState(0.018);
    
    const [showBlock, setShowBlock] = useState({});
    
    const [output, setOutput] = useState([]);
    const [chartOptions, setChartOptions] = useState({});
    const [chartSeries, setChartSeries] = useState([]);

    const [outputL, setOutputL] = useState([]);
    const [chartOptionsL, setChartOptionsL] = useState({});
    const [chartSeriesL, setChartSeriesL] = useState([]);

    const [outputA, setOutputA] = useState([]);
    const [chartOptionsA, setChartOptionsA] = useState({});
    const [chartSeriesA, setChartSeriesA] = useState([]);

    const calculateX = () => {
        const MU = 0.35;
        const PI = Math.PI;

        let X = 0;     
        let resultF = [];
        let resultA = [];
        
        for (let valueX = 0.8; valueX < 1; valueX+=0.01) {
                
            const R0 = valueX * RO1 + (1 - valueX) * RO2;
            const C = 1 / Math.sqrt((valueX / (RO1 * C1 ** 2) + (1 - valueX) / (RO2 * C2 ** 2))) * R0;
            const NU = MU / R0;

            let T = 0;
            let result = [];
            let arrayT = [];
            let counter = 0;

            while (T <= maxT) {
                const S = functionS(C, NU, L, T, X)
                const U = (2 * L / (PI ** 2)) * S;
            
                if (T === 0) var U1 = U;
                const normalizedU = U / U1;
            
                result.push({ t: T.toFixed(2), U: normalizedU.toFixed(3) });
            
                T += 0.01;
            }

            result.forEach((value, index, arr) => {
                if(counter < 4 && arr[index+1] && arr[index+2] && ((value.U - arr[index+1].U) > 0) && ((arr[index+1].U - arr[index+2].U) < 0)){
                    counter++;
                    arrayT.push(arr[index+1]);
                }
            })

            const period = arrayT.length > 0 ? ((+arrayT[arrayT.length - 1].t - +arrayT[0].t) / arrayT.length) : 0.00001;
            const frequency = 1/(period+0.00001);
            if (frequency < 1000) resultF.push({ T: frequency.toFixed(4), L: valueX.toFixed(2) });

            const E = (E1*valueX +E2*(1-valueX))*1000000
            const amplitude = (F0*C) / (2 * frequency * E * S * Math.cos(frequency * L / C));
            if (frequency < 1000) resultA.push({ A: amplitude.toFixed(4), L: valueX.toFixed(2) });
        }
        setOutputL(resultF);
        setOutputA(resultA);
        setShowBlock({'x': true});
    };

    const calculateL = () => {        
        const { C, NU } = commonProps(X1, RO1, RO2, C1, C2);
        const step = Math.round(L/20);

        let X = 0;     
        let resultF = [];
        let resultA = [];
        
        for (let valueL = 1; valueL <= L; valueL+=step) {
            let T = 0;
            let result = [];
            let arrayT = [];
            let counter = 0;

            while (T <= maxT) {
                const S = functionS(C, NU, valueL, T, X)
                const U = (2 * valueL / (Math.PI ** 2)) * S;
            
                if (T === 0) var U1 = U;
                const normalizedU = U / U1;
            
                result.push({ t: T.toFixed(2), U: normalizedU.toFixed(3) });
                T += 0.01;
            }

            result.forEach((value, index, arr) => {
                if(counter < 4 && arr[index+1] && arr[index+2] && ((value.U - arr[index+1].U) > 0) && ((arr[index+1].U - arr[index+2].U) < 0)){
                    counter++;
                    arrayT.push(arr[index+1]);
                }
            })

            const period = arrayT.length > 0 ? ((+arrayT[arrayT.length - 1].t - +arrayT[0].t) / arrayT.length) : 0.00001;
            const frequency = 1/(period+0.00001);

            if (frequency < 1000) resultF.push({ T: frequency.toFixed(4), L: valueL.toFixed(1) });

            const E = (E1*X1 +E2*(1-X1))*1000000
            const amplitude = (F0*C) / (2 * frequency * E * S * Math.cos(frequency * valueL / C));
            if (frequency < 1000) resultA.push({ A: amplitude.toFixed(4), L: valueL.toFixed(1) });
        }
        setOutputL(resultF);
        setOutputA(resultA);
        setShowBlock({'l': true});
    };

    const calculate = () => {        
        const { C, NU } = commonProps(X1, RO1, RO2, C1, C2);

        let X = 0;
        let T = 0;
        let result = [];

    
        while (T <= maxT) {
            const S = functionS(C, NU, L, T, X)
            const U = (2 * L / (Math.PI ** 2)) * S;

            if (T === 0) var U1 = U;
            const normalizedU = U / U1;
        
            result.push({ t: T.toFixed(2), U: normalizedU.toFixed(3) });
            T += 0.01;
        }
    
        setOutput(result);
        setShowBlock({'u': true});

    };

    const reset = () => {
        setOutput([]);
        setOutputL([]);
        setOutputA([]);
        setShowBlock({});

    }

    useEffect(() => {
        const labels = outputL.map((row) => row.L);
        const data = outputL.map((row) => row.T);
    
        setChartOptionsL({
          chart: {
            id: 'chart',
          },
          xaxis: {
            categories: labels,
          },
        });
    
        setChartSeriesL([
          {
            name: 'T',
            data: data,
          },
        ]);
      }, [outputL]);

    useEffect(() => {
        const labels = outputA.map((row) => row.L);
        const data = outputA.map((row) => row.A);
    
        setChartOptionsA({
          chart: {
            id: 'chart',
          },
          xaxis: {
            categories: labels,
          },
        });
    
        setChartSeriesA([
          {
            name: 'A',
            data: data,
          },
        ]);
      }, [outputA]);
    
    useEffect(() => {
        const labels = output.map((row) => row.t);
        const data = output.map((row) => row.U);
    
        setChartOptions({
          chart: {
            id: 'chart',
          },
          xaxis: {
            categories: labels,
          },
        });
    
        setChartSeries([
          {
            name: 'T',
            data: data,
          },
        ]);
      }, [output]);
    
    return (
        <div>
            <Box
                sx={{
                    '& > :not(style)': { m: 1 },
                }}
            >
                <Divider textAlign="left">Середовище: <b>Буровий розчин</b></Divider>
                <TextField
                    label="X1"
                    title='Введіть концентрацію буровового розчину'
                    value={X1}
                    type="number"
                    onChange={(e) => {
                        setX1(e.target.value)
                        setX2((1 - +e.target.value).toFixed(2))
                    }}
                />
                <TextField
                    label="RO1"
                    title='Введіть густину буровового розчину'
                    value={RO1}
                    type="number"
                    onChange={(e) => setRO1(e.target.value)}
                />
                <TextField
                    label="C1"
                    title='Введіть швидкість звуку в бурововому розчині'
                    value={C1}
                    type="number"
                    onChange={(e) => setC1(e.target.value)}
                />
                <TextField
                    label="E1"
                    title='Введіть модуль пружності буровового розчину'
                    value={E1}
                    type="number"
                    onChange={(e) => setE1(e.target.value)}
                />
                <Divider textAlign="left">Середовище: <b>Гірська порода</b></Divider>
                <TextField
                    label="X2"
                    title='Концентрація гірської породи'
                    value={X2}
                    type="number"
                    disabled
                />
                <TextField
                    label="RO2"
                    title='Введіть густину гірської породи'
                    value={RO2}
                    type="number"
                    onChange={(e) => setRO2(e.target.value)}
                />
                <TextField
                    label="C2"
                    title='Введіть швидкість звуку в гірській породі'
                    value={C2}
                    type="number"
                    onChange={(e) => setC2(e.target.value)}
                />
                <TextField
                    label="E2"
                    title='Введіть модуль пружності гірської породи'
                    value={E2}
                    type="number"
                    onChange={(e) => setE2(e.target.value)}
                />
                <Divider textAlign="left">Параметри</Divider>
                <TextField
                    label="L"
                    title='Введіть відстань'
                    value={L}
                    type="number"
                    onChange={(e) => setL(e.target.value)}
                />
                <TextField
                    label="max T"
                    title='Введіть час'
                    value={maxT}
                    type="number"
                    onChange={(e) => setMaxT(e.target.value)}
                />
                <TextField
                    label="F0"
                    title='Введіть силу'
                    value={F0}
                    type="number"
                    onChange={(e) => setF0(e.target.value)}
                />
                <TextField
                    label="S"
                    title='Введіть площу кільцевого перерізу'
                    value={S}
                    type="number"
                    onChange={(e) => setS(e.target.value)}
                />
            </Box>
            <Button className='Button-calculate' variant="contained" onClick={calculate}>
                Розрахувати U
            </Button>
            <Button className='Button-calculate' variant="contained" onClick={calculateL}>
                Графіки залежності від L
            </Button>
            <Button className='Button-calculate' variant="contained" onClick={calculateX}>
                Графіки залежності від X
            </Button>
            <Button className='Button-calculate' variant="contained" onClick={reset}>
                Скинути
            </Button>

            {showBlock?.u && output.length>0 && (
                <div>
                    <MyTable data={output} lable={['t', 'U']} title={['t', 'U']} />
                    <Chart options={chartOptions} series={chartSeries} title={'Графік залежності U від Т'} />
                </div>
            )}
            {showBlock?.l && outputL.length>0 && (
                <div style={{'display': 'flex', 'marginBottom': '2em'}}>
                    <MyTable data={outputL} lable={['L', 'T']} title={['Довжина', 'Частота']} />
                    <Chart options={chartOptionsL} series={chartSeriesL} title={'Графік залежності Частоти від Довжини'}  />
                </div>
            )}
            {showBlock?.l && outputA.length>0 && (
                <div style={{'display': 'flex'}}>
                    <MyTable data={outputA} lable={['L', 'A']} title={['Довжина', 'Амплітуда']} />
                    <Chart options={chartOptionsA} series={chartSeriesA} title={'Графік залежності Амплітуди від Довжини'}  />
                </div>
            )}
            {showBlock?.x && outputL.length>0 && (
                <div style={{'display': 'flex', 'marginBottom': '2em'}}>
                    <MyTable data={outputL} lable={['L', 'T']} title={['X1', 'Частота']} />
                    <Chart options={chartOptionsL} series={chartSeriesL} title={'Графік залежності Частоти від X1'}  />
                </div>
            )}
            {showBlock?.x && outputA.length>0 && (
                <div style={{'display': 'flex'}}>
                    <MyTable data={outputA} lable={['L', 'A']} title={['X1', 'Амплітуда']} />
                    <Chart options={chartOptionsA} series={chartSeriesA} title={'Графік залежності Амплітуди від X1'}  />
                </div>
            )}
        </div>
    );
};
          
export default Program;