package pt.uc.dei.proj5.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class ConversationDto {
    //Atributes
    private List<MessageDto> messages;

    public ConversationDto(List<MessageDto> messages) {
        this.messages = messages;
    }

    public List<MessageDto> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageDto> messages) {
        this.messages = messages;
    }
}
