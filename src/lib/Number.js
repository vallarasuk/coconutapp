


class Number {

	static Get(number, defaultValue = null) {
		let formatData = number ? parseInt(number) : defaultValue;
		return formatData;
	}

	static quantityArray() {
		let array = [];
		for (let i = 1; i < 501; i++) {
			array.push({
				name: i,
				value: i,
			});
		}
		return array;
	}

	static GetFloat(number) {
		try {
			if (number) {

				let formatData = parseFloat(number);

				if (formatData) {

					let floatNumber = formatData.toFixed(2);

					return parseFloat(floatNumber);
				}
			}
			return null
		} catch (err) {
			console.log(err);
		}
	}
	static isNotNull(value) {
		if (value && value !== "undefined" && value !== undefined && value !=="" && value !=="null") {
		  return true;
		}
		return false;
	  }

	  static getEmpty (number)  {
        if (number == null || number == undefined) {
          return "";
      }else{
        return number
      }
    }
}

export default Number;