import React, { FormEvent, KeyboardEvent, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import { SearchIcon } from './Icons';

const Wrapper = styled.div`
  display: flex;
  height: 32px;
  width: min(640px, 100%);

  form {
    display: flex;
    height: 100%;
    width: 100%;
  }

  .input-box {
    flex: 1;
    padding: 2px 6px;
    border: 1px solid ${(props) => props.theme.divider};
    border-right: none;
    background: ${(props) => props.theme.barBg};
  }
  input {
    border: none;
    width: 100%;
    min-width: 0;
    color: ${(props) => props.theme.primaryColor};
    background: transparent;
  }
  button {
    width: 65px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border: 1px solid ${(props) => props.theme.divider};
    background-color: ${(props) => props.theme.channelBg};
    cursor: pointer;
  }
  button:hover {
    background-color: ${(props) => props.theme.itemHover};
    svg {
      fill: ${(props) => props.theme.primaryColor};
    }
  }

  @media screen and (max-width: 768px) {
    height: 34px;

    .input-box {
      padding: 2px 8px;
    }

    button {
      width: 44px;
    }

    input {
      font-size: 14px;
    }
  }
`;

const Search = () => {
  const search = useInput('');
  const router = useRouter();
  const pathname = usePathname();
  const routeParams = useParams();

  useEffect(() => {
    if (!pathname?.startsWith('/search')) return;
    const seg = routeParams?.query;
    if (typeof seg !== 'string' || !seg) return;
    try {
      const decoded = decodeURIComponent(seg);
      if (decoded !== search.value) {
        search.setValue(decoded);
      }
    } catch {
      /* ignore */
    }
  }, [pathname, routeParams?.query]);

  const performSearch = () => {
    const query = search.value.trim();
    if (!query) return;
    router.push(`/search/${encodeURIComponent(query)}`);
    search.setValue('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performSearch();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      performSearch();
    }
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            placeholder="Search"
            type="text"
            value={search.value}
            onChange={search.onChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button type="submit">
          <SearchIcon />
        </button>
      </form>
    </Wrapper>
  );
};

export default Search;
