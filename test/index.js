document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
      //Load local build if in local environment.
      if (window.origin !== 'https://rhoinc.github.io') {
          var head = document.getElementsByTagName('head')[0];

        //...load local build.
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = '../build/safetyedish.js';
          head.appendChild(script);
      }

      d3.csv(
          //'https://rawgit.com/RhoInc/viz-library/master//data/safetyData-queries/ADBDS.csv',
          '../../viz-library/data/safetyData-queries/ADBDS.csv', // local copy loads faster
          function(error,data) {
              if (error)
                  console.log(error);

                  let settings = {
                    group_cols:["ARM","RACE"]
                  }

                  let chart = safetyedish('#container', settings);
                  chart.init(data);

          }
      );
    }
}
