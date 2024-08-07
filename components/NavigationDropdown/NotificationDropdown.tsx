import { CloseButton } from '../Button/Button';
import { NotificationDropdownProps } from './NotificationDropdown.types';
import { useEffect } from 'react';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import useDeleteNotification from '@/hooks/useDeleteNotification';
import { useInView } from 'react-intersection-observer';
import useGetNotificationList from '@/hooks/useGetNotificationList';
import formatTimeAgo from '@/utils/formatTimeAgo';
import Link from 'next/link';

export default function NotificationDropdown({
  data,
  onClick,
}: NotificationDropdownProps) {
  const { deleteNotificationMutation } = useDeleteNotification();
  const { ref, inView } = useInView();
  const { fetchNextPage, notificationList, hasNextPage, isFetchingNextPage } =
    useGetNotificationList();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, hasNextPage]);

  const ContentWithHighlights = (content: string): JSX.Element[] => {
    const parts = content.split(/(승인|거절)/gi);
    return parts.map((part, index) => {
      if (part.toLowerCase() === '승인') {
        return (
          <span key={index} className="text-blue-500 font-bold">
            {part}
          </span>
        );
      } else if (part.toLowerCase() === '거절') {
        return (
          <span key={index} className="text-red-500 font-bold">
            {part}
          </span>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteNotificationMutation.mutateAsync(id);
    } catch (error) {
      console.error('알림 삭제에 실패했습니다', error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="z-50 px-[20px] py-[17px] absolute top-[80%] right-[8%] t:right-[8%] w-[368px] h-[360px] animate-slideDown flex-col justify-center overflow-y-auto scrollbar-hide rounded-[5px] m:fixed m:inset-0 m:rounded-none m:w-full m:h-full bg-var-green1 dark:bg-var-dark2 dark:border-solid dark:border-var-dark3 border border-none">
      <div className="flex text-[20px] font-bold mb-[10px] justify-between ">
        알림 {data ? `${data.totalCount}` : '0'}개
        <CloseButton onClick={onClick} />
      </div>
      {notificationList && data?.totalCount ? (
        <div className="flex flex-col items-center gap-[17px]">
          {notificationList.map((notification) => (
            <div
              key={notification.id}
              className="flex-col  items-center px-[12px] pt-[10px] pb-[7px] justify-between rounded-[5px] border-b w-[328px] min-h-[120px] m:w-[335px] bg-white border-gray-200 dark:bg-var-dark4 "
            >
              <div className="flex justify-between">
                <StatusIndicator
                  size="small"
                  status={
                    notification.content.toLowerCase().includes('승인')
                      ? 'approved'
                      : 'denied'
                  }
                />
                <div className="h-[24px]">
                  <CloseButton onClick={() => handleDelete(notification.id)} />
                </div>
              </div>
              <Link href="/reservation">
                <div className="w-[298px] min-h-[44px] mb-[4px]">
                  {ContentWithHighlights(notification.content)}
                </div>
                <div className="text-[12px]">
                  {formatTimeAgo(notification.updatedAt)}
                </div>
              </Link>
            </div>
          ))}
          {hasNextPage && <div ref={ref} />}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[245px] bg-white py-[24px] rounded-[5px] m:bg-var-green1 m:px-[20px] m:py-[40px] dark:bg-var-dark3">
          새로운 알림이 없습니다.
        </div>
      )}
    </div>
  );
}
