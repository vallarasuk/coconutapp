class Validation{

  static isValidEmail = (email) => {
    // Regular expression to match a broader set of email patterns
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
      
      static isValidMobileNumber=(mobileNumber)=> {
        // Regular expression to match mobile number pattern
        const mobileRegex = /^[1-9]{1}[0-9]{9}$/;
        return mobileRegex.test(mobileNumber);
      }
      
      static isValidPassword=(password)=> {
        // Password should be at least 8 characters long
        return password.length >= 8;
      }

      static isEmpty=(value) => {
        return value == undefined ? true : false;
      }
    
      static isNotEmpty = (value) => {
        return !this.isEmpty(value);
      }

}
export default Validation