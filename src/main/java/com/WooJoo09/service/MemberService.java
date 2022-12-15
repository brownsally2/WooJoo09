package com.WooJoo09.service;

import com.WooJoo09.constant.ReceiveAd;
import com.WooJoo09.dto.MemberDTO;
import com.WooJoo09.entity.Member;
import com.WooJoo09.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import javax.transaction.Transactional;
import java.util.*;

@Slf4j
@ToString
@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;

    public List<Member> findMember() {
        return memberRepository.findAll();
    }

    public Member saveMember(Member member) {
        return memberRepository.save(member);
    }

    //회원가입
    public boolean regMember(String id, String pwd, String nickname,
                             String realName, String email, Date birthDate, String phone, String receiveAd) {
        Member member = new Member();
        member.setId(id);
        member.setPwd(pwd);
        member.setNickname(nickname);
        member.setRealName(realName);
        member.setEmail(email);
        member.setBirthDate(birthDate);
        member.setPhone(phone);
        member.setReceiveAd(ReceiveAd.valueOf(receiveAd));
        Member rst = memberRepository.save(member);
        log.warn(rst.toString());
        return true;
    }

    //아이디 중복확인
    public boolean regIdDupCk(String id) {
//        Optional<Member> member = memberRepository.findById(id);
//        if(memberRepository.findById(id).isEmpty()) return true;
//        else return false;
        return memberRepository.findById(id).isEmpty();
    }

    //닉네임 중복확인
    public boolean regNickDupCk(String nickname) {
        return memberRepository.findByNickname(nickname).isEmpty();
    }

    //아이디 찾기
    public boolean findId(String realName, String email) {
//        List<Member> memberList = memberRepository.findByRealNameAndEmail(realName, email);
//        for(Member e : memberList) {
//            return true;
//        }
//        return false;
        return !memberRepository.findByRealNameAndEmail(realName, email).isEmpty();
    }

    //이메일로 회원정보 받아오기
    public List<MemberDTO> getMemberList(String email) {
        List<MemberDTO> memberDTOS = new ArrayList<>();
        List<Member> memberList = memberRepository.findByEmail(email);
        for(Member e : memberList) {
            MemberDTO memberDTO = new MemberDTO();
            memberDTO.setId(e.getId());
            memberDTO.setRealName(e.getRealName());
            memberDTO.setNickname(e.getNickname());
            memberDTO.setEmail(e.getEmail());
            memberDTO.setBirthDate(e.getBirthDate());
            memberDTO.setPhone(e.getPhone());

            memberDTOS.add(memberDTO);
        }
        return memberDTOS;
    }

    //비밀번호 찾기
    public boolean findPwd(String realName, String email) {
        return !memberRepository.findByRealNameAndEmail(realName, email).isEmpty();
    }

    //전화번호 중복체크
    public boolean getPhoneVer(String phone) {
        return memberRepository.findByPhone(phone).isEmpty();
    }
}