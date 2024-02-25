<?php
// Replace these values with your actual database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "portfolio";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Initialize a variable to track success
$success = false;

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];
    
    // Prepare SQL statement
    $sql = "INSERT INTO contact_form (name, email, subject, message) VALUES ('$name', '$email', '$subject', '$message')";
    
    // Execute SQL statement
    if ($conn->query($sql) === TRUE) {
        $success = true; // Set success flag to true
    }
}

// Display appropriate message
if ($success) {
    echo "Your message has been sent. Thank you!"; // Display success message
} else {
    echo "Error: Unable to send message."; // Display error message
}

// Close connection
$conn->close();
?>
