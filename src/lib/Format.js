import Number from "./Number";

function getFullName(firstName, lastName) {
	if (Number.isNotNull(firstName) && Number.isNotNull(lastName)) {
		return `${firstName} ${lastName}`;
	} else if (Number.isNotNull(firstName)) {
		return firstName;
	} else if (Number.isNotNull(lastName) ) {
		return lastName;
	}
}

function formatMobileNumber(value) {
	const formattedValue = value.replace(/\D/g, '');
	let formatMobileNumber = '';
	if (formattedValue.length > 0) {
		formatMobileNumber = '(' + formattedValue.slice(0, 3);
	}
	if (formattedValue.length > 3) {
		formatMobileNumber += ') ' + formattedValue.slice(3, 6);
	}
	if (formattedValue.length > 6) {
		formatMobileNumber += '-' + formattedValue.slice(6, 10);
	}

	return formatMobileNumber;
};


export {
	getFullName,
	formatMobileNumber
};
