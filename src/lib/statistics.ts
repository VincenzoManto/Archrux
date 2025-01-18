import jStat from 'jstat';

export function tTestTwoSample(sample1: number[], sample2: number[]): { tValue: number, pValue: number } {
    const mean = (data: number[]) => data.reduce((a, b) => a + b, 0) / data.length;
    const variance = (data: number[], mean: number) => data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (data.length - 1);
    
    const mean1 = mean(sample1);
    const mean2 = mean(sample2);
    const var1 = variance(sample1, mean1);
    const var2 = variance(sample2, mean2);
    
    const n1 = sample1.length;
    const n2 = sample2.length;
    
    const tValue = (mean1 - mean2) / Math.sqrt((var1 / n1) + (var2 / n2));
    
    const degreesOfFreedom = Math.pow((var1 / n1) + (var2 / n2), 2) /
        ((Math.pow(var1 / n1, 2) / (n1 - 1)) + (Math.pow(var2 / n2, 2) / (n2 - 1)));
    
    const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tValue), degreesOfFreedom));
    
    return { tValue, pValue };
}