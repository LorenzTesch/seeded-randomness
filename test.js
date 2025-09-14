const assert = require('node:assert/strict');
const dng = require('./dng');

{
    let v0 = dng('abc');
    let v1 = dng('abc');
    console.log(v0, v1);

    assert.strictEqual(v0, v1);
}

{
    let v = dng(Math.random());
    console.log(v);

    assert.strictEqual(false, isNaN(v));
    assert.strictEqual(true, v <= 1);
    assert.strictEqual(true, v >= 0);
}

{
    let v = dng(Math.random(), 100, 10);
    console.log(v);

    assert.strictEqual(false, isNaN(v));
    assert.strictEqual(true, v <= 100);
    assert.strictEqual(true, v >= 10);
}

{

    let n = 1000;
    let cells = 100;

    let erwartung = n / cells;

    let distribution = new Array(cells);

    for (let i = 0; i < n; i++) {

        let v = dng(Math.random(), 99, 0);

        distribution[v] = (distribution[v] || 0) + 1;

    }

    function gammaln(x) {
        const cof = [
            76.18009172947146, -86.50532032941677,
            24.01409824083091, -1.231739572450155,
            0.1208650973866179e-2, -0.5395239384953e-5
        ];
        let y = x;
        let tmp = x + 5.5;
        tmp -= (x + 0.5) * Math.log(tmp);
        let ser = 1.000000000190015;
        for (let j = 0; j < cof.length; j++) ser += cof[j] / ++y;
        return Math.log(2.5066282746310005 * ser / x) - tmp;
    }

    // Regularized gamma Q function (upper tail probability)
    function gammq(a, x) {
        function gser(a, x) {
            const ITMAX = 100, EPS = 1e-8;
            let sum = 1.0 / a, del = sum, ap = a;
            for (let n = 1; n <= ITMAX; n++) {
                ap++;
                del *= x / ap;
                sum += del;
                if (Math.abs(del) < Math.abs(sum) * EPS) break;
            }
            return sum * Math.exp(-x + a * Math.log(x) - gammaln(a));
        }
        function gcf(a, x) {
            const ITMAX = 100, EPS = 1e-8, FPMIN = 1e-30;
            let b = x + 1 - a, c = 1 / FPMIN, d = 1 / b, h = d;
            for (let i = 1; i <= ITMAX; i++) {
                const an = -i * (i - a);
                b += 2;
                d = an * d + b;
                if (Math.abs(d) < FPMIN) d = FPMIN;
                c = b + an / c;
                if (Math.abs(c) < FPMIN) c = FPMIN;
                d = 1 / d;
                const del = d * c;
                h *= del;
                if (Math.abs(del - 1.0) < EPS) break;
            }
            return Math.exp(-x + a * Math.log(x) - gammaln(a)) * h;
        }
        return (x < a + 1) ? 1 - gser(a, x) : gcf(a, x);
    }

    let chiSquare = distribution.reduce((summe, current) => {

        let r = Math.pow(current - erwartung, 2) / erwartung;

        return summe + r;

    });

    const df = cells - 1;
    const pValue = gammq(df / 2, chiSquare / 2);

    console.log("Freiheitsgrade:", df);
    console.log("p-Wert:", pValue);

    // Entscheidung (Signifikanzniveau 5%)
    if (pValue > 0.05) {
        console.log('Likely equal distribution.');
    } else {
        console.log('Possibly unequal distribution.');
    }

}