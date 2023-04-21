function array_init(len, mapper) {
    var out = [];
    for (var i = 0; i < len; i++) {
        out.push(mapper(i));
    }
    return out;
}

function generateFakeStocks(company_name) {
    const growth = (Math.seededRandom() * 0.7) + 0.7;
    const tendency = Math.seededRandom() > 0.5 ? 1 : -0.3;
    const offset = growth > 1 ? 0 : 100;
    // Generate fake stock prices for the past year
    const startDate = new Date(new Date().getFullYear() - 1, 0, 1);
    var endDate = new Date();
    var days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    var stockPrices = array_init(days, function (i) {
        var date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        var price = offset;
        price += wave(i, 1.0 / 50.0, (Math.seededRandom() * 50.0) + 25.0) +
            wave(i * (10 * Math.seededRandom() + 5), 1.0 / 65.0, (Math.seededRandom() * 10.0) + 5) +
            wave(i * Math.min(Math.seededRandom(), 0.6), 1.0 / 10.0, (Math.seededRandom() * 15.0) + 15) +
            ((Math.pow(i, growth) / 13) * tendency) + Math.seededRandom() * 10;
        price = Math.max(price, 3 + ((Math.seededRandom() * 3.0) - 1.5));
        return {
            date: date,
            price: price
        };
    });

    // Get the start and end dates for the last month
    var lastMonthStartDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth() - 1,
        1
    );
    var lastMonthEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);

    // Filter the stock prices array to only include prices from the last month
    var lastMonthPrices = stockPrices.filter(function (_ref) {
        var date = _ref.date;
        return date >= lastMonthStartDate && date <= lastMonthEndDate;
    });

    // Determine the trend of the stock prices over the last month
    var lastMonthFirstPrice = lastMonthPrices[0].price;
    var lastMonthLastPrice = lastMonthPrices[lastMonthPrices.length - 1].price;
    var priceDifference = (lastMonthLastPrice - lastMonthFirstPrice).toFixed(2);
    var isPriceIncrease = lastMonthLastPrice >= lastMonthFirstPrice;

    // Create array of x and y values for Plotly.js chart
    var dates = stockPrices.map(function (_ref) {
        var date = _ref.date;
        return date;
    });
    var prices = stockPrices.map(function (_ref2) {
        var price = _ref2.price;
        return price;
    });


    // Create Plotly.js chart with last month zoom and color based on trend
    var color = isPriceIncrease ? "green" : "red";
    var data = [
        {
            x: dates,
            y: prices,
            type: "scatter",
            mode: "lines",
            line: {
                color: color
            },
            name: "Stock price ($)",
            fill: "tozeroy"
        }
    ];
    var layout = {
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        pad: {
            t: 0,
            b: 0,
            l: 0,
            r: 0
        },
        xaxis: {
            range: [lastMonthStartDate, lastMonthEndDate]
        },
        annotations: [
            {
                x: lastMonthEndDate,
                y: lastMonthLastPrice,
                xref: "x",
                yref: "y",
                text:
                    "$" +
                    priceDifference +
                    " ($" +
                    (isPriceIncrease ? "+" : "-") +
                    Math.abs(priceDifference) +
                    ") last month",
                showarrow: true,
                arrowhead: 7,
                ax: 0,
                ay: -40
            }
        ],
        title:
            company_name + " Share Price " +
            lastMonthStartDate.toLocaleDateString() +
            " - " +
            lastMonthEndDate.toLocaleDateString()
    };
    Plotly.newPlot("stock_chart", data, layout);
    setTimeout(function () {
        var container = document.getElementById("stock_chart");
        Plotly.relayout(container, {
            width: container.offsetWidth,
        });
    }, 100);
}
function generateFakeData(company_name) {
    var revenue = Math.floor(Math.seededRandom() * 5000000) + 1000000;
    var gross_profit_margin = (Math.seededRandom() * (50 - 20) + 20).toFixed(2);
    var gross_profit = revenue * (gross_profit_margin / 100);
    var operating_expenses = Math.floor(Math.seededRandom() * 500000) + 100000;
    var operating_income = gross_profit - operating_expenses;
    var income_taxes = Math.floor(Math.seededRandom() * 100000) + 50000;
    var net_income = operating_income - income_taxes;
    var accounts_receivable = Math.floor(Math.seededRandom() * 100000) + 50000;
    var inventory = Math.floor(Math.seededRandom() * 100000) + 50000;
    var total_assets =
        accounts_receivable +
        inventory +
        Math.floor(Math.seededRandom() * 500000) +
        1000000;
    var accounts_payable = Math.floor(Math.seededRandom() * 50000) + 10000;
    var total_liabilities =
        accounts_payable + Math.floor(Math.seededRandom() * 500000) + 1000000;
    var equity = total_assets - total_liabilities;
    var cash_from_operating_activities =
        Math.floor(Math.seededRandom() * 500000) + 100000;
    var capital_expenditures = Math.floor(Math.seededRandom() * 500000) + 100000;
    var free_cash_flow = cash_from_operating_activities - capital_expenditures;
    var eps = (
        net_income /
        (Math.floor(Math.seededRandom() * 1000) + 500)
    ).toFixed(2);
    var roe = ((net_income / equity) * 100).toFixed(2);
    return {
        company_name: company_name,
        revenue: revenue,
        income_statement: {
            gross_profit_margin: gross_profit_margin,
            gross_profit: gross_profit,
            operating_expenses: operating_expenses,
            operating_income: operating_income,
            income_taxes: income_taxes,
            net_income: net_income
        },
        balance_sheet: {
            accounts_receivable: accounts_receivable,
            inventory: inventory,
            total_assets: total_assets,
            accounts_payable: accounts_payable,
            total_liabilities: total_liabilities,
            equity: equity
        },
        cash_flow_statement: {
            cash_from_operating_activities: cash_from_operating_activities,
            capital_expenditures: capital_expenditures,
            free_cash_flow: free_cash_flow
        },
        key_metrics: {
            eps: eps,
            roe: roe
        }
    };
}

function generateFakeGauges(company_name, width, height) {
    var fakeData = generateFakeData(company_name);

    // Get the revenue, gross profit margin, and ROI values from the HTML
    var revenueValue = fakeData.revenue;
    var grossProfitMarginValue = fakeData.income_statement.gross_profit_margin;
    var roiValue = fakeData.key_metrics.roe;

    // Create a function to format the gauge chart
    function createGauge(value, title, containerId) {
        // Calculate gauge range based on input value range
        var rangeMin = Math.floor(Math.min(value, 0) * 1.2),
            rangeMax = Math.ceil(Math.max(value, 0) * 1.2),
            rangeMid1 = Math.floor((rangeMin + rangeMax) / 3),
            rangeMid2 = Math.floor((2 * rangeMin + rangeMax) / 3);

        // Set up the gauge chart data and layout
        var data = [
            {
                type: "indicator",
                value: value,
                title: {
                    text: title
                },
                gauge: {
                    bar: {
                        color: "#007bff"
                    },
                    steps: [
                        {
                            range: [rangeMin, rangeMid1],
                            color: "#e73c42"
                        },
                        {
                            range: [rangeMid1, rangeMid2],
                            color: "#aed39a"
                        },
                        {
                            range: [rangeMid2, rangeMax],
                            color: "#1a8c37"
                        }
                    ]
                },
                mode: "gauge+number"
            }
        ];
        var layout = {
            width,
            height,
            margin: {
                autoexpand: false,
                b: 0,
                t: 0,
                l: 0,
                r: 0
            },
            pad: {
                t: 0,
                b: 0,
                l: 5,
                r: 5
            },
            paper_bgcolor: "rgba(0, 0, 0, 0)"
        };

        // Render the gauge chart
        Plotly.newPlot(containerId, data, layout);
    }

    // Call the createGauge function for each metric
    createGauge(
        revenueValue,
        "Revenue",
        "gauge-revenue"
    );
    createGauge(
        grossProfitMarginValue,
        "Gross Profit Margin",
        "gauge-gross-profit-margin"
    );
    createGauge(roiValue, "ROE", "gauge-roi");
}