package com.WooJoo09.repository;

import com.WooJoo09.entity.Chat;
import com.WooJoo09.entity.Partner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    @Query(
            value = "select count(*) countUnreadChat from chat " +
                    "where (partner_num in (select partner_num from partner p, trade t " +
                    "where (p.trade_num = t.trade_num and host = :memberNum) or part_mem_num = :memberNum)) " +
                    "and sender != :memberNum and is_read = 'UNREAD'",
            nativeQuery = true
    )
    String chatReadCheck(@Param("memberNum") int memberNum);


    List<Chat> findByPartnerNum(Partner partnerNum);

    @Query(
            value = "select m.nickname, m.member_num, pi2.img_url, max(c.chat_time) as chat_time, ANY_VALUE(c.chat_content) chat_content, " +
                    "ANY_VALUE(c.is_read) is_read, p.partner_num  \n" +
                    "from (\n" +
                    "select *\n" +
                    "from chat\n" +
                    "where(partner_num, chat_time) in (select partner_num, max(chat_time) as chat_time\n" +
                    "from chat group by partner_num) \n" +
                    "order by chat_time desc) c,\n" +
                    "partner p, product_img pi2, `member` m, trade t \n" +
                    "where p.partner_num = c.partner_num  and  p.part_mem_num = m.member_num\n" +
                    "and p.trade_num = pi2.trade_num and ((p.trade_num = t.trade_num\n" +
                    "and host = :memberNum) or p.part_mem_num = :memberNum )and pi2.is_represent = \"represent\"\n" +
                    "group by p.partner_num, pi2.img_url",
            nativeQuery = true
    )
    List<Map<?,?>> chatList(@Param("memberNum") int memberNum);

    @Query(
            value = "select chat_content, chat_time, sender from chat where partner_num = :partner_num ;" ,
            nativeQuery = true
    )
    List<Map<?,?>> chatContent (@Param("partner_num") int partnerNum);



}
