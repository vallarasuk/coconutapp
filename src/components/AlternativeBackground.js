import React from "react";
import styles from "../helper/Styles";
class AlternativeColor {

    static getBackgroundColor(index, plainText) {
        let Styles
        if(plainText){
            Styles = index % 2 === 0 ? styles.plainWhite : styles.alternativeColorBackgroud;
        }else{
            Styles = index % 2 === 0 ? styles.containerWhite : styles.containerGrey;
        }
        return Styles;
    }

}
export default AlternativeColor;

