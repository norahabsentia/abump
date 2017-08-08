(function() {
    var socket = io.connect('https://45.76.150.25:443');
    document.getElementById("loader").style.display = "none";

    document.getElementById("uploadFile").onchange = function() {
        document.getElementById("uploadForm").submit();
        document.getElementById("loader").style.display = "";
    };

    function showPage() {
        document.getElementById("loader").style.display = "none";
        console.log("inside showPage")
            // document.getElementById("container").style.display = "none";

    }
    socket.on('file-ready', function(data) {
        showPage();
        console.log("inside file-ready")
    });


})();