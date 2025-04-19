package pt.uc.dei.proj5.dto;

import java.util.List;

public class ChatDto {
    //Atributes
    private List<MessageDto> messages;

    public ChatDto(List<MessageDto> messages) {
        this.messages = messages;
    }

    public List<MessageDto> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageDto> messages) {
        this.messages = messages;
    }
}
