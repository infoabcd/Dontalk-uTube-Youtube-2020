/**
 * 特權帳號：可刪除任意影片。透過環境變數設定（擇一或並用）：
 * - ADMIN_USER_IDS：逗號分隔的 User id（cuid）
 * - ADMIN_EMAILS：逗號分隔的電郵（不分大小寫）
 */
export function isPrivilegedUser(
  userId: string,
  email: string | null | undefined
): boolean {
  const idList =
    process.env.ADMIN_USER_IDS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  if (idList.includes(userId)) {
    return true;
  }
  const emailList =
    process.env.ADMIN_EMAILS?.split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean) ?? [];
  if (email && emailList.includes(email.toLowerCase())) {
    return true;
  }
  return false;
}
