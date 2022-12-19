package com.WooJoo09.repository;

import com.WooJoo09.dto.MemberDTO;
import com.WooJoo09.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findByMemberNum(Long MemberNum);
    Optional<Member> findById(String id);
    Optional<Member> findByNickname(String nickname);
    Optional<Member> findByPhone(String phone);
    Member findByIdAndPwd(String id, String pwd);
    //    List<Member> findByRealNameAndEmail(String realName, String email);
    Optional<Member> findByRealNameAndEmail(String realName, String email);
    Optional<Member> findByIdAndEmail(String id, String email);
    List<Member> findByEmail(String email);

    @Query(
            value = "select grade from mem_grade mg, member m \n" +
                    "where ((select count(*) from good g, trade t where good_trade_num = trade_num and host = member_num) -\n" +
                    "(select count(*) from dislike d, trade t where dis_trade_num = trade_num and host = member_num))\n" +
                    "between low_good and high_good and member_num = :memberNum" ,
            nativeQuery = true
    )
    Map<String,String> memberGrade (@Param("memberNum") Long memberNum);


}
