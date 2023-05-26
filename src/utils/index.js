export function commonProps(X1, RO1, RO2, C1, C2) {
    const MU = 0.35;

    const R0 = (X1 * RO1) + ((1 - X1) * RO2);
    const C = 1 / Math.sqrt((X1 / (RO1 * C1 ** 2) + (1 - X1) / (RO2 * C2 ** 2)) * R0);
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
    for (let N = 1; N <= 5; N++) {
        const AA = Math.PI * N / 2 / L;
        const BB = Math.pow((Math.PI * N * NU / 2 / L), 2);
        const K = Math.sin(AA * Math.sqrt(C * C - BB) * T) + Math.cos(AA * Math.sqrt(C * C - BB) * T);
        const SN = (((1 - (-1) ** N) / N / N) * Math.cos((Math.PI * N * X) / L) * Math.exp(-(Math.pow(Math.PI * N, 2) * NU * T) / (L * L * 2)) * K);
        S += SN;
    }
    return S
}
