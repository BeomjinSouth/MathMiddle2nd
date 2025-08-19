export interface Step {
  id: string;
  title: string;
  goal: string;
  hints: string[];
  criteria: string[];
  onSuccessMessage: string;
}

export const isoscelesSteps: Step[] = [
  {
    id: '1',
    title: '보조선 긋기',
    goal: '∠A의 이등분선을 그어 변 BC와의 교점을 D라고 하자.',
    hints: [
      'A에서 시작해 ∠A를 양분하는 반직선을 그어 보세요.',
      '교점에 D 라벨을 붙여보세요.',
    ],
    criteria: ['isAngleBisector', 'isPointOnLine'],
    onSuccessMessage: '∠A의 이등분선 AD가 올바르게 그어졌습니다!',
  },
  {
    id: '2',
    title: '두 삼각형이 합동임을 보이기',
    goal: '△ABD와 △ACD에서 SAS 합동 조건을 확인하자.',
    hints: [
      'AB = AC (이등변삼각형의 정의)',
      '∠BAD = ∠CAD (각의 이등분선)',
      'AD는 공통변입니다.',
    ],
    criteria: ['isSASCongruent'],
    onSuccessMessage: '△ABD ≡ △ACD 임이 확인되었습니다!',
  },
  {
    id: '3',
    title: '이등변삼각형의 두 밑각의 크기가 서로 같음을 보이기',
    goal: '따라서 ∠B = ∠C임을 확인하자.',
    hints: [
      '합동인 삼각형의 대응각은 크기가 같습니다.',
      '각도를 측정해서 확인해보세요.',
    ],
    criteria: ['isBaseAnglesEqual'],
    onSuccessMessage: '∠B = ∠C 임이 증명되었습니다!',
  },
  {
    id: '2-2',
    title: '꼭지각의 이등분선은 밑변을 수직 이등분한다',
    goal: 'AD가 BC를 수직이등분함을 확인하자.',
    hints: [
      'BD = CD인지 확인해보세요.',
      '∠ADB = ∠ADC = 90°인지 확인해보세요.',
    ],
    criteria: ['isMidpoint', 'isPerpendicular'],
    onSuccessMessage: 'AD가 BC의 수직이등분선임이 확인되었습니다!',
  },
];
