import { Calendar, ImageOff, MapPinOff, Smartphone, UserX } from 'lucide-react'

import type { HomeCopy } from '@/pages/dashboard/model/homeCopy.types'
import { MAX_PHOTOS_PER_BATCH } from '@/pages/dashboard/model/photoSelectionLimits'

export const homeCopyKo: HomeCopy = {
  homeHero: {
    title: '사진 선택',
    subtitle: '메타데이터를 지우고 더 안전하게 공유하세요.',
  },
  homePrivacyHeading: '개인정보 가이드',
  photoSelection: {
    maxCount: MAX_PHOTOS_PER_BATCH,
    truncatedAlert: (selectedTotal: number) =>
      `한 번에 최대 ${MAX_PHOTOS_PER_BATCH}장까지 처리할 수 있습니다. (선택 ${selectedTotal}장 → 앞의 ${MAX_PHOTOS_PER_BATCH}장만 사용합니다)`,
  },
  privacyTips: [
    {
      Icon: MapPinOff,
      title: '위치 정보를 지워야 하는 이유',
      body: '사진에 담긴 위도·경도는 생활 반경이나 거주지를 드러낼 수 있습니다.',
    },
    {
      Icon: Smartphone,
      title: '기기 지문 숨기기',
      body: '카메라 모델·기기 식별 정보는 사용 중인 기기를 특정하는 데 쓰일 수 있습니다.',
    },
    {
      Icon: UserX,
      title: '얼굴·인물 관련 메타데이터',
      body: '갤러리에 저장된 사람 태그·얼굴 관련 필드는 함께 정리하는 것이 좋습니다.',
    },
    {
      Icon: Calendar,
      title: '촬영 시각의 위험',
      body: '정확한 날짜와 시간은 생활 패턴이나 습관을 추측하게 할 수 있습니다.',
    },
    {
      Icon: ImageOff,
      title: '썸네일에 남는 흔적',
      body: '편집한 원본에도 임베드된 썸네일 등에 이전 정보가 남을 수 있습니다.',
    },
  ],
}
