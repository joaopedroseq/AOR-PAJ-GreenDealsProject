package pt.uc.dei.proj5.service;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import pt.uc.dei.proj5.initializer.EmailConfig;

import java.util.Properties;

public class EmailService {
    private String emailAccount = System.getenv("EMAIL_ACCOUNT");
    private String password = System.getenv("EMAIL_PASSWORD");
    private final String template = "<h1>Welcome {{recipientName}}.</h1>" +
            "<p>Now all you have to do is click the link below to activate your account.</p><br>" +
            "<a href='https://localhost:3000/activate?token={{token}}'>Activate Account</a>";

    public void sendActivationEmail(String recipient, String recipientEmail, String activationToken) {
        Properties properties = EmailConfig.getSMTPProperties();
        System.out.println(emailAccount);
        System.out.println(password);

        Session session = Session.getInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(emailAccount, password);
            }
        });
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(emailAccount));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientEmail));
            message.setSubject("GreenDeals - Activation link");
            String messageBody = template.replace("{{recipientName}}", recipient).replace("{{token}}", activationToken);
            message.setContent(messageBody, "text/html");
            Transport.send(message);
            System.out.println("Activation email sent successfully!");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}