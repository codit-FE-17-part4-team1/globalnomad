import type { ActivityDetailInfo } from '@/types/activity';
import type { Reviews } from '@/types/review';
import type { AvailableSchedule } from '@/types/activity';

export const DummyActivityData: ActivityDetailInfo = {
  id: 7,
  userId: 21,
  title: '함께 배우면 즐거운 스트릿댄스',
  description:
    '안녕하세요! 저희 스트릿 댄스 체험을 소개합니다. 저희는 신나고 재미있는 스트릿 댄스 스타일을 가르칩니다. 크럼프는 세계적으로 인기 있는 댄스 스타일로, 어디서든 춤출 수 있습니다. 저희 체험에서는 새로운 스타일을 접할 수 있고, 즐거운 시간을 보낼 수 있습니다. 저희는 초보자부터 전문가까지 어떤 수준의 춤추는 사람도 가르칠 수 있도록 준비해놓았습니다. 저희와 함께 즐길 수 있는 시간을 기대해주세요! 각종 음악에 적합한 스타일로, 저희는 크럼프 외에도 전통적인 스트릿 댄스 스타일과 최신 스트릿 댄스 스타일까지 가르칠 수 있습니다. 저희 체험에서는 전문가가 직접 강사로 참여하기 때문에, 저희가 제공하는 코스는 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있도록 준비해놓았습니다. 저희 체험을 참가하게 된다면, 즐거운 시간 뿐만 아니라 새로운 스타일을 접할 수 있을 것입니다.',
  category: '투어',
  price: 10000,
  address: '서울특별시 강남구 테헤란로 427',
  bannerImageUrl: '/images/street_dance.png',
  subImages: [
    { id: 1, imageUrl: '/images/fjord.png' },
    { id: 2, imageUrl: '/images/bridge.png' },
    { id: 3, imageUrl: '/images/forest.png' },
    { id: 4, imageUrl: '/images/pakata.png' },
  ],
  schedules: [
    { id: 1, date: '2023-12-01', startTime: '12:00', endTime: '13:00' },
    { id: 2, date: '2023-12-05', startTime: '12:00', endTime: '13:00' },
  ],
  reviewCount: 5,
  rating: 4.74,
  createdAt: '2023-12-31T21:28:50.589Z',
  updatedAt: '2023-12-31T21:28:50.589Z',
};

export const DummyAvailableScheduleData: AvailableSchedule[] = [
  {
    date: '2025-10-18',
    times: [
      { id: 1, startTime: '10:00', endTime: '11:00' },
      { id: 2, startTime: '13:00', endTime: '14:30' },
      { id: 3, startTime: '16:00', endTime: '17:00' },
    ],
  },
  {
    date: '2025-10-20',
    times: [
      { id: 4, startTime: '09:30', endTime: '10:30' },
      { id: 5, startTime: '11:00', endTime: '12:30' },
    ],
  },
  {
    date: '2025-10-21',
    times: [
      { id: 6, startTime: '10:00', endTime: '11:00' },
      { id: 7, startTime: '14:00', endTime: '15:00' },
      { id: 8, startTime: '17:30', endTime: '18:30' },
      { id: 9, startTime: '17:30', endTime: '18:30' },
      { id: 10, startTime: '17:30', endTime: '18:30' },
      { id: 11, startTime: '17:30', endTime: '18:30' },
      { id: 12, startTime: '17:30', endTime: '18:30' },
      { id: 13, startTime: '17:30', endTime: '18:30' },
      { id: 14, startTime: '17:30', endTime: '18:30' },
      { id: 15, startTime: '17:30', endTime: '18:30' },
      { id: 16, startTime: '17:30', endTime: '18:30' },
      { id: 17, startTime: '14:00', endTime: '15:00' },
      { id: 18, startTime: '17:30', endTime: '18:30' },
      { id: 19, startTime: '17:30', endTime: '18:30' },
      { id: 20, startTime: '17:30', endTime: '18:30' },
      { id: 21, startTime: '17:30', endTime: '18:30' },
      { id: 22, startTime: '17:30', endTime: '18:30' },
      { id: 23, startTime: '17:30', endTime: '18:30' },
      { id: 24, startTime: '17:30', endTime: '18:30' },
      { id: 25, startTime: '17:30', endTime: '18:30' },
      { id: 26, startTime: '17:30', endTime: '18:30' },
    ],
  },
  {
    date: '2025-10-22',
    times: [
      { id: 9, startTime: '09:00', endTime: '10:00' },
      { id: 10, startTime: '11:30', endTime: '12:30' },
      { id: 11, startTime: '15:00', endTime: '16:30' },
    ],
  },
];

export const DummyReviewData: Reviews = {
  averageRating: 4.2,
  totalCount: 8,
  reviews: [
    {
      id: 1,
      user: { profileImageUrl: '', nickname: '김태현', id: 101 },
      activityId: 1,
      rating: 5,
      content:
        '저는 저희 스트릿 댄서 체험에 참가하게 된 지 얼마 안됐지만, 정말 즐거운 시간을 보냈습니다. 새로운 스타일과 춤추기를 좋아하는 나에게 정말 적합한 체험이었고, 전문가가 직접 강사로 참여하기 때문에 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있었습니다. 강사님께서 정말 친절하게 설명해주셔서 정말 좋았고, 이번 체험을 거쳐 새로운 스타일과 춤추기에 대한 열정이 더욱 생겼습니다. 저는 이 체험을 적극 추천합니다!',
      createdAt: '2025-10-09T10:00:00Z',
      updatedAt: '2025-10-09T10:00:00Z',
    },
    {
      id: 2,
      user: {
        profileImageUrl: '/images/zootopia_asloth.jpg',
        nickname: '조민선',
        id: 102,
      },
      activityId: 1,
      rating: 4,
      content:
        '저는 저희 스트릿 댄서 체험에 참가하게 된 지 얼마 안됐지만, 정말 즐거운 시간을 보냈습니다. 전문가가 직접 강사로 참여하기 때문에 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있었고, 강사님의 친절한 설명 덕분에 저는 새로운 스타일과 춤추기에 대한 열정이 더욱 생겼습니다.',
      createdAt: '2025-10-08T14:30:00Z',
      updatedAt: '2025-10-08T14:30:00Z',
    },
    {
      id: 3,
      user: {
        profileImageUrl: '/images/zootopia_asloth.jpg',
        nickname: '강지현',
        id: 103,
      },
      activityId: 1,
      rating: 4,
      content:
        '친절한 전문가가 직접 강사로 참여하기 때문에 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있었습니다. 이번 체험을 거쳐 저의 춤추기 실력은 더욱 향상되었어요. 편안한 체험이었습니다.',
      createdAt: '2025-10-07T09:15:00Z',
      updatedAt: '2025-10-07T09:15:00Z',
    },
    {
      id: 4,
      user: {
        profileImageUrl: '/images/zootopia_asloth.jpg',
        nickname: 'Daisy',
        id: 104,
      },
      activityId: 1,
      rating: 5,
      content: '아이들과 함께 즐기기 좋아요!',
      createdAt: '2025-10-06T16:45:00Z',
      updatedAt: '2025-10-06T16:45:00Z',
    },
    {
      id: 5,
      user: {
        profileImageUrl: '/images/zootopia_asloth.jpg',
        nickname: 'Ethan',
        id: 105,
      },
      activityId: 1,
      rating: 3,
      content: '보통이었어요. 기대만큼은 아니었네요.',
      createdAt: '2025-10-05T11:20:00Z',
      updatedAt: '2025-10-05T11:20:00Z',
    },
    {
      id: 6,
      user: {
        profileImageUrl: '/images/zootopia_asloth.jpg',
        nickname: 'Fiona',
        id: 106,
      },
      activityId: 1,
      rating: 5,
      content: '강력 추천합니다! 최고의 경험이었어요.',
      createdAt: '2025-10-04T13:00:00Z',
      updatedAt: '2025-10-04T13:00:00Z',
    },
    {
      id: 7,
      user: {
        profileImageUrl: '/images/zootopia_asloth.jpg',
        nickname: 'George',
        id: 107,
      },
      activityId: 1,
      rating: 4,
      content: '재미있게 잘 즐겼습니다.',
      createdAt: '2025-10-03T08:10:00Z',
      updatedAt: '2025-10-03T08:10:00Z',
    },
    {
      id: 8,
      user: {
        profileImageUrl: '/images/zootopia_asloth.jpg',
        nickname: 'Hannah',
        id: 108,
      },
      activityId: 1,
      rating: 4,
      content: '친절한 가이드 덕분에 편하게 즐겼어요.',
      createdAt: '2025-10-02T15:25:00Z',
      updatedAt: '2025-10-02T15:25:00Z',
    },
  ],
};
