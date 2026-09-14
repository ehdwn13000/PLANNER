# Planner 아키텍처 / 데이터 설계

## 데이터 모델

```
Category (Level 1)
├─ id: string
├─ name: string
└─ createdAt: string (ISO)

Project (Level 2)
├─ id: string
├─ categoryId: string   // 소속 Category
├─ name: string
├─ note: string         // 자유 메모 (기억해야 할 것들)
├─ completed: boolean   // 수동 완료 처리
├─ completedAt: string | null
└─ createdAt: string

Item (Level 3, 실행항목)
├─ id: string
├─ projectId: string    // 소속 Project
├─ name: string
├─ dueDate: string | null
├─ priority: "상" | "중" | "하"
├─ completed: boolean
├─ completedAt: string | null
└─ createdAt: string

QuickNote (빠른 메모, 계층 없음)
├─ id: string
├─ text: string
├─ tag: "개인" | "업무"
├─ dueDate: string | null   // 지정 시 주간 뷰(이번 주/다음 주)에도 함께 표시
├─ completed: boolean
└─ createdAt: string
```

## 저장 방식
- 브라우저 `localStorage`에 아래 형태의 단일 JSON으로 저장
```json
{
  "categories": [],
  "projects": [],
  "items": [],
  "quickNotes": []
}
```
- 서버/DB 없음. 추후 필요 시 서버 동기화로 확장 가능하도록 데이터 접근 로직을 한 곳(데이터 레이어)에 모아둔다.

## 화면별 데이터 조회 규칙
| 화면 | 조회 로직 |
|---|---|
| 기본 화면 | categories → 각 category의 projects(completed=false) → 각 project의 items(completed=false), 완료율 = completed items / total items |
| 오늘 할 일 | items.filter(dueDate == 오늘 && completed == false) |
| 급한 일 보기 | items.filter(completed == false), dueDate 오름차순 정렬 |
| 주간 뷰 | items.filter(completed == false && (dueDate가 이번 주 이내 이거나 dueDate 존재)), 마감(이번 주 마감)/진행중(그 외 미완료)/지연(dueDate < 오늘) 구분하여 색상 표시 |
| 히스토리 | categories → projects(completed=true 포함) → items(completed=true), 구조 그대로 표시 |

## 설계 원칙 (앱 확장 대비)
- **데이터 레이어**와 **UI(화면) 레이어**를 분리한다.
  - 데이터 레이어: localStorage 읽기/쓰기, CRUD 함수들 (예: `getCategories()`, `addItem()`, `completeItem(id)` 등)
  - UI 레이어: 화면 컴포넌트, 데이터 레이어의 함수만 호출
- 이렇게 분리해두면 추후 React Native/Flutter 등으로 UI만 새로 만들고 데이터 레이어(또는 그 로직)를 재사용하기 쉬움
