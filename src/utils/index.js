export function commonProps(X1, RO1, RO2, C1, C2) {
    const MU = 0.35;

    const R0 = X1 * RO1 + (1 - X1) * RO2;
    const C = 1 / Math.sqrt((X1 / (RO1 * C1 ** 2) + (1 - X1) / (RO2 * C2 ** 2))) * R0;
    const NU = MU / R0;

    return {
        MU,
        R0,
        C,
        NU
    }
}

export function functionS(C, NU, L, T, X) {
    let S = 0;
    for (let N = 1; N <= 10; N++) {
        const AA = Math.PI * N * C / 2 / L;
        const BB = Math.PI * N * NU / 2 / L;
        const K = Math.sin(AA * Math.sqrt(Math.abs(BB - C)) * T) + Math.cos(AA * Math.sqrt(Math.abs(BB - C)) * T);
        const SN = (((1 - (-1) ** N) / N / N) * Math.cos((Math.PI * N * X) / L) * Math.exp(-(Math.pow(Math.PI * N, 2) * NU * T) / (L * L * 2)) * K);
        S += SN;
    }
    return S
}

export function frequency(arrayT) {
    const period = arrayT.length > 0 ? ((+arrayT[arrayT.length - 1].t - +arrayT[0].t) / arrayT.length) : 0.00001;
    const freq = 1/(period+0.00001);

    return freq
}
