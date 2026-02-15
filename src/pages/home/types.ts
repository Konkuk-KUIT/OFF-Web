/** 진행중인 프로젝트 카드 - API 응답과 동일한 형태로 사용 */
export type HomeProject = {
  id: string;
  title: string;
  type: string;
  typeLabel: string;
  description: string;
  recruiting: boolean;
  recruitSummary?: string;
};

/** 파트너 카드 - API 응답과 동일한 형태로 사용 */
export type HomePartner = {
  id: string;
  role: string;
  description: string;
  experience: string;
};
