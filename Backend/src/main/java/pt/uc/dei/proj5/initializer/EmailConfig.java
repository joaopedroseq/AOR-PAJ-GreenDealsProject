package pt.uc.dei.proj5.initializer;

import java.util.Properties;

public class EmailConfig {

    public static Properties getSMTPProperties() {
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");
        return properties;
    }
}