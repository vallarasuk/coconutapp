import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import OrderProduct from "../../helper/OrderProduct";
import Currency from "../../lib/Currency";
import Spinner from "../../components/Spinner";
import NoRecordFound from "../../components/NoRecordFound";

const OrderReportChart = (props) => {
  const [total, setTotal] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [average, setAverage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState([]);

  let params = props.params;
  let graphData = props.filterData;

  useEffect(() => {}, [storeList]);

  useEffect(() => {
    getStoresList();
  }, [graphData]);

  const getStoresList = async () => {
    let locationName = [];
    let storeAmount = [];
    let total;
    let average;
    let storesLists = [];
    if (graphData) {
      storesLists = graphData.data;
      if (storesLists) {
        if (storesLists.length == 0) {
          setIsLoading(true);
          locationName.push([]);
          storeAmount.push([]);
          setStoreList(locationName);
          setTotalAmount(storeAmount);
          total = graphData.totalAmount;
          setTotal(total);
          setAverage(graphData.average);
          setIsLoading(false);
        } else {
          for (let i = 0; i < storesLists.length; i++) {
            if (params.type == "Location Wise" && !params.sortType) {
              locationName.push(storesLists[i].name);
              storeAmount.push(storesLists[i].totalAmount);
              setStoreList(locationName);
              setTotalAmount(storeAmount);
            }

            if (
              storesLists[i].name &&
              params.sortType == OrderProduct.REPORT_TYPE_AMOUNT_WISE
            ) {
              locationName.push(storesLists[i].name);
              storeAmount.push(storesLists[i].totalAmount);
              setStoreList(locationName);
              setTotalAmount(storeAmount);
            }
            if (
              storesLists[i].name &&
              params.sortType == OrderProduct.REPORT_TYPE_QUANTITY_WISE
            ) {
              locationName.push(storesLists[i].name);
              storeAmount.push(storesLists[i].totalCount);
              setStoreList(locationName);
              setTotalAmount(storeAmount);
            }

            if (storesLists[i].date && !params.sortType) {
              locationName.push(storesLists[i].date);
              storeAmount.push(storesLists[i].amount);
              setStoreList(locationName);
              setTotalAmount(storeAmount);
            }

            if (
              storesLists[i].date &&
              params.sortType == OrderProduct.REPORT_TYPE_AMOUNT_WISE
            ) {
              locationName.push(storesLists[i].date);
              storeAmount.push(storesLists[i].amount);
              setStoreList(locationName);
              setTotalAmount(storeAmount);
            }
            if (
              storesLists[i].date &&
              params.sortType == OrderProduct.REPORT_TYPE_QUANTITY_WISE
            ) {
              locationName.push(storesLists[i].date);
              storeAmount.push(storesLists[i].totalCount);
              setStoreList(locationName);
              setTotalAmount(storeAmount);
            }

            if (params.sortType == OrderProduct.REPORT_TYPE_QUANTITY_WISE) {
              total = graphData.totalCount;
              average = graphData.average;
              setAverage(average);
              setTotal(total);
            } else {
              total = graphData.totalAmount;
              average = graphData.average;
              setAverage(average);
              setTotal(total);
            }
            if (graphData.totalCount == 0 || graphData.totalAmount == 0) {
              setAverage();
              setTotal();
            }
          }
          setIsLoading(false);
        }
      }
    }
    if (locationName && locationName.length > 0) return locationName;
    if (storeAmount) return storeAmount;
  };

  const generateChartHTML = (data, params) => `
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
  <style>
    body, html {
      height: 100%;
      margin: 0;
      padding: 0;
    }
    #header {
      text-align: center;
      font-size: 50px;
    }
    #headerLabel {
      text-align: center;
      font-size: 50px;
      padding-top: 50px;
      padding-bottom: 50px;
    }
    #chart-container {
      height: 80vh;
      max-width: 1000px;
      width: 100%;
      background: #ffffff; /* Use a valid color value */
    }
    #chart {
      width: 100%; /* Use the entire width of the container */
      height: 100%;
    }
    #chart-info {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 10px;
    }
    #chart-header {
      text-align: center;
    }
  </style>
</head>
<body>
  <div id="headerLabel">
    ${
      data.total > 0 && params.sortType !== OrderProduct.REPORT_TYPE_QUANTITY_WISE
        ? `<div>Total: ${Currency.getFormatted(
            data.total
          )} (Average: ${Currency.getFormatted(data.average)})</div>`
        : ""
    }
    ${
      data.total > 0 && params.sortType === OrderProduct.REPORT_TYPE_QUANTITY_WISE
        ? `<div>Total Order: ${data.total} (Average: ${Math.round(
            data.average
          )})</div>`
        : ""
    }
  </div>
  <div id="chart-container" style="overflow-x: scroll; ">
    <div id="chart" style="min-width: 100%; width: ${
      data.storeList.length * 60
    }px;">
      <script type="text/javascript">
        let chartData = ${JSON.stringify(data.storeList)};
        let chart = echarts.init(document.getElementById("chart"));
        let option = {
          backgroundColor: "#f5f5f5",  
          grid: {
            bottom: 250, // Adjust this value to control the padding at the bottom
          },
          xAxis: {
            type: "category",
            data: chartData.map(item => ({
              value: item,
              textStyle: {
                fontSize: 20,
              },
            })),
            axisLabel: {
              interval: 0,
              rotate: 45,
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              textStyle: {
                fontSize: 24,
              },
              formatter: function (value) {
                if (${
                  params.sortType !== OrderProduct.REPORT_TYPE_QUANTITY_WISE
                }) {
                  return formatCurrency(value);
                } else {
                  return value;
                }
              },
            },
            
          },
          dataZoom: [{ type: "inside", start: 0, end: 25 }],
          series: [
            {
              type: "bar",
              barWidth: "50%",
              data: ${JSON.stringify(data.totalAmount)},
              itemStyle: {
                color: function(params) {
                  return getRandomColor();
                },
              },
              label: {
                show: true,
                position: "top",
                formatter: function(params) {
                  if (${
                    params.sortType !== OrderProduct.REPORT_TYPE_QUANTITY_WISE
                  }) {
                    return formatCurrency(params.value);
                  } else {
                    return params.value; // Display the value of the bar
                  }
                },
                textStyle: {
                  fontSize: 24,
                },
              },
            },
          ],
        };
        chart.setOption(option);
  
        function getRandomColor() {
          let letters = "0123456789ABCDEF";
          let color = "#";
          for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        }
        function formatCurrency(value) {
          const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
          });
          let formattedValue = formatter.format(value);
          formattedValue = formattedValue.replace(/\u00A0/g, '');
          return formattedValue;
        }
      </script>
    </div>
  </div>

</body>
</html>
`;

  const data = {
    storeList: storeList,
    totalAmount: totalAmount,
    total: Math.round(total),
    average: Math.round(average)
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <View style={{ flex: 1 }}>
    {total && total >0?(
      <WebView
        originWhitelist={["*"]}
        source={{ html: generateChartHTML(data, params) }}
        bounces={false}
      />
      ):(
        <NoRecordFound iconName="receipt" styles={{ paddingVertical: 250, alignItems: "center" }} />
      )
      }
    </View>
  );
};

export default OrderReportChart;
