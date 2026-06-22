<?php
header('Content-Type: application/json');

// Config DB - À REMPLACER AVEC VOS IDENTIFIANTS
$servername = "localhost";
$username = "votre_utilisateur";
$password = "votre_motdepasse";
$dbname = "nom_db";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Récupération des données
    $data = json_decode(file_get_contents('php://input'), true);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $nom = filter_var($data['nom'], FILTER_SANITIZE_STRING);
    $sujet = filter_var($data['sujet'], FILTER_SANITIZE_STRING);
    $message = filter_var($data['message'], FILTER_SANITIZE_STRING);

    // Insertion en DB
    $stmt = $conn->prepare("INSERT INTO demandes_contact (email, nom, sujet, message) VALUES (:email, :nom, :sujet, :message)");
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':nom', $nom);
    $stmt->bindParam(':sujet', $sujet);
    $stmt->bindParam(':message', $message);
    $stmt->execute();

    // Envoi email de confirmation
    $to = $email;
    $subject = "Confirmation de votre message: " . $sujet;
    $message = "Bonjour " . $nom . ",\n\n";
    $message .= "Nous accusons réception de votre message concernant: " . $sujet . ".\n";
    $message .= "Nous vous répondrons dans les plus brefs délais.\n\n";
    $message .= "Cordialement,\nEphraim Jeriel";
    $headers = "From: no-reply@votredomaine.com";

    mail($to, $subject, $message, $headers);

    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès']);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
}
?>