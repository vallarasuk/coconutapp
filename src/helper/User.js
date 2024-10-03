class User {
    static getFullName(user) {
        let concatedName;
        if (user.first_name && user.last_name) {
            concatedName = user.first_name + " " + user.last_name;
        } else if (user.first_name) {
            concatedName = user.first_name;
        } else if (user.last_name) {
            concatedName = user.last_name;
        }
        return concatedName;
    };

   static STATUS_DEACTIVATE = 3;
   static FORCE_LOGOUT_ENABLE = 2;

}
export default User