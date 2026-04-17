import React, { createRef } from 'react';
import styled from 'styled-components';
import { setWidth } from '../reducers/gridSlice';
import store from '../store';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  max-width: 100%;
  padding: 24px 24px 0;
`;

type VideoGridFlexProps = {
  miniWidth: number;
  children?: React.ReactNode;
};

class VideoGridFlex extends React.Component<VideoGridFlexProps> {
  ref: React.RefObject<HTMLDivElement | null>;

  constructor(props: VideoGridFlexProps) {
    super(props);
    this.ref = createRef<HTMLDivElement>();
  }

  componentDidMount() {
    this.calcWidth();
    window.addEventListener('resize', this.calcWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calcWidth);
  }

  calcWidth = () => {
    const { miniWidth } = this.props;
    // container padding both side: 24px;
    // minus scrollbar width;
    const el = this.ref.current;
    if (!el) return;
    const w = el.getBoundingClientRect().width - 48 - 15;
    const column = Math.floor(w / miniWidth) || 1;
    store.dispatch(setWidth(w / column));
  };

  render() {
    const { children } = this.props;
    return <Wrapper ref={this.ref}>{children}</Wrapper>;
  }
}

export default VideoGridFlex;
