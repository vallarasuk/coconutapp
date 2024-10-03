import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Color } from "../../helper/Color";
import * as Print from "expo-print";
import Currency from "../../lib/Currency";
import DateTime from "../../lib/DateTime";

const InvoicePrint = (props) => {
  const { company, orderProduct, totalAmount, totalCgstAmount, totalSgstAmount, params } = props;

  const print = async () => {
    await Print.printAsync({
      html: DynamicTable(),
    });
  };

  const calculateProductAmount = (item) => {
    let Amount = item?.productDetails?.sale_price * item?.quantity;
    return Currency.IndianFormat(Amount);
  };

  const DynamicTable = () => {
    const productRows = orderProduct.map((item, index) => (
      `<tr key=${index}>
        <td class="productColumn">
          <img src="${item.image}" alt="Product Image" class="productImage">
          <span class="productName">${item.productDetails.product_display_name}</span>
        </td>
        <td>${item.quantity}</td>
        <td>${Currency.IndianFormat(item.productDetails?.sale_price)}</td>
        <td>${Currency.IndianFormat(item.cgst_amount)}</td>
        <td>${Currency.IndianFormat(item.sgst_amount)}</td>
        <td>${calculateProductAmount(item)}</td>
      </tr>`
    )).join("");

    const invoiceHtml = `
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
              }

              .container {
                  padding: 20px;
              }

              .title {
                  font-size: 24px;
                  font-weight: bold;
                  text-align: right;
              }

              .title1 {
                  font-size: 24px;
                  font-weight: bold;
                  text-align: left;
              }

              .companyInfo {
                  margin-bottom: 20px;
                  text-align: center;
              }

              .label {
                  font-weight: bold;
              }

              .label1 {
                  font-weight: bold;
              }

              .label2 {
                  font-weight: bold;
                  margin-right: 180px;
              }

              .productRow {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 10px;
                  align-items: center;
              }

              .productColumn {
                  display: flex;
                  align-items: center;
              }

              .column {
                  flex: 1;
              }

              .productName {
                  font-weight: bold;
                  max-width: 100%;
              }

              .productImage {
                  width: 30px;
                  height: 30px;
                  margin-right: 5px;
              }

              .lineRow {
                  border-top: 1px solid #000;
              }

              .thankYouText {
                  margin-top: 20px;
                  font-weight: bold;
                  font-size: 16px;
                  text-align: center;
              }

              .line {
                  border-bottom: 1px solid #000;
                  width: 100%;
                  margin-bottom: 10px;
              }

              .totalAmountText {
                  font-weight: bold;
                  font-size: 18px;
                  margin-top: 10px;
                  text-align: center;
              }

              .company {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 10px;
              }

              .totalAmountText1 {
                  font-weight: bold;
                  font-size: 18px;
                  margin-top: 10px;
                  text-align: center;
              }

              table {
                  width: 100%;
                  border-collapse: collapse;
              }

              th, td {
                  border-bottom: 1px solid #000;
                  padding: 8px;
                  text-align: left;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="company">
                  <div class="title1">${company[0].company_name}</div>
                  <div class="title">Invoice</div>
              </div>

              <div class="line"></div>

              <div class="companyInfo">
                ${company[0].gst_number ? `<p class="label1">GST No: ${company[0].gst_number}</p>` : ''}
                 ${company[0].address1 ? `<p class="label1">${company[0].address1}, ${company[0].address2} (${company[0].pin_code})</p>` : ""}
              </div>

              <div class="company">
                  <div class="title">Invoice: #${params?.order_number}</div>
                  <div class="title">Date: ${DateTime.formatDate(params?.date)}</div>
              </div>

              <div class="line"></div>

              <table>
                  <thead>
                      <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>CGST</th>
                          <th>SGST</th>
                          <th>Amount</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${productRows}
                  </tbody>
              </table>

              <div class="totalAmountText">Total Amount: ${Currency.IndianFormat(totalAmount)}</div>
              <div class="totalAmountText1">Total CGST Amount: ${Currency.IndianFormat(totalCgstAmount)}</div>
              <div class="totalAmountText1">Total SGST Amount: ${Currency.IndianFormat(totalSgstAmount)}</div>

              <div class="thankYouText">Thank you for shopping!</div>
          </div>
      </body>
      </html>
    `;

    return invoiceHtml;
  };

  return (
    <View>
      <TouchableOpacity onPress={print} style={{ padding: 10 }}>
        <Text style={{ color: Color.PRIMARY, fontWeight: '900' }}>PRINT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InvoicePrint;
