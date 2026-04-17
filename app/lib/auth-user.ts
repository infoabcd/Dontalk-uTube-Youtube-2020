import { isPrivilegedUser } from "@/app/lib/privileged";

/** 前端 Redux / 登入回傳用的使用者物件（含是否為特權帳號） */
export function toAuthClientUser(user: {
  id: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  banner?: string | null;
  description?: string | null;
}) {
  return {
    uid: user.id,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    ...(user.banner !== undefined ? { banner: user.banner } : {}),
    ...(user.description !== undefined ? { description: user.description } : {}),
    isPrivileged: isPrivilegedUser(user.id, user.email),
  };
}
