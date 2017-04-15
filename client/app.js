var ctx = document.getElementById("chart");

$.getJSON( "/db.json", function( db ) {

    let celsius = db.celsius;

    console.log("celsius", celsius);

    let data = celsius.map(c => {
        let date = new Date(c.date);

        return {
            x: Date.UTC(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes()),
            y: c.celsius,
            fanOn: c.fanOn,
            color: c.fanOn ? 'blue' : 'red'
        }
    });

    let chart = Highcharts.chart('chart', {
       chart: {
           zoomType: 'x'
       },
       title: {
           text: 'Temperatur inglasad balkong'
       },
       subtitle: {
           text: document.ontouchstart === undefined ?
                   'Klicka för att zooma in' : 'Zooma in med fingrarna'
       },
       xAxis: {
           type: 'datetime'
       },
       yAxis: {
           title: {
               text: 'Temperatur'
           }
       },
       legend: {
           enabled: false
       },
       plotOptions: {
           area: {
               fillColor: {
                   linearGradient: {
                       x1: 0,
                       y1: 0,
                       x2: 0,
                       y2: 1
                   },
                   stops: [
                       [0, Highcharts.getOptions().colors[0]],
                       [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                   ]
               },
               marker: {
                   radius: 2
               },
               lineWidth: 1,
               states: {
                   hover: {
                       lineWidth: 1
                   }
               },
               threshold: null
           }
       },

       tooltip: {
            formatter: function() {
                return 'Temperatur <b>' + this.point.y + '℃</b><br/>' +
                    "Fläkt på: " + (this.point.fanOn ? "Ja" : "Nej");
            }
        },

       series: [{
           type: 'area',
           name: 'Temperatur',
           turboThreshold: 0,
           data: data
       }]
   });

});
