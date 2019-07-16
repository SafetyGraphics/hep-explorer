d3.csv(
    'https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv',
    function(d,i) {
        return d;
    },
    function(data) {
        const instance = hepexplorer(
            '#container', // element
            {
                filters: ['SEX', 'AGE', 'ARM', 'RACE', 'SITEID'],
            } // settings
        );
        instance.init(data);
        setTimeout(() => instance.destroy(), 1000);
    }
);
