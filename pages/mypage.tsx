import MyPageInput from '@/components/MyPageInput/MyPageInput';
import SidenNavigation from '@/components/SideNavigation/SideNavigation';
import SidenNavigationMobile from '@/components/SideNavigation/SideNavigationMobile';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function MyPage() {
  return (
    <>
      <div className="flex justify-center w-full mt-[72px] gap-[24px] t:mt-[24px] t:gap-[16px] m:mt-[26px]">
        <div className="m:hidden">
          <SidenNavigation />
        </div>
        <MyPageInput />
      </div>
      <SidenNavigationMobile />
    </>
  );
}
