//`fileselect` event to all file inputs on the page
$(document).on('change', ':file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');

    input.trigger('fileselect', [numFiles, label]);
});

$(document).ready(function () {


// Give treat button
// Updates the treats column in the database
$(".treat-btn").on("click", function() {
    var id = $(this).data("treatid");
        // console.log("id ", id);
    var currentTreats = $(this).data("treats");
        // console.log("currentTreats ", currentTreats);
    var addedTreats = (currentTreats + 1);
        // console.log("addedTreats ", addedTreats);

    var updatedTreats = {
        treats: addedTreats
        };

        $.ajax("/api/dogs/" + id, {
            type: "PUT",
            data: updatedTreats
        }).then(function() {
            console.log("updated id ", id);
            location.reload();
        });
    });


$("#filter-dogs").hide();
$(".show-all-btn").hide();

$(".filter-btn").on("click", function() {
    $("#filter-dogs").toggle();
    $(".show-all-btn").toggle();
});

// Filter-breed logic
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function url() { 
    var urlLoc = window.location.pathname;
    urlLoc = urlLoc.replace(window.location.hostname, "");

    urlLoc = urlLoc.replace("/finddog/", "");
    urlLoc = urlLoc.replaceAll("%20", " ");

    var checkedArray = urlLoc.split("+");

    $.each($("form[name=filter-dogs] input:checkbox"), function () {
        console.log( checkedArray.indexOf(this.value) );
        if ( checkedArray.indexOf(this.value) >= 0 ) {
            $(':checkbox[value="' + this.value + '"]').attr('checked', true);
        }
        $("#filter-dogs").show();
        $(".show-all-btn").show();
    });
    }
    url();


    $(".dog-filter-btn").on("click", function() {

    var allCheckedDogs = [];
    var formData = $("#filter-dogs").serializeArray();
    console.log(formData);

    for (var i = 0; i < formData.length; i++) {
        allCheckedDogs.push(formData[i].value);
    }

    var allDogs = {
        breed: allCheckedDogs
    }

      var stringBreed = allCheckedDogs.join("+");
        window.location = "/finddog/" + stringBreed;

});


    $(".show-all-btn").on("click", function() {
            $(':checkbox').attr('checked', false);
            var allCheckedDogs = [];

            var allDogs = {
                breed: allCheckedDogs
            }
            var stringBreed = allCheckedDogs.join("+");
            window.location = "/finddog/" + stringBreed;

    });


        // RAY 
    $("#dog-preview-container").hide();

    // Watch for custom `fileselect` event
    $(':file').on('fileselect', function(event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }
    });

    $("#upload-image").on("click", function() {
        $(".success-message").html("Image uploaded successfully!");
        //add an image to the success area
        //add a hidden input element to contain the filepath to the uploaded image
        //style the image to bs4
    });

    //Create a Profile - upload an image
    $("#upload-image").on("click", function (event) {
        event.preventDefault();

        $.ajax({
            // Your server script to process the upload
            url: '/api/photo',
            type: 'POST',
    
            // Form data
            data: new FormData($("#uploadForm")[0]),
    
            // Tell jQuery not to process data or worry about content-type
            // You *must* include these options!
            cache: false,
            contentType: false,
            processData: false,
    
            // Custom XMLHttpRequest
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    // For handling the progress of the upload
                    myXhr.upload.addEventListener('progress', function(e) {
                        if (e.lengthComputable) {
                            $('progress').attr({
                                value: e.loaded,
                                max: e.total,
                            });
                        }
                    } , false);
                }
                return myXhr;
            },
        }).then(function (result) {
            $("#imagepath").val(result);
            $("#dog-preview").attr("src", "/uploads/" + result);
            $("#dog-preview-container").show();
        });
    });
    
    //Create a profile - submit questionaire
    $("#dog-profile").on("submit", function (event) {
        event.preventDefault();
        var questionaireAnswers = {};
        var formData = $("#dog-profile").serializeArray();

        for (var i=0; i < formData.length; i++) {
            questionaireAnswers[formData[i].name] = formData[i].value;
        }
        
        $.ajax({
            url: "/api/new", 
            method: "POST",
            data: questionaireAnswers
        }).then(function (result) {
            window.location = "/newprofile/" + result.id;
        });
    });

    //New Profile - delete
   $(document).on("click", "#btn-delete-dog", function (result) {
        var id = $(this).attr("data-id");
        $.ajax({
            url: "/api/deletedog/" + id,
            type: "DELETE"
        }).then(function() {
            console.log("deleted dog", id);
            // Reload the page to get the updated list
            window.location = "/finddog";
        });
    });

    //Get Matched
    $("#dog-survey").on("submit", function (event) {
        event.preventDefault();
        var surveyAnswers = {};
        var formData = $("#dog-survey").serializeArray();

        for (var i=0; i < formData.length; i++) {
            surveyAnswers[formData[i].name] = formData[i].value;
        }
        console.log(surveyAnswers);

        $.ajax({
            url: "/api/newsurvey", 
            method: "POST",
            data: surveyAnswers
        }).then(function (result) {
            console.log(result);
            window.location = "/match/" + result.id;
        });        
    });

});