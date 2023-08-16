const statusMapping = {
    1: "loodud",
    2: "saadetud",
    3: "kinnitatud",
    4: "tagasi lükatud",
    5: "saadud tagasiside",
    6: "arve tehtud",
    7: "tühistatud"
};

const getDocStatusText = (status) => {
    return statusMapping[status] || 'Teadmata staatus';
};

module.exports = getDocStatusText;
