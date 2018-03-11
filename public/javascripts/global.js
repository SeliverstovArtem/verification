// Userlist data array for filling in info box
var thingListData = [];

// DOM Ready =============================================================
setInterval(function() {
    $(document).ready(function () {

        // Populate the user table on initial page load
        populateTable();

    });
}, 1000);

// Add Thing button click
$('#btnAddThing').on('click', addThing);
// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/things/thinglist', function( data ) {

        // Stick our user data array into a thinglist variable in the global object
        thingListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.price + '</td>';
            tableContent += '<td>';
            tableContent += '<form method="post", action="/thing/:id/delete"><input name="_id" type="hidden" value="' + this._id + '"/>';
            tableContent += '<input id="delete", value="Удалить", type="submit",  class="btn btn-danger"/>';
            tableContent += '</form>';
            tableContent += '<form method="get", action="/thing/:id/edit"><input name="_id" type="hidden" value="' + this._id + '"/>';
            tableContent += '<input id="edit", value="Обновить", type="submit",  class="btn btn-success"/>';
            tableContent += '</form>';
            tableContent += '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#thingList table tbody').html(tableContent);
    });
};


// Add Thing
function addThing(event) {
    //event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addThing input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newThing = {
            'name': $('#addThing fieldset input#inputThingName').val(),
            'price': $('#addThing fieldset input#inputThingPrice').val()
        }

        // Use AJAX to post the object to our addthing service
        $.ajax({
            type: 'POST',
            data: newThing,
            url: '/things/addthing',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addThing fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Не все поля заполнены');
        return false;
    }


};
