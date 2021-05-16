import ContentLoader from "react-content-loader"
import React from 'react';

const ChatLoading = (props: any) => {
  return (
    <ContentLoader viewBox="0 0 400 160" height={160} width={400} {...props}>
    <rect x="0" y="12" rx="5" ry="5" width="220" height="10" />
    <rect x="0" y="29" rx="5" ry="5" width="220" height="10" />
    <rect x="179" y="76" rx="5" ry="5" width="220" height="10" />
    <rect x="179" y="58" rx="5" ry="5" width="220" height="10" />
    <rect x="0" y="104" rx="5" ry="5" width="220" height="10" />
    <rect x="0" y="122" rx="5" ry="5" width="220" height="10" />
    </ContentLoader>
  )
};

export default ChatLoading;