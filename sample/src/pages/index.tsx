import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { usePreloadedQuery } from "../hooks/usePreloadedQuery";
// import { useDispose } from "../hooks/useDispose";

const IndexPage = () => {
  const data = usePreloadedQuery();
  // useDispose();

  return (
    <Layout title="Hello | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
      <p>{data.sample}</p>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
    </Layout>
  );
};

export default IndexPage;
