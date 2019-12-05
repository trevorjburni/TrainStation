// Create our firebase config
var firebaseConfig = {
    apiKey: "AIzaSyBrmy9qvD6evSEYi6w_Esdm2C5Kppv6cf8",
    authDomain: "train-departures-a6ed4.firebaseapp.com",
    databaseURL: "https://train-departures-a6ed4.firebaseio.com",
    projectId: "train-departures-a6ed4",
    storageBucket: "train-departures-a6ed4.appspot.com",
    messagingSenderId: "428613739560",
    appId: "1:428613739560:web:42ef56519d6e3a3c14c11d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create variables
var database = firebase.database();

var name = "";
var destination = "";
var frequency = "";
var startTime = "";
var nextArrival = "";
var minutesAway = "";

// When a child is added to the database, update the train schedule
database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val().name);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().frequency);
    console.log(snapshot.val().startTime);

    var startTimeConverted = moment(snapshot.val().startTime, "HH:mm").subtract(1, "years");
    console.log(startTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffInTime = moment().diff(moment(startTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffInTime);

    // Time apart (remainder)
    var tRemainder = diffInTime % snapshot.val().frequency;
    console.log(tRemainder);

    // Minute Until Train
    minutesAway = snapshot.val().frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next Train
    nextArrival = moment().add(minutesAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));

    nextArrival = moment(nextArrival).format("LT");
    console.log(nextArrival);

    // Build the table
    var tr = $("<tr>");
    var tdName = $("<td>").text(snapshot.val().name);
    var tdDestination = $("<td>").text(snapshot.val().destination);
    var tdFrequency = $("<td>").text(snapshot.val().frequency);
    var tdNextArrival = $("<td>").text(nextArrival);
    var tdMinutesAway = $("<td>").text(minutesAway);
    tr.append(tdName, tdDestination, tdFrequency, tdNextArrival, tdMinutesAway);
    // Place the newly created table row in the tbody
    $("tbody").append(tr);

})


// Button listener, when the submit button is clicked, the information in the form will be added to the database.
$("#addTrain").on("click", function () {

    // Update references to what is filled out in the form.
    name = $("#ee-name").val().trim();
    destination = $("#ee-destination").val().trim();
    startTime = $("#start-time").val().trim();
    frequency = $("#ee-frequency").val().trim();

    // Push new data to the database
    database.ref().push({

        name: name,
        destination: destination,
        startTime: startTime,
        frequency: frequency
    })
});