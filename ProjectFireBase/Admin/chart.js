var xValues = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
var yLabels = {
    0: "0",
    10: '10k',
    15: '',
    20: '20k',
    25: '',
    30: '30k',
    35: '',
    40: '40k',
    45: '',
    50: '50k',
    55: '',
    60: '60k',
    65: '',
    70: "70k"
}

new Chart("myChart", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
            data: [45, 30, 40, 30, 45, 20],
            borderColor: "black",
            fill: false
        }, {
            data: [25, 45, 25, 40, 20, 40],
            borderColor: "#f1ef6e",
            fill: false
        }]
    },
    options: {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {

                    // min: 21000,
                    // max: 22500,
                    suggestedMin: 0,
                    suggestedMax: 70,
                    callback: function (value, index, values) {
                        return yLabels[value];
                    }
                },
                gridLines: {
                    display: false,
                    drawBorder: false,
                }

            }],
            xAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 70,
                },
                gridLines: {
                    display: false,
                    drawBorder: false,
                },


            }],
        }
    }
});