from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.scan_log import ScanLog
from backend.schemas.scan_log_schema import ScanStatus


class ScanLogRepository:
    """
    스캔 로그 데이터 접근 계층

    스캔 이벤트 로그의 데이터베이스 연산을 담당한다.
    FOUND/LOST 상태의 스캔 기록 저장, 최신 스캔 로그 조회, 아이템별 스캔 히스토리 관리 등을 수행한다.

    주요 책임:
    - 스캔 이벤트 로그 저장 및 조회
    - 아이템별 최신 스캔 상태 추적
    - 가족 단위 스캔 로그 집계
    - 모니터링용 최신 상태 정보 제공
    """
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_device_id: int, item_id: int, status: ScanStatus) -> ScanLog:
        scan_log = ScanLog(
            user_device_id=user_device_id,
            item_id=item_id,
            status=status.value
        )
        self.db.add(scan_log)
        self.db.flush()
        return scan_log

    def exists_by_user_device_id(self, user_device_id: int) -> bool:
        stmt = select(ScanLog.id).where(ScanLog.user_device_id == user_device_id).limit(1)
        return self.db.execute(stmt).scalar_one_or_none() is not None

    def find_latest_by_item_ids(self, item_ids: list[int]) -> dict[int, ScanLog]:
        if not item_ids:
            return {}

        stmt = select(ScanLog).where(
            ScanLog.item_id.in_(item_ids)
        ).order_by(ScanLog.scanned_at.desc(), ScanLog.id.desc())

        latest_logs_by_item_id: dict[int, ScanLog] = {}
        for scan_log in self.db.execute(stmt).scalars().all():
            if scan_log.item_id not in latest_logs_by_item_id:
                latest_logs_by_item_id[scan_log.item_id] = scan_log

        return latest_logs_by_item_id