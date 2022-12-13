package com.WooJoo09.service;

import com.WooJoo09.constant.IsRead;
import com.WooJoo09.constant.MsgType;
import com.WooJoo09.entity.Chat;
import com.WooJoo09.entity.Member;
import com.WooJoo09.entity.Partner;
import com.WooJoo09.entity.Trade;
import com.WooJoo09.repository.ChatRepository;
import com.WooJoo09.repository.MemberRepository;
import com.WooJoo09.repository.PartnerRepository;
import com.WooJoo09.webSocket.ChatRoom;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;

@Slf4j
@ToString
@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final PartnerRepository partnerRepository;
    private final MemberRepository memberRepository;

    private final ObjectMapper objectMapper;
    private Map<String, ChatRoom> chatRooms; // key 와 value, 개설된 방의정보를 가지고 옴

    @PostConstruct // 의존성 주입 이후 초기화를 수행하는 메소드
    private void init() {
        chatRooms = new LinkedHashMap<>();
    }
    public List<ChatRoom> findAllRoom() {
        return new ArrayList<>(chatRooms.values());
    }
    public ChatRoom findRoomById(String roomId) {
        return chatRooms.get(roomId);
    }

    // 방을 만들기
    public ChatRoom createRoom(String name) {
        String randomId = UUID.randomUUID().toString();
        log.info("UUID : " + randomId);
        ChatRoom chatRoom = ChatRoom.builder()
                .roomId(randomId)
                .name(name)
                .build();
        chatRooms.put(randomId, chatRoom);
        return chatRoom;
    }

    // 제네릭 타입 T
    public <T> void sendMessage(WebSocketSession session, T message) {
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
        } catch(IOException e) {
            log.error(e.getMessage(), e);
        }
    }

    public Map<?,?> chatReadCheck(int memberNum) {
        Map<String, String> result = new HashMap<>();
        result.put("countUnreadChat", chatRepository.chatReadCheck(memberNum));
        result.put("state", "login");
        return result;
    }

// ㅠㅠ 삽질...
//    public Map<String,String> chatInsert(Long partnerNum, Long memberNum){
//        Map<String, String> map = new HashMap<>();
//        Partner partner = partnerRepository.findByPartnerNum(partnerNum);
//        if(partner == null) {
//            map.put("completePartner", "notPartnerData");
//            return map;
//        }
//        Member member = memberRepository.findByMemberNum(memberNum);
//        if(member == null) {
//            map.put("completePartner", "notMemberData");
//            return map;
//        }
//        if(chatRepository.findByPartnerNum(partner).isEmpty()){
//            Chat chat = new Chat();
//            chat.setSender(member);
//            chat.setPartnerNum(partner);
//            chat.setChatContent("채팅방이 개설되었습니다");
//            chat.setMsgType(MsgType.ENTER);
//            chat.setIsRead(IsRead.UNREAD);
//            Chat savedChat = chatRepository.save(chat);
//            log.info(savedChat.toString());
//            map.put("completePartner", "OK");
//        } else map.put("completePartner", "duplicate");
//        return map;
//    }

    public List<?> chatList(int memberNum){
        List<Map<?,?>> result = new ArrayList<>();
        Map<String, List<Map<?,?>>> map = new HashMap<>();
        map.put("chatListContent", chatRepository.chatList(memberNum));
        System.out.print(map);
        for(int i = 0; i < map.size(); i++){
            result.add(map);
        }
        return result;
    }

}