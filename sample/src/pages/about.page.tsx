import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { usePreloadedQuery } from "../hooks/usePreloadedQuery";
import { useDispose } from "../hooks/useDispose";

const AboutPage = () => {
  const data = usePreloadedQuery();
  useDispose();

  return (
    <Layout title="About | Next.js + TypeScript Example">
      <h1>About</h1>
      <p>This is the about page {data.sample}</p>
      <p>
        <Link href="/">
          <a>Go home</a>
        </Link>
      </p>
    </Layout>
  );
};

export default AboutPage;
