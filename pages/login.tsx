import AuthInputBox from '@/components/AuthInputBox/AuthInputBox';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { loginFormValues } from '@/components/AuthInputBox/AuthInputBox.types';
import { loginValidation } from '@/components/AuthInputBox/validation';
import Link from 'next/link';
import InputBox from '@/components/InputBox/InputBox';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormValues>({ mode: 'onBlur' });

  const onSubmit = (data: loginFormValues) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center w-[500px] m-auto pt-[160px] gap-[40px] px-[20px] ">
      {/* 로고 */}
      <Link href="/main">
        <Image width={340} height={192} src="/icon/logo_big.svg" alt="로고" />
      </Link>

      {/* 로그인 폼 */}
      <form
        className="flex flex-col gap-[28px] w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <AuthInputBox
          label="이메일"
          placeholder="이메일을 입력해주세요"
          name="email"
          validation={loginValidation.email}
          register={register}
          errors={errors}
        />
        <AuthInputBox
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          name="password"
          type="password"
          validation={loginValidation.password}
          register={register}
          errors={errors}
          eyeIconActive={true}
        />
        <button type="submit">버튼 추후 공통 컴포넌트로 전환 예정</button>
      </form>

      {/* 회원가입 리다이렉트 */}
      <div className="text-var-gray8 text-[16px]">
        회원이 아니신가요?
        <Link href="/signup" className="underline ml-[5px]">
          회원가입하기
        </Link>
      </div>
    </div>
  );
}