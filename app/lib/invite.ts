/**
 * 環境變數 INVITE_CODES：逗號分隔的多個邀請碼（前後空白會略過）。
 * - 若未設定或解析後為空陣列：不強制邀請碼（方便本機開發）。
 * - 若有至少一個有效碼：註冊必須帶 `inviteCode` 且完全相符（大小寫敏感）。
 */
export function getValidInviteCodes(): string[] {
  const raw = process.env.INVITE_CODES ?? "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isInviteRequired(): boolean {
  return getValidInviteCodes().length > 0;
}

export function isValidInviteCode(code: string | undefined): boolean {
  const codes = getValidInviteCodes();
  if (codes.length === 0) return true;
  if (code == null || typeof code !== "string") return false;
  return codes.includes(code.trim());
}
