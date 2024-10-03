export const PaymentType = {
  CASH: "Cash",
  UPI: "Upi",
  MIXED: "Mixed",

  INITIAL: 4,
  VALIDATION: 5,

  CASH_VALUE: 1,
  UPI_VALUE: 2,
  MIXED_VALUE: 3
};

export const PaymentTypeOptions = [
  {
    label: PaymentType.CASH,
    value: PaymentType.CASH_VALUE
  },
  {
    label: PaymentType.UPI,
    value: PaymentType.UPI_VALUE
  },
  {
    label: PaymentType.MIXED,
    value: PaymentType.MIXED_VALUE
  }
];


