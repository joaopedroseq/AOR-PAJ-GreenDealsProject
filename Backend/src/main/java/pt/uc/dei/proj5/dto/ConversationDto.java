package pt.uc.dei.proj5.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class ConversationDto {
    //Atributes
    private Set<MessageDto> messages;

    public ConversationDto(Set<MessageDto> messages) {
        this.messages = messages;
    }

    public Set<MessageDto> getMessages() {
        return messages;
    }

    public void setMessages(Set<MessageDto> messages) {
        this.messages = messages;
    }
}
