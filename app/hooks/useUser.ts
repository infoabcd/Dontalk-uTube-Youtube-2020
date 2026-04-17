import { useSelector } from 'react-redux';
import type { RootState } from '../store';

function useUser() {
  const userdetail = useSelector((state: RootState) => state.userdetail);

  const userprofile = userdetail.profile;
  return { userdetail, userprofile };
}

export default useUser;
