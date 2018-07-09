export default function formatDate(formatString, date){
  var YYYY, MM, DD, hhhh, mm;
  YYYY = date.getFullYear()
  MM = date.getMonth() + 1 < 10 ? (`0` + (date.getMonth() + 1)) : date.getMonth + 1;
  DD = date.getDate() < 10 ? (`0` + date.getDate()) : date.getDate();
  formatString = formatString.replace("#YYYY#", YYYY).replace("#MM#", MM).replace("#DD#", DD);
  hhhh = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
  mm = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
  return formatString.replace("#hhhh#", hhhh).replace("#mm#", mm);
}