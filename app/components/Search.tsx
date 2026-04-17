import React, { FormEvent, KeyboardEvent, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import { SearchIcon } from './Icons';

const Wrapper = styled.div`
  display: flex;
  height: 32px;

  form {
    display: flex;
    height: 100%;
  }

  .input-box {
    max-width: 650px;
    padding: 2px 6px;
    border: 1px solid #ccc;
    border-right: none;
  }
  input {
    border: none;
    max-width: 500px;
    min-width: 250px;
    width: 30vw;
  }
  button {
    width: 65px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border: 1px solid #d3d3d3;
    background-color: #f8f8f8;
    cursor: pointer;
  }
  button:hover {
    background-color: #f0f0f0;
    svg {
      fill: ${(props) => props.theme.primaryColor};
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
