import React from "react";
import { graphql, navigate, Link } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import RouteCard from "../components/ui/RouteCard";
import BreadCrumbs from "../components/ui/BreadCrumbs";
import { pathOrParentIdToGitHubLink } from "../js/utils";
import AreaCard from "../components/ui/AreaCard";
import LinkToGithub from "../components/ui/LinkToGithub";
import { h1, h2, p } from "../components/ui/shortcodes.js";
import { template_h1_css } from "../js/styles";
import AreaStatistics from "../components/AreaStatistics";
import ClimbDetail from "../components/graphql/ClimbDetail";
import AreaDetail from "../components/graphql/AreaDetail";

const shortcodes = {
  h1,
  h2,
  p,
};

/**
 * Templage for generating individual Area page
 */
export default function LeafAreaPage({ data: { area, climbs } }) {
  const { area_name } = area.frontmatter;

  const { pathTokens, rawPath, children } = area;
  const githubLink = pathOrParentIdToGitHubLink(rawPath, "index");
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO keywords={[area_name]} title={area_name} />
      <BreadCrumbs pathTokens={pathTokens} />
      <h1 className={template_h1_css}>{area_name}</h1>
      <div className="float-right">
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/edit?file=${rawPath}/index.md`)}
        >
          Edit
        </button>
      </div>
      <AreaStatistics climbs={climbs}></AreaStatistics>
      <MDXProvider components={shortcodes}>
        <MDXRenderer frontmatter={area.frontmatter}>
          {area.parent.body}
        </MDXRenderer>
      </MDXProvider>
      <div className="grid grid-cols-3 gap-x-3">
        {children.map((node) => {
          const { frontmatter, slug } = node;
          const { area_name, metadata } = frontmatter;
          return (
            <div className="pt-6 max-h-96" key={metadata.legacy_id}>
              <Link to={slug}>
                <AreaCard area_name={area_name}></AreaCard>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-x-3">
        {climbs.edges.map(({ node }) => {
          const { frontmatter } = node;
          const { yds, route_name, metadata, type } = frontmatter;
          const { slug } = node;
          return (
            <div className="pt-6 max-h-96" key={metadata.legacy_id}>
              <Link to={slug}>
                <RouteCard
                  route_name={route_name}
                  legacy_id={metadata.legacy_id}
                  YDS={yds}
                  // safety="{}" TODO: Find out what routes have this value?
                  type={type}
                ></RouteCard>
              </Link>
            </div>
          );
        })}
      </div>
      <LinkToGithub link={githubLink} docType="area"></LinkToGithub>
    </Layout>
  );
}

export const query = graphql`
  query ($node_id: String!) {
    area: area(id: { eq: $node_id }) {
      ...AreaDetailFragment
      parent {
        ... on Mdx {
          body
        }
      }
      children {
        ...AreaDetailFragment
      }
    }
    climbs: allClimb(
      filter: { area: { id: { eq: $node_id } } }
      sort: { fields: frontmatter___metadata___left_right_index }
    ) {
      edges {
        node {
          area {
            id
          }
          ...ClimbDetailFragment
        }
      }
    }
  }
`;
