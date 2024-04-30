<?php
// Only run this script if there's a POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Assign form data to variables
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'] ?? 'Not provided'; // Optional field
    $website = $_POST['website'] ?? 'Not provided'; // Optional field
    $message = $_POST['message'];

    // Prepare the email details
    $to = 'z1ad.taha@hotmail.com'; // The email address where you want to receive mails
    $subject = 'New Contact Form Submission';
    $body = "You have received a new message from your website contact form.\n\n".
            "Here are the details:\n".
            "Name: $name\n".
            "Email: $email\n".
            "Phone: $phone\n".
            "Website: $website\n".
            "Message: $message";
    $headers = "From: $email\n";
    $headers .= "Reply-To: $email";

    // Send the email
    if (mail($to, $subject, $body, $headers)) {
        echo 'Thank you for your message. We will contact you soon.';
    } else {
        echo 'Sorry, there was an error sending your message. Please try again later.';
    }
} else {
    // Not a POST request, display a simple error message
    echo 'This page should not be accessed directly.';
}
?>
