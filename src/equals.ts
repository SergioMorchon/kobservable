const equals = (v1, v2) =>
    Number.isNaN(v1) && Number.isNaN(v2)
    ? true
    : v1 === v2;

export default equals;