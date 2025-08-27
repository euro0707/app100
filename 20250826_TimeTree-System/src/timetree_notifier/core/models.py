"""データモデル定義"""

from datetime import datetime, date
from dataclasses import dataclass
from typing import Optional, List
from pathlib import Path


@dataclass
class Event:
    """予定イベントモデル"""
    title: str
    start_time: datetime
    end_time: Optional[datetime] = None
    description: str = ""
    location: str = ""
    
    @property
    def is_all_day(self) -> bool:
        """終日イベントかどうか"""
        return self.end_time is None or (
            isinstance(self.start_time, date) and isinstance(self.end_time, date)
        )
    
    def format_time_range(self) -> str:
        """時間範囲の文字列フォーマット"""
        if self.is_all_day:
            return "終日"
        
        start_time = self.start_time.strftime('%H:%M')
        if self.end_time:
            end_time = self.end_time.strftime('%H:%M')
            return f"{start_time}-{end_time}"
        else:
            return start_time


@dataclass
class NotificationResult:
    """通知結果モデル"""
    success: bool
    message: str = ""
    error_message: Optional[str] = None
    sent_at: Optional[datetime] = None
    
    def __post_init__(self):
        if self.success and self.sent_at is None:
            self.sent_at = datetime.now()


@dataclass
class ExportResult:
    """TimeTree-Exporter実行結果"""
    success: bool
    output_file: Optional[Path] = None
    error_message: Optional[str] = None
    execution_time: float = 0.0
    error_type: Optional[str] = None


@dataclass
class DailySummary:
    """日次サマリーモデル"""
    date: date
    events: List[Event]
    total_events: int
    message: str
    generated_at: datetime
    
    def __post_init__(self):
        if self.total_events is None:
            self.total_events = len(self.events)