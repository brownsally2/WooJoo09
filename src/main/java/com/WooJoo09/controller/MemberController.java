package com.WooJoo09.controller;

import com.WooJoo09.dto.MemberDTO;
import com.WooJoo09.entity.Member;
import com.WooJoo09.service.EmailService;
import com.WooJoo09.service.MemberService;
import com.WooJoo09.service.sens_sms;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@Slf4j
@RequestMapping(value="/developerkirby")
public class MemberController {

    // Service 로직 연결
    private MemberService memberService;
    private final EmailService emailService;

    public MemberController(MemberService memberService, EmailService emailService) {
        this.memberService = memberService;
        this.emailService = emailService;
    }

    public ResponseEntity<List<Member>> findMember() {
        return ResponseEntity.ok().body(memberService.findMember());
    }

    //회원가입
    @PostMapping("/memberinsert")
    public ResponseEntity<Boolean> registerMember(@RequestBody Map<String, String> regData) throws ParseException {
        String id = regData.get("regId");
        String pwd = regData.get("regPwd");
        String nickname = regData.get("regNick");
        String realName = regData.get("regName");
        String email = regData.get("regEmail");
        SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd");
        Date birthDate = date.parse(regData.get("birthDate"));
        String phone = regData.get("regPhone");
        String receiveAd = regData.get("adOk");
        boolean result = memberService.regMember(id, pwd, nickname, realName, email, birthDate, phone, receiveAd);
        if (result) {
            return new ResponseEntity(true, HttpStatus.OK);
        } else {
            return new ResponseEntity(false, HttpStatus.OK);
        }
    }

    //가입 후 소개 이메일 전송
    @PostMapping("/sendcelmail")
    @ResponseBody
    public String mailConfirm(@RequestBody Map<String, String> regEmailSend) throws Exception {
        String email = regEmailSend.get("regEmail");
        String code = emailService.sendSimpleMessage(email);
        log.info("인증코드 : " + code);
        return code;
    }

    //아이디 중복 체크
    @PostMapping("/iddup")
    public ResponseEntity<Boolean> memberIdDup(@RequestBody Map<String, String> idDupData) {
        String id = idDupData.get("regId");
        return ResponseEntity.ok(memberService.regIdDupCk(id));
//        boolean result = memberService.regIdDupCk(id);
//        if(result) {
//            return new ResponseEntity<>(true, HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(false, HttpStatus.OK);
//        }
    }

    //닉네임 중복 체크
    @PostMapping("/nickdup")
    public ResponseEntity<Boolean> memberNickDup(@RequestBody Map<String, String> nickDupData) {
        String nickname = nickDupData.get("regNick");
        return ResponseEntity.ok(memberService.regNickDupCk(nickname));
    }

    //아이디 찾기
    @PostMapping("/findid")
    public ResponseEntity<Boolean> memberFindId(@RequestBody Map<String, String> findIdData) {
        String realName = findIdData.get("findIdName");
        String email = findIdData.get("findIdEmail");
        return ResponseEntity.ok(memberService.findId(realName, email));
//        boolean result = memberService.findId(realName, email);
//        if (result) {
//            return new ResponseEntity<>(true, HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(false, HttpStatus.OK);
//        }
    }

    //이메일로 회원정보 받아오기
    @PostMapping("/findidmember")
    public ResponseEntity<List<MemberDTO>> findIdMember(@RequestBody Map<String, String> findIdDataEmail) {
        String email = findIdDataEmail.get("findIdEmail");
        List<MemberDTO> list = memberService.getMemberList(email);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    //비밀번호 찾기
    @PostMapping("/findpwd")
    public ResponseEntity<Boolean> memberFindPwd(@RequestBody Map<String, String> findPwdData) {
        String id = findPwdData.get("findPwdId");
        String email = findPwdData.get("findPwdEmail");
        return ResponseEntity.ok(memberService.findPwd(id, email));
    }

    //이메일 인증번호 전송
    @PostMapping("/findpwdverify")
    @ResponseBody
    public String findPwdVerify(@RequestBody Map<String, String> findPwdEmail) throws Exception {
        String email = findPwdEmail.get("findPwdEmail");
        String code = emailService.sendSimpleMessage(email);
        log.info("인증코드 : " + code);
        return code;
    }

    //비밀번호 재설정
    @PostMapping("/resetpwd")
    @ResponseBody
    public ResponseEntity<Boolean> resetPwd(@RequestBody Map<String, String> resetPwdData) {
        String id = resetPwdData.get("findPwdId");
        String newPwd = resetPwdData.get("resetPwd");
//        boolean getId = memberService.memberIdService(id, newPwd);
        return ResponseEntity.ok(memberService.memberIdService(id, newPwd));



    }

    //휴대폰번호 인증
    @PostMapping("/phoneverify")
    public ResponseEntity<Map<String, String>> memberPhoneVerify(@RequestBody Map<String, String> phoneVerData) {
        String getPhone = phoneVerData.get("regPhone");
        boolean isPhoneVer = memberService.getPhoneVer(getPhone);

        System.out.println("문자 보낼 수 있음?(중복아님?)" + isPhoneVer);

        Map<String, String> map = new HashMap<>();

        if (isPhoneVer) {
            int verifyCode = sens_sms.makeVerifyCode();
            map.put("result", "OK");
            map.put("code", String.valueOf(verifyCode));
            System.out.println("인증번호 " + verifyCode);

            String match = "[^0-9]";
            getPhone = getPhone.replaceAll(match, "");
            boolean isSend = sens_sms.sendSms(getPhone, verifyCode);

            if (isSend) {
                map.put("result", "OK");
                map.put("code", String.valueOf(verifyCode));
                System.out.println("인증번호 " + verifyCode);
            } else {
                map.put("result", "NOK");
            }
        } else {
            map.put("result", "DUP");
        }
        return new ResponseEntity<>(map, HttpStatus.OK);
    }

}