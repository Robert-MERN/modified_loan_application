const formatter = (num) => {
    if (!num) return num;
    return Number(num.replace(/,/g, '')).toLocaleString();
}

export default formatter;