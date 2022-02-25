export default function calculatePalt(pt) {
    // Calculates the pAlt value for the given participant ID
    // For more on PAlt see the following paper: A Rapid Method to Estimate Hepatocyte Loss Due to Drug-Induced Liver Injury by Chung et al
    // Requires: Baseline visit
    // Assumes: Units on Alt are IU/L
    var config = this.config;

    //Get a list of raw post-baseline ALT values
    var alt_values = pt.values.raw
        .filter(f => f[config.measure_col] == config.measure_values.ALT)
        .map(function(d) {
            var obj = {};
            obj.value = d[config.value_col];
            obj.day = d[config.studyday_col];
            obj.hour = obj.day * 24;
            return obj;
        });

    if (alt_values.length > 1) {
        //get peak alt value
        const alt_peak = d3.max(alt_values, f => f.value);

        //caluculate ALT AUC
        const alt_auc = d3.sum(alt_values, function(d, i) {
            if (i < alt_values.length - 1) {
                const di = d;
                const vi = di.value;
                const hi = di.hour;
                const dii = alt_values[i + 1];
                const vii = dii.value;
                const hii = dii.hour;
                const v_avg = (vii + vi) / 2;
                const h_diff = hii - hi;
                const segment_auc = v_avg * h_diff;

                return segment_auc;
            } else {
                return 0;
            }
        });

        //calculate pAlt  (ALT AUC + AltPeak ^ 0.18)
        const p_alt = (alt_auc * Math.pow(alt_peak, 0.18)) / 100000;
        const p_alt_rounded = d3.format('0.2f')(p_alt);
        const alt_auc_rounded = d3.format('0.2f')(alt_auc);
        const alt_peak_rounded = d3.format('0.2f')(alt_peak);
        const note =
            '<em>NOTE: </em>' +
            'For this participant, P<sub>ALT</sub> was calculated as: ' +
            'ALT AUC * Peak ALT <sup>0.18</sup> / 10<sup>5</sup> = ' +
            alt_auc_rounded +
            ' * ' +
            alt_peak_rounded +
            ' <sup>0.18</sup> / 10<sup>5</sup> = ' +
            p_alt_rounded +
            '<br>' +
            'P<sub>ALT</sub> shows promise in predicting the percentage hepatocyte loss on the basis of the maximum value and the AUC of serum ALT observed during a DILI event. For more details see <a target = "_blank" href = "https://www.ncbi.nlm.nih.gov/pubmed/30303523">A Rapid Method to Estimate Hepatocyte Loss Due to Drug-Induced Liver Injury</a> by Chung et al.';

        const obj = {
            value: p_alt,
            text_value: p_alt_rounded,
            values: alt_values,
            note: note,
            components: {
                peak: alt_peak,
                auc: alt_auc
            }
        };

        return obj;
    } else {
        return null; //if no alt values are found
    }
}
