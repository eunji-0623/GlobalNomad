import Image from 'next/image';
import StarImg from '@/public/icon/Star.svg';
import CatergoryBtn from '../CatergoryBtn/CatergoryBtn';
import PriceFilterBtn from '../PriceFilterBtn/PriceFilterBtn';
import { useCallback, useEffect } from 'react';
import { AllActivityProps } from './AllActivities.type';
import { getActivityList } from '@/pages/api/activities/apiactivities';
import { getActivityListResponse } from '@/pages/api/activities/apiactivities.types';
import { getActivityListParams } from '@/pages/api/activities/apiactivities.types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Pagination from '../Pagination/Pagination';
import { useRecoilState, useRecoilValue } from 'recoil';
import { mainPageKategorieState, mainPageState } from '@/states/mainPageState';
import Spinner from '../Spinner/Spinner';

const Kategories = ['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'];

export function AllActivity({
  title,
  backgroundImage,
  price,
  rating,
  reviewCount,
  id,
}: AllActivityProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/activity-details/${id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div
        className="w-[276px] t:w-[206px] m:w-[146px] h-[276px] t:h-[206px] m:h-[146px] rounded-xl bg-[url('/image/Testimage.jpg')] bg-cover transition-transform duration-300 hover:scale-110 m:hover:scale-105"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.10) 20.33%, rgba(0, 0, 0, 0.60) 100%),url(${backgroundImage})`,
        }}
      ></div>
      <div className="hover:bg-gray-200 dark:hover:bg-var-dark2 rounded px-[4px]">
        <div className="flex items-center mt-[16.5px]">
          <Image
            src={StarImg}
            alt="별점 표시 이미지"
            width={20}
            height={20}
          ></Image>
          <div className="font-sans text-[16px] font-[500] ml-[5px]">
            {rating ? rating.toFixed(1) : 0}{' '}
            <span className="font-sans text-[16px] text-[#A1A1A1] font-[500] ">
              ({reviewCount ? reviewCount : 0})
            </span>
          </div>
        </div>
        <div className="h-[70px] t:h-[30px] m:h-[20px] m:w-[146px] font-sans text-[24px] m:text-[16px] font-[600] mt-[10px] overfolow-hidden t:truncate ... m:truncate ...">
          {title}
        </div>
        <div className="font-sans text-[28px] text-[20px] m:text-[18px] font-[700] p:mt-[0px] mt-[10px]">
          ₩{price.toLocaleString()}{' '}
          <span className="font-sans text-[16px] font-[400]">/ 인</span>
        </div>
      </div>
    </div>
  );
}

function AllActivities() {
  const [MainPageState, setMainPageState] = useRecoilState(mainPageState);

  const {
    itemsPerPage: items_per_page,
    selectedSorted,
    currentPage,
  } = useRecoilValue(mainPageState);

  const { KategorieName } = useRecoilValue(mainPageKategorieState);

  const setItemsPerPage = useCallback(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;

      let newItemsPerPage;
      if (width >= 1281) {
        newItemsPerPage = 8;
      } else if (width > 744) {
        newItemsPerPage = 9;
      } else {
        newItemsPerPage = 6;
      }

      // 상태 변경이 필요할 때만 setState 호출
      setMainPageState((prevState) => {
        if (prevState.itemsPerPage !== newItemsPerPage) {
          return {
            ...prevState,
            itemsPerPage: newItemsPerPage,
            currentPage: 1,
          };
        }
        return prevState;
      });
    }
  }, []);

  const params: getActivityListParams = {
    method: 'offset',
    cursorId: null,
    category: KategorieName,
    keyword: null,
    sort: selectedSorted,
    page: currentPage,
    size: items_per_page,
  };

  const {
    data: allActivitiesData,
    error,
    isLoading,
  } = useQuery<getActivityListResponse>({
    queryKey: ['AllActivities', params],
    queryFn: () => getActivityList(params),
  });

  const handlePageChange = (page: number) => {
    setMainPageState((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };

  useEffect(() => {
    setItemsPerPage();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', setItemsPerPage);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', setItemsPerPage);
      }
    };
  }, [setItemsPerPage]);

  useEffect(() => {
    const params: getActivityListParams = {
      method: 'offset',
      cursorId: null,
      category: KategorieName,
      keyword: null,
      sort: selectedSorted,
      page: currentPage,
      size: items_per_page,
    };
  }, [currentPage, items_per_page, selectedSorted]);

  return (
    <div>
      <div className="flex justify-between">
        <div className="relative t:w-[520px] m:w-[230px]">
          <div className="flex gap-[24px] t:gap-[14px] m:gap-[8px] t:w-[520px] m:w-[230px] overflow-auto scrollbar-hide">
            {Kategories.map((Kategorie, index) => (
              <CatergoryBtn key={index} categoryName={Kategorie} />
            ))}
          </div>
          <div className="p:hidden absolute top-0 right-0 w-20 m:w-3 h-full pointer-events-none bg-gradient-to-l from-white dark:from-var-dark1 to-transparent"></div>
        </div>
        <PriceFilterBtn />
      </div>
      <div className="font-sans text-[36px] font-[700] mt-[40px] mb-[30px]">
        {KategorieName ? KategorieName : '🛼 모든 체험'}
      </div>
      {isLoading ? (
        <div className="mt-[-300px]">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-4 t:grid-cols-3 m:grid-cols-2 grid-rows-2 gap-[20px] t:gap-[14px] m:gap-[8px] gap-y-[48px] mb-[40px] overflow-auto scrollbar-hide px-[20px] pt-[20px]">
          {allActivitiesData?.activities.map((data) => (
            <AllActivity
              key={data.id}
              title={data.title}
              backgroundImage={data.bannerImageUrl}
              price={data.price}
              rating={data.rating}
              reviewCount={data.reviewCount}
              id={data.id}
            />
          ))}
        </div>
      )}
      <div className="text-[30px] font-[700] flex justify-center mb-[342px] m:mb-[160px] mt-[70px]">
        {allActivitiesData && allActivitiesData.totalCount > 0 && (
          <Pagination
            totalItems={allActivitiesData?.totalCount}
            itemsPerPage={items_per_page}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export default AllActivities;
