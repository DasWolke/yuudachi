const idRegex = /[0-9]{17,19}/;
const numberRegex = /^-?[0-9]+[.,]?[0-9]*$/;
function uppercaseFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function removeServerMention(string) {
    return string.replace(/@everyone/g, '@\u200beveryone').replace(/@here/g, '@\u200bhere');
}

module.exports = {idRegex, uppercaseFirstChar, removeServerMention, numberRegex};
