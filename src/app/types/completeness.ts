/**
 * טיפוסי נתונים לניהול שלמות השדות ב-One Pager
 */

export type FieldStatus = "empty" | "partial" | "complete";

export interface FieldCompleteness {
  fieldName: string; // שם השדה (mission, about, וכו')
  status: FieldStatus; // סטטוס השלמה
  requiredForCompletion: boolean; // האם הכרחי לסיום
  score: number; // ציון 0-10 לאיכות התוכן
  feedback?: string; // משוב על איכות השדה
  lastUpdated: Date; // מתי עודכן לאחרונה
}

export interface ConversationStatus {
  conversationId: string; // מזהה ייחודי לשיחה
  status: "starting" | "in-progress" | "complete" | "missing-data";
  fields: Record<string, FieldCompleteness>; // מיפוי שלמות לפי שדה
  overallScore: number; // ציון כולל 0-10
  startTime: Date; // זמן התחלת השיחה
  lastUpdateTime: Date; // זמן עדכון אחרון
}

// הגדרת השדות ההכרחיים ל-One Pager איכותי
export const REQUIRED_FIELDS = ["about", "mission", "financial"];

// חישוב האם שיחה מוכנה לסיום
export function isConversationComplete(status: ConversationStatus): boolean {
  // בדיקה שכל השדות ההכרחיים מלאים
  const hasAllRequired = REQUIRED_FIELDS.every(
    (field) => status.fields[field]?.status !== "empty"
  );

  // בדיקת ציון מינימלי
  const hasMinimalScore = status.overallScore >= 3; // מינימום מקובל

  return hasAllRequired && hasMinimalScore;
}

// חישוב איזה שדה יש לשאול עליו בשאלה הבאה
export function getNextFieldToAsk(status: ConversationStatus): string | null {
  // קודם בדוק שדות הכרחיים חסרים
  for (const field of REQUIRED_FIELDS) {
    if (!status.fields[field] || status.fields[field].status === "empty") {
      return field;
    }
  }

  // אחר כך בדוק שדות חלקיים לפי סדר חשיבות
  for (const field of REQUIRED_FIELDS) {
    if (status.fields[field]?.status === "partial") {
      return field;
    }
  }

  // בדוק שדות לא הכרחיים חסרים
  for (const fieldName in status.fields) {
    if (
      status.fields[fieldName].status === "empty" &&
      !REQUIRED_FIELDS.includes(fieldName)
    ) {
      return fieldName;
    }
  }

  return null; // כל השדות מלאים
}
