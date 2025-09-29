"use client";

import MyButton from "./Button";

export default function ButtonTest(){
    return(
        <>
            {/* 기본 버튼 - buttonPrimary */}
            <MyButton onClick={() => alert("로그인 클릭!")} className="py-[11px] px-[138.5px]">로그인 하기</MyButton><br /><br />
            {/* buttonSecondary */}
            <MyButton color="buttonSecondary" onClick={() => alert("")} className="py-[7px] px-[22px]">로그인 하기</MyButton><br /><br />
            {/* disabled button */}
            <MyButton onClick={() => {}} className="py-[7px] px-[22px]" disabled>신청 불가</MyButton><br /><br />

            {/* buttonCategory */}
            <ul>
                <MyButton color="buttonCategoryActive" onClick={() => alert("문화예술")} className="mr-[24px] w-[127px] h-[58px]">문화예술</MyButton>
                <MyButton color="buttonCategory" onClick={() => alert("문화예술")} className="mr-[24px] w-[127px] h-[58px]">식음료</MyButton>
                <MyButton color="buttonCategory" onClick={() => alert("문화예술")} className="mr-[24px] w-[127px] h-[58px]">스포츠</MyButton>
                <MyButton color="buttonCategory" onClick={() => alert("문화예술")} className="mr-[24px] w-[127px] h-[58px]">투어</MyButton>
                <MyButton color="buttonCategory" onClick={() => alert("문화예술")} className="w-[127px] h-[58px]">관광</MyButton>
            </ul>
        </>
    )
}