"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const CodeBlock = dynamic(() => import('../../../components/CodeBlock'), { ssr: false });

const CodeBlockPage: React.FC = () => {
  const params = useParams();
  const blockName = params.blockName as string; 

  if (!blockName) {
    return <div>Loading...</div>;
  }

  return <CodeBlock />;
};

export default CodeBlockPage;
