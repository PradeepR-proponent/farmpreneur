import { Hindi_language } from './Hindi'
import { Eng_language } from './English'
import appConstant from "../config/constants";


export const translate = (appLanguage, key) => {
    if (Eng_language[key] === undefined) return key
    if (Hindi_language[key] === undefined) return key
    if (appLanguage === appConstant.Languages[0]) {
        return Eng_language[key]
    } else if (appLanguage === appConstant.Languages[1]) {
        return Hindi_language[key]
    }
}



export const translateAPI = (appLanguage, key1, key2) => {
    if (appLanguage === appConstant.Languages[0]) {
        return key1
    } else if (appLanguage === appConstant.Languages[1]) {
        return key2
    }
}
