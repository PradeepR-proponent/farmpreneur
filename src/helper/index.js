import moment from 'moment';

const capitalize = (str=null) =>{
    if(str)
        return str[0].toUpperCase()+str.slice(1,str.length);
    else
        return "";
}

const formatDate = (date) =>{
    let newDate = new Date(date);
    return moment(newDate).format('DD MMMM YYYY');
}

export {capitalize,formatDate}