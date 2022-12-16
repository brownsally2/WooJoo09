package com.WooJoo09.webSocket;

import com.fasterxml.jackson.core.JsonParser;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {
    public void configure(JsonParser.Feature allowUnquotedControlChars, boolean b) {
    }

    public enum MessageType {
        ENTER, TALK
    }
    private MessageType type;
    private String roomId;
    private String sender;
    private String message;
}
