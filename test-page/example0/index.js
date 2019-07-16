d3.csv(
    'https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv',
    function(d,i) {
        return d;
    },
    function(data) {
        const instance = hepexplorer(
            '#container', // element
            {
            } // settings
        );
        instance.init(data);
    }
);
